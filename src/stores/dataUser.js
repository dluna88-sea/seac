import { defineStore } from "pinia";
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
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
                
                console.log(this.datos.modulos)

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