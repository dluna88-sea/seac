import { defineStore } from "pinia";
import { auth, db, firebaseConfig } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore/lite";
import { createUserWithEmailAndPassword, initializeAuth } from "firebase/auth";

export const useAutoresStore = defineStore('AutoresStore',{
    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        listado:[],
        datos:{},
        publicaciones:[]
    }),
    actions:{
        
        async getAll(){
            try {
                this.loading = true;
                this.listado = [];

                await getDocs(
                    collection(db, 'autores')
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

                this.datos = {};
                const usuario = await getDoc(
                    doc(db, '/autores', uid)
                )
                if(usuario.exists()){
                    let boletines = await getDocs(
                        query(collection(db,'boletines'), 
                        where('autor','==',usuario.id))
                    );
                    this.datos = { id:usuario.id, ...usuario.data(), boletines:boletines.docs[0].data() }
                }else{
                    this.setError('El autor no existe')
                }

            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async update(uid, data){
            try {
                this.loading = true;
                await setDoc(
                    doc(db,'autores',uid),
                    data, {merge:true}
                ).then(() => {
                    this.setSuccess('Datos actualizados correctamente');
                })
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async delete(id){
            try {
                this.loading = true;
                await deleteDoc(doc(db,'autores',id)).then(() => {
                    this.setSuccess('Autor eliminado correctamente');
                })
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async nuevo(datos){
            try {
                this.loading = true;
                await addDoc(collection(db,'autores'), datos).then((autor) => {
                    this.setSuccess("Autor registrado correctamente");
                    console.log(autor.id);
                });
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