import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
import { orderByChild } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export const useDepartamentosStore = defineStore('DepartamentosStore',{
    state: () => ({
        loading:false,
        all:[],
        datos:[]
    }),
    actions:{

        async getAll(){
            try {
                this.loading = true;

                await getDocs(query(collection(db, 'departamentos'))).then((result) => {
                    result.docs.forEach((dpt) => {
                        this.all.push({ id: dpt.id, ...dpt.data() });
                    })
                }).catch((e) => {
                    console.log(e);
                });

            } catch (e) {
                console.log(e);
                
            } finally {
                this.loading = false;
            }
        },

        async get(id){
            try {
                this.loading = true;
                this.datos = [];
                await getDoc(doc(db,'departamentos',id)).then((result) => {
                    if(result.exists){
                        this.datos = result.data();
                    }
                }).catch((e) => { 
                    console.log(e);
                })

            } catch (e) {
                console.log(e);
                
            } finally {
                this.loading = false;
            }
        },

        async nuevo(datos){
            try {
                this.loading = true;

            } catch (e) {
                console.log(e);
                
            } finally {
                this.loading = false;
            }
        },

        async editar(datos){
            try {
                this.loading = true;
                
            } catch (e) {
                console.log(e);
                
            } finally {
                this.loading = false;
            }
        },

        async eliminar(id){
            try {
                this.loading = true;

            } catch (e) {
                console.log(e);
                
            } finally {
                this.loading = false;
            }
        },

    }
});