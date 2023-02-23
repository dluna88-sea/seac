import { defineStore } from "pinia";
import { updateEmail, updatePassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore/lite";

export const useUsuariosStore = defineStore('UsuariosStore',{
    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        listado:[],
        
    }),
    actions:{
        
        async getAll(){
            try {
                this.loading = true;
                this.listado = [];

                await getDocs(
                    query(
                        collection(db, 'usuarios'),
                    )
                ).then((datos) => {
                    
                    datos.docs.forEach((doc) => {
                        this.listado.push({ id: doc.id, ...doc.data() })
                    });

                }).catch((e) => {
                    console.log(e.message);
                    this.setError(e.message);
                })

            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async get(uid){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async update(uid, data){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async delete(uid){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async asignarModulo(uid, modId){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async getModulos(uid){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
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
})