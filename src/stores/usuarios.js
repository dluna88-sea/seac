import { defineStore } from "pinia";
import { auth, db, firebaseConfig } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc, getDoc } from "firebase/firestore/lite";
import { createUserWithEmailAndPassword, initializeAuth } from "firebase/auth";

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
        datos:{},
        modulos:[]
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

                this.datos = {};

                const usuario = await getDoc(
                    doc(db, '/usuarios', uid)
                )

                if(usuario.exists()){
                    this.datos = { id:usuario.id, ...usuario.data() }
                }else{
                    this.setError('El usuario no existe')
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

        async getModulos(mods){
            try {
                this.loading = true;

                const userMods = [];

                mods.forEach(async(m) => {
                    await getDocs(
                        query(
                            collection(db, "modulos"),
                            where("articulo","==",m)
                        )
                    ).then((result) => {
                        userMods.push({...result.docs[0].data()});
                    }).catch((e) => {
                        console.log(e);
                    })
                })

            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async registrar(datos, pwd){
            try{
                
                this.loading = true;
                const appFb2 = initializeAuth()
                console.log(appFb2);
                await appFb2.createUserWithEmailAndPassword( datos.email, pwd ).then((res) => {
                    console.log(res.user.uid);
                }).catch((e) => { this.setError(e.message) })

            } catch(e) { this.setError(e.message) }
            finally { this.loading = false; }
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