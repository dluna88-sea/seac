import { defineStore } from "pinia";
import { db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
import { orderByChild } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";


export const useModuloStore = defineStore('SingleModulo',{
    state: () => ({
        loading:false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        data:{}
    }),
    actions:{

        async get(id){
            try{
                this.loading = true;
                await getDoc(doc(db,'modulos',id)).then((doc) => { 
                    this.data = doc.data();
                }).catch((e) => { this.setError(e.message); })
            }catch(e) { this.setError(e.message) }
            finally{ this.loading=false; }
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