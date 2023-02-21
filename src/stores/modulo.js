import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy } from "firebase/firestore/lite";
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
        todos:[],
    }),
    actions:{

        async nuevoModulo(datos){
            try {
                this.loading = true;

                const objData = {
                    titulo:datos.titulo,
                    actualizacion:this.fecha(),
                    descripcion:datos.descripcion,
                    nota:datos.nota,
                    encargado:{
                        nombre:datos.encargado.nombre,
                        cargo:datos.encargado.cargo,
                    },
                    id: await this.newModId()
                }
                
                const docRef = await addDoc(collection(db, "modulos"), objData);
                
                location.reload();  

            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async newModId(){
            const documents = await getDocs(
                query(
                    collection(db, '/modulos')
                )
            );
            return documents.docs.length;
        },

        async getAll(){
            try {
                this.loading = true;

                const mods = await getDocs(
                    query(
                        collection(db,'modulos'),
                        orderBy("id","asc")
                        ),
                )
                
                mods.docs.forEach((doc) => {
                    this.todos.push({fbid:doc.id, ...doc.data()})
                })
                
            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

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
                        collection(db, path),
                        orderBy("orden", "asc")
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

        async deleteSeccion(id, modID){
            try {
                this.loading = true;
                const path = "/modulos/"+modID+"/secciones";
                await deleteDoc(doc(db, path, id)).then(() =>{
                    location.reload();
                }).catch((e) => { this.setError(e.message) });

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
                const orden = await this.getLastSeccionOrder(datos.modulo)
                
                const dataObj = { 
                    subtitulo:datos.subtitulo, 
                    descripcion:datos.descripcion, 
                    orden:orden
                }

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
        },

        fecha(){
            const d = new Date(Date.now());
            const mes = getMes();
            function getMes(){
                switch(d.getMonth()+1){
                    case 1: return "enero"; break;
                    case 2: return "febrero"; break;
                    case 3: return "marzo"; break;
                    case 4: return "abril"; break;
                    case 5: return "mayo"; break;
                    case 6: return "junio"; break;
                    case 7: return "julio"; break;
                    case 8: return "agosto"; break;
                    case 9: return "septiembre"; break;
                    case 10: return "octubre"; break;
                    case 11: return "noviembre"; break;
                    case 12: return "diciembre"; break;
                }
            }
            return d.getDate()+' de '+mes+' de '+d.getFullYear();
        },

        async getLastSeccionOrder(modID){

            try {
                this.loading = true;
                const documento = await getDocs(query(
                    collection(db, 'modulos/'+modID+'/secciones')
                ))
                if(documento.docs.length == 0){
                    return 1;
                }
                return eval(documento.docs[(documento.docs.length-1)].data().orden)+1

            } catch (e) {
                this.setError(e.message);
            } finally {
                this.loading = false;
            }

        },

    }
});