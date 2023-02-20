import { defineStore } from "pinia";
import { updateEmail, updatePassword, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, setDoc, doc } from "firebase/firestore/lite";

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
        async get(fbid){
            try {
                this.loading = true;

                const docSnap = await getDoc( 
                    doc(db, '/modulos', fbid) 
                )

                this.fbid = docSnap.id;
                this.id = docSnap.data().id;
                this.titulo = docSnap.data().titulo;
                this.actualizacion = docSnap.data().actualizacion;
                this.encargado.nombre = docSnap.data().encargado.nombre;
                this.encargado.cargo = docSnap.data().encargado.cargo;
                this.nota = docSnap.data().nota;
                this.descripcion = docSnap.data().descripcion;

            } catch (e) {
                console.log(e.message)
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
                querySnapshot.docs.forEach(async(doc) => {
                    const o_documentos = await this.getDocuments(modID, doc.id)
                    let documentos = [];
                    o_documentos.forEach((documento) => {
                        documentos.push({id:documento.id, ...documento.data()})
                    })
                    this.secciones.push({id:doc.id, ...doc.data(), documentos})
                });

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

                const geDocuments = await getDocs(
                    query(
                        collection(db, path)
                    )
                );
                return geDocuments.docs;

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