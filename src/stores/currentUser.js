import { defineStore } from "pinia";
import { updateEmail, updatePassword, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc, orderBy } from "firebase/firestore/lite";

export const useCurrentUserStore = defineStore('CurrentUser',{
    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        id:null,
        cargo: null,
        email: null,
        nombre: null,
        rol: null,
        uid: null,
        modIds: [],
        modulos: [],
    }),
    actions:{
        
        async getRol(uid){
            try {
                this.loading = true;
                await getDocs( 
                    query( 
                        collection(db, '/usuarios'), 
                        where('uid', '==', uid) 
                    ) 
                ).then((datos) => {
                    
                    this.rol = datos.docs[0].data().rol;

                }).catch((e) => { this.setError(e.message) } );


            } catch (e) {
                this.setError(e.message);
            } finally { this.loading = false; }
        },

        //Consultar los datos del usuario
        async getDatos(){
            try {
                this.loading = true;

                const usuario = await getDocs( 
                    query( 
                        collection(db, '/usuarios'), 
                        where('uid', '==', auth.currentUser.uid) 
                    ) 
                );
                
                if(usuario.docs.length == 1){
                    
                    this.id = usuario.docs[0].id;
                    this.uid = usuario.docs[0].data().uid;
                    this.nombre = usuario.docs[0].data().nombre;
                    this.email = usuario.docs[0].data().email;
                    this.rol = usuario.docs[0].data().rol;
                    this.cargo = usuario.docs[0].data().cargo;
                    this.modIds = usuario.docs[0].data().modulos;

                }else{
                    this.setError('No se encontró al usuario con el id: '+auth.currentUser.uid);
                }

            } catch (e) {
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        //Consultar los módulos asignados al usuario
        async getModulos(){
            try {
                this.loading = true;
                //restablecer datos de los modulos:
                this.modulos = [];
                
                const modulos = await getDocs(
                    query(
                        collection(db, '/modulos'),
                        orderBy('uid','asc'),
                    ), 
                );
                
                modulos.forEach((doc) => {
                    if( this.modIds.includes(doc.data().articulo)){
                        this.modulos.push({fbid: doc.id, ...doc.data()})  
                    }
                })

            } catch(e) {
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        async asignarModulo(modID){
            try{

                this.loading = true;
                if(!this.modIds.includes(modID)){
                    this.modIds.push(modID)

                    await setDoc(
                        doc(db, 'usuarios',this.id),
                        {modulos: this.modIds},
                        {merge:true}
                    ).then(() => {
                        this.setSuccess('Módulo asignado correctamente')
                    }).catch((e) => {
                        this.setError(e.message)
                    })
                }

            } catch(e) { this.setError(e.message) }
            finally { this.loading = false; }
        },

        //Actualizar datos de usuario:
        //Recibe un objeto. ej:
        // {nombre: 'nuevo nombre', cargo: 'Nuevo Cargo'}
        async update(objVal){
            try {
                this.loading = true;

                if(this.id == null){
                    this.getDatos();
                }

                const docRef = doc(db,'usuarios',this.id);
                await setDoc(docRef, objVal, { merge: true })

                this.setSuccess('Actualizado correctamente. Espere...');
                this.resetDatos();

            } catch (e) {
                this.setError('Algo salió mal. Intenta de nuevo.');
                console.log(e);
            } finally {
                this.loading = false;
            }
        },

        //Actualizar datos de usuario:
        //Recibe un objeto. ej:
        // {email: 'nuevo@email.com'}
        async updateEmail(objVal){
            await updateEmail(auth.currentUser,objVal.email).then(
                () => {
                    this.update(objVal)
                }
            ).catch((e) => { this.setError(e.message); })
        },

        //Actualizar datos de usuario:
        //Recibe dos strings
        // pwd y pwdConfirm
        async updatePwd(pwd, pwdConfirm, currentPwd){
            try {
                await signInWithEmailAndPassword(auth, this.email, currentPwd).then(async () => {
                    if(pwd == pwdConfirm){
                        await updatePassword(auth.currentUser,pwd).then(
                            () => {
                                this.setSuccess("Contraseña actualizada correctamente.");
                                return true;
                            }
                        ).catch((e) => { this.setError(e.message); console.log(e.message); return false; })
                    }else{
                        this.setError('Las contraseñas no coinciden')
                    }
                })
            } catch (e) {
                this.setError('La contraseña actual es incorrecta.');
            }
        },

        // Iniciar Sesión
        async login(email, pwd){
            try { this.loading = true;
                const { user } = await signInWithEmailAndPassword( auth, email, pwd ); 
            } catch (error) { console.log(error.message); this.setError('Datos incorrectos'); } 
            finally { this.loading = false; }
        },
        
        //Cerrar Sesión:
        async logout(){
            try { this.loading = true; await signOut(auth) } 
            catch (error) { console.log(error.message); } 
            finally { this.loading = false; }
        },

        /**
         * Devuelve true si existe una sesión iniciada
         */
        async isAuth(){
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(auth, user => {
                    if(user){
                    }
                    resolve(user)
                },(e) => reject(e))
                unsuscribe();
            })
        },

        setError(msg = ''){
            this.message.error = true;
            this.message.success = false;
            this.message.text = msg;
            setTimeout(() => { this.message.error = false; this.message.text = ''; }, 6000);
        },

        setSuccess(msg = ''){
            this.message.success = true;
            this.message.error = false;
            this.message.text = msg;
            setTimeout(() => { this.message.success = false; this.message.text = ''; }, 6000);
        },

        resetDatos(){
            this.id = null;
            this.uid = null;
            this.nombre = null;
            this.email = null;
            this.rol = null;
            this.cargo = null;
            this.modIds = null;
        },

        fecha(){
            const d = new Date(Date.now());
            const mes = getMes();
            function getMes(){
                switch(d.getMonth()+1){
                    case 1: return "enero"; break;
                    case 2: return "febrero"; break;
                    case 3: return "marzo"; break;
                    case 4: return "abril"; break;
                    case 5: return "mayo"; break;
                    case 6: return "junio"; break;
                    case 7: return "julio"; break;
                    case 8: return "agosto"; break;
                    case 9: return "septiembre"; break;
                    case 10: return "octubre"; break;
                    case 11: return "noviembre"; break;
                    case 12: return "diciembre"; break;
                }
            }
            return d.getDate()+' de '+mes+' de '+d.getFullYear();
        }
    }
});