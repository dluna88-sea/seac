import { defineStore } from "pinia";
import { updateEmail, updatePassword, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore/lite";

export const useModuloStore = defineStore('SingleModulo',{
    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        id:null,
        fbid:null,
        titulo:null,
        actualizacion:null,
        encargado:{
            nombre:null,
            cargo:null,
        },
        nota:null,
        secciones:[],

    }),
    actions:{


        //Consultar detalles de un módulo especifico
        async get(id){
            try {
                this.loading = true;

            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        //Consultar las secciones de un módulo especifico
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

        //Consultar los documentos de una sección de un módulo
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

    }
});