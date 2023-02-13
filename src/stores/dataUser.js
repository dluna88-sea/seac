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

        /**
         * Login
         */
        async login(email, pwd){
            try {
                
                this.loading = true;

                const { user } = await signInWithEmailAndPassword( auth, email, pwd );

            } catch (error) {
                this.isError = true;
                this.error = error.message;
            } finally {
                this.loading = false;
            }
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
    }
});