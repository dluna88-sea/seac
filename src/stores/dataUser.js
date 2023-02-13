import { defineStore } from "pinia";
import { updateEmail, updatePassword, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore/lite";

export const useDataUserStore = defineStore('DataUser',{
    state: () => ({
        loading: false,
        isError: false,
        error: null,
        datos: [],
        modulos:[],
        success: false,
        successMsg: null,
        
    }),
    actions:{


        //Actualizar datos de usuario:
        //Recibe un objeto. ej:
        // {password: 'nuevaContraseña123'}
        async updatePwd(objVal){
            await updatePassword(auth.currentUser,objVal.password).then(
                () => {
                    this.setSuccess("Contraseña actualizada correctamente.");
                }
            ).catch((e) => { this.setError(e.message); })
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
        //Recibe un objeto. ej:
        // {nombre: 'nuevo nombre', cargo: 'Nuevo Cargo'}
        async update(updObj){
            try {
                this.loading = true;

                if(this.datos.length != 0){
                    const getUser = await getDocs( 
                        query( 
                            collection(db, 'usuarios'), 
                            where('uid','==',this.datos.uid) 
                        ) 
                    );
                    if(getUser.docs.length == 1){
                        const docRef = doc(db,'usuarios',getUser.docs[0].id);
                        await setDoc(docRef, updObj, { merge: true })

                        this.setSuccess('Actualizado correctamente.');
                        this.datos = [];
                        this.getData();

                    }else{
                        this.setError("No se puso obtener al usuario. Recargue en intente de nuevo")
                    }

                }else{
                    this.setError("No se puso obtener al usuario. Recargue en intente de nuevo")
                }
                
            } catch (error) {
                this.setError(error.message)
            } finally { this.loading = false; }
        },

        //Traer los datos del usuario:
        async getData(){
            try { this.loading = true;
                
                const usuario = await getDocs( 
                    query( 
                        collection(db, '/usuarios'), 
                        where('uid', '==', auth.currentUser.uid) 
                    ) 
                );
                
                if(usuario.docs.length == 1){
                    
                    this.datos = usuario.docs[0].data();

                }else{
                    this.setError('No se encontró al usuario con el id: '+auth.currentUser.uid);
                }

            } catch (error) { this.setError(error.message); }
            finally { this.loading = false; }
        },

        //Trae todos los modulos del usuario loggeado
        async getModulos(){
            try { this.loading = true;
                
                if(this.modulos.length != 0){ this.modulos = []; }

                if(this.datos.modulos.length > 0){
                    const modulos = await getDocs(
                        query(
                            collection(db, '/modulos'),
                            where('id', 'in', this.datos.modulos)
                        )
                    );
                    modulos.docs.forEach((mod) => {
                        this.modulos.push(mod.data());
                    });
                }
            } catch (error){ this.setError(error.message); } 
            finally { this.loading = false; }
        },

        // Iniciar Sesión
        async login(email, pwd){
            try { this.loading = true;
                const { user } = await signInWithEmailAndPassword( auth, email, pwd ); 
            } catch (error) { this.setError(error.message); } 
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

        setSuccess(msg = "Realizado correctamente."){
            this.success = true; this.successMsg = msg;
            setTimeout(() => { this.success = false; this.successMsg = ""; }, 6000);
        },

        setError(msg = 'Ha ocurrido un error.'){
            this.error = msg; this.isError = true;
            setTimeout(() => { this.isError = false; this.error = ""; }, 6000);
        }
    }
});