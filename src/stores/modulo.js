import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore/lite";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

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

                this.resetData();

                const mods = await getDoc( 
                    doc(db, '/modulos', fbid) 
                )

                this.fbid = mods.id;
                this.id = mods.data().id;
                this.titulo = mods.data().titulo;
                this.actualizacion = mods.data().actualizacion;
                this.encargado.nombre = mods.data().encargado.nombre;
                this.encargado.cargo = mods.data().encargado.cargo;
                this.nota = mods.data().nota;
                this.descripcion = mods.data().descripcion;

                await this.getSecciones(mods.id);
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
                this.secciones = [];

                const path = '/modulos/'+modID+'/secciones';

                const sec = await getDocs(
                    query(
                        collection(db, path)
                    )
                );
                sec.docs.forEach(async(doc) => {
                    const o_documentos = await this.getDocuments(modID, doc.id)
                    let documentos = [];
                    o_documentos.forEach((documento) => {
                        documentos.push({id:documento.id, ...documento.data()})
                    })
                    this.secciones.push({id:doc.id, ...doc.data(), documentos})
                });

            } catch (e) {
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

                const docmns = await getDocs(
                    query(
                        collection(db, path)
                    )
                );
                return docmns.docs;

            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async update(values, id){
            try {
                
                this.loading = true;
                await setDoc(doc(db,'/modulos',id), values, {merge: true});
                this.setSuccess('Actualizado correctamente')

            } catch (error) {
                this.setError(error.message);
            } finally{
                this.loading = false;
            }
        },

        async crearSeccion(datos){
            try {
                this.loading = true;
                const dataObj = { subtitulo:datos.subtitulo, descripcion:datos.descripcion }
                const path = '/modulos/'+datos.modulo+'/secciones/';

                await addDoc( collection(db,path), dataObj ).then((data) => {
                    location.reload()
                }).catch((e) => { console.log(e.message) })


            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async updateSeccion(values, idModulo, idSeccion){
            try {
                this.loading = true;

                await setDoc(
                    doc(db,'/modulos/'+idModulo+'/secciones/'+idSeccion+'/'), 
                    values, 
                    {merge: true}
                );
                this.setSuccess('Actualizado correctamente')

            } catch (error) {
                this.setError(error.message);
            } finally{
                this.loading = false;
            }
        },

        async uploadFile(file, datos){
            try {
                this.loading = true;
                
                const docRef = ref( getStorage(), '/'+datos.modID+'/'+datos.secID+'/'+file.name );

                await uploadBytes( docRef, file ).then( 
                    async (snapshot) => {
                        const url = await getDownloadURL(docRef)
                        //console.log('Archivo: '+file.name+' - Enlace: '+url)
                        //const docIDfile = snapshot.metadata.generation;
                        await addDoc(
                            collection(db, '/modulos/'+datos.modID+'/secciones/'+datos.secID+'/documentos/'),
                            { nombre: file.name, url: url },
                            { merge:true }
                        ).then(() => {
                            location.reload()
                        }).catch((e) => { this.setError(e.message); })
                        
                    }
                ).catch((e) => { this.setError(e.message) })


            } catch (error) {
                console.log(error);
                this.setError(error.message)
            } finally {
                this.loading = false;
            }
        },

        async deleteFile(datos){
            try {
                this.loading = true;
                
                const docRef = ref(getStorage(), datos.modulo+'/'+datos.seccion+'/'+datos.nombre);

                await deleteObject(docRef).then(async () => {

                    const ubi = 'modulos/'+datos.modulo+'/secciones/'+datos.seccion+'/documentos/'+datos.docID;

                    await deleteDoc(
                        doc(db, ubi)
                    ).then(() => {
                        location.reload();
                    }).catch((e) => { this.setError(e.message) })

                }).catch((e) => { console.log(e.message) })

            } catch (e) {
                this.setError(e.message);
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

        resetData(){
            this.id = null
            this.fbid = null
            this.titulo = null
            this.actualizacion = null
            this.encargado.nombre = null
            this.encargado.cargo = null
            this.nota = null
            this.secciones = []
        }

    }
});