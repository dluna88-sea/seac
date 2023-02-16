import { defineStore } from "pinia";
import { updateEmail, updatePassword, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore/lite";

export const useCurrentUser = defineStore('CurrentUser',{
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
        modulos: null,
    }),
    actions:{
        
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

        async getModulos(){
            try {
                this.loading = true;

                //restablecer datos de los modulos:
                this.modulos = [];

                const modulos = await getDocs(
                    query(
                        collection(db, '/modulos'),
                        where('id', 'in', this.modIds)
                    )
                );
                modulos.docs.forEach((mod) => {
                    this.modulos.push([mod.id, ...mod.data()]);
                });

            } catch(e) {
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        async getModulo(id){
            try {
                this.loading = true;

                

            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async getSecciones(modID){
            try {
                
                this.loading = true;

                const path = '/modulos/'+modID+'/secciones';

                const querySnapshot = await getDocs(
                    query(
                        collection(db, path)
                    )
                );
                console.log(querySnapshot.docs)

            } catch (e) {
                console.log(e);
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async getDocuments(modID, secID){
            try {
                
                this.loading = true;

                const path = '/modulos/'+modID+'/secciones/'+secID+'/documentos';

                const querySnapshot = await getDocs(
                    query(
                        collection(db, path)
                    )
                );
                console.log(querySnapshot.docs)

            } catch (e) {
                console.log(e);
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
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
        }
    }
});