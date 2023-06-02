import { defineStore } from "pinia";
import { db } from '../firebase.js';
import router from '../router';
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
import { orderByChild } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export const useAutoresStore = defineStore('autoresStore',{
    state: () => ({
        loading:false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        autor:null,
        all:[],
    }),

    actions: {

        async get(id){
            try{
                this.loading = true;
                this.autor = null;
                let autor = await getDoc(doc(db, "/autores", id));
                if(autor.exists()){

                    this.autor = {
                        id: autor.id,
                        ... autor.data()
                    }

                }else{
                    this.setError("No se encontró el registro. Intenta de nuevo.");
                }
            }catch(e){
                this.setError("No se pudieron cargar los datos de este autor. Intenta nuevamente.");
            } finally{
                this.loading = false;
            }
        },

        async getAll(){
            try{
                this.loading = true;
                this.all = [];
                await getDocs(query(collection(db,'/autores'))).then((autores) => {
                    autores.forEach((autor) => {
                        this.all.push(
                            { id:autor.id, ...autor.data() }
                        )
                    })
                })
            }catch(e){
                this.setError("No se pudieron cargar los autores. Intenta nuevamente.");
            } finally{
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