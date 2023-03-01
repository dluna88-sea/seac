import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
import { orderByChild } from 'firebase/database'
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
        fraccion:null,
        articulo:null,
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
        seccion:{},
        documentos:[],
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
                    fraccion: datos.fraccion,
                    articulo: datos.articulo,
                }
                console.log(objData)
                const docRef = await addDoc(collection(db, "modulos"), objData).catch((e) => { console.log(e) });
                
                location.reload();  

            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async getAll(){
            try {
                this.loading = true;

                const mods = await getDocs(
                    query(
                        collection(db,'modulos'),
                        orderBy("fraccion","asc")
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
                this.fraccion = mods.data().fraccion;
                this.articulo = mods.data().articulo;
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
                    query( collection(db, path), orderBy('uid', 'asc') )
                );
                sec.docs.forEach(async(doc) => {
                    this.secciones.push({id:doc.id, ...doc.data()})
                });

            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async getSeccion(modID, secID){
            try {
                this.loading = true;

                this.seccion = { }
                const sec = await getDoc( doc(db,'modulos/'+modID+'/secciones/', secID) )
                this.seccion = { id: sec.id, ...sec.data() }

            } catch (e) {
                this.setError(e.message);
            } finally{
                this.loading = false;
            }
        },

        async deleteSeccion(id, modID){
            try {
                this.loading = true;
                const path = "/modulos/"+modID+"/secciones";
                await deleteDoc(doc(db, path, id)).then(async () =>{
                    await this.update(null, modID);
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
                this.documentos = [];

                const path = '/modulos/'+modID+'/secciones/'+secID+'/documentos';

                const docmns = await getDocs(
                    query(
                        collection(db, path), orderBy('uid', 'asc')
                    )
                );
                docmns.docs.forEach((doc) => {
                    this.documentos.push({ id: doc.id, ...doc.data() })
                })
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

                if(values == null){ values = {actualizacion:this.fecha()} }
                else{
                    values = {actualizacion:this.fecha(), ...values }
                }

                await setDoc(doc(db,'/modulos',id), values, {merge: true});
                this.setSuccess('Actualizado correctamente. Espere...')
                location.reload()

            } catch (error) {
                this.setError(error.message);
            } finally{
                this.loading = false;
            }
        },

        async crearSeccion(datos){
            try {
                
                this.loading = true;

                const path = '/modulos/'+datos.modulo+'/secciones/';
                
                const id = await this.getLastID(datos.modulo);

                await addDoc(
                    collection(db,path),
                    {
                        subtitulo:datos.subtitulo, 
                        descripcion:datos.descripcion,
                        uid:id,
                        createdAt:serverTimestamp(),
                        updatedAt:serverTimestamp()
                    }
                ).then(async() => {
                    this.update(null, datos.modulo)
                }).catch((e) => { console.log(e); })

            } catch (e) {
                this.setError(e.message)
                console.log(e)
            } finally {
                this.loading = false;
            }
        },

        async updateSeccion(values, idModulo, idSeccion){
            try {
                this.loading = true;

                values = { ...values, updatedAt:serverTimestamp() }

                await setDoc(
                    doc(db,'/modulos/'+idModulo+'/secciones/'+idSeccion+'/'), 
                    values, 
                    {merge: true}
                );
                this.setSuccess('Actualizado correctamente...')
                await this.update(null, idModulo);

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
                        const id = await this.getLastFileID(datos.modID,datos.secID)
                        //console.log('Archivo: '+nombre+' - Enlace: '+url)
                        //const docIDfile = snapshot.metadata.generation;
                        await addDoc(
                            collection(db, '/modulos/'+datos.modID+'/secciones/'+datos.secID+'/documentos/'),
                            { 
                                nombre: datos.nombre, 
                                url: url, 
                                filename: file.name, 
                                descripcion:datos.descripcion,
                                uploadedAt:serverTimestamp(),
                                uid:id
                            },
                            { merge:true }
                        ).then(async () => {
                            await this.update(null, datos.modID);
                            //location.reload()
                        }).catch((e) => { this.setError(e.message); })
                        
                    }
                ).catch((e) => {  console.log(e); this.setError(e.message) })


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
                console.log(datos.modulo+'/'+datos.seccion+'/'+datos.filename)
                const docRef = ref(getStorage(), datos.modulo+'/'+datos.seccion+'/'+datos.filename);

                await deleteObject(docRef).then(async () => {

                    const ubi = 'modulos/'+datos.modulo+'/secciones/'+datos.seccion+'/documentos/'+datos.docID;

                    await deleteDoc(
                        doc(db, ubi)
                    ).then(async() => {
                        await this.update(null, datos.modulo);
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

        async getLastID(modID){
            const defaultFirst = (new Date(Date.now()).getFullYear())+"00001";
            
            let seccion = await getDocs(
                query(
                    collection(db,'modulos/'+modID+'/secciones'),
                    orderBy('uid','desc'),
                    limit(1)
                )
            )
            
            if(seccion.docs.length > 0){
                let seccionID = parseInt(seccion.docs[0].data().uid,10)+1;
                return seccionID.toString();
            }else return defaultFirst;
        },       

        async getLastFileID(modID, secID){
            const defaultFirst = (new Date(Date.now()).getFullYear())+"00001";
            
            let documento = await getDocs(
                query(
                    collection(db,'modulos/'+modID+'/secciones/'+secID+'/documentos'),
                    orderBy('uid','desc'),
                    limit(1)
                )
            )
            if(documento.docs.length > 0){
                let documentID = parseInt(documento.docs[0].data().uid,10)+1;
                return documentID.toString();
            }else return defaultFirst;
        },

        julDatePlusSecs(){
            var d = new Date();
            var j=parseInt((d.getTime()-new Date('Dec 30,'+(d.getFullYear()-1)+' 23:00:00').getTime())/86400000).toString(),
            i=3-j.length;
            while(i-->0)j=0+j;
            var secs = d.getSeconds() + (60 * (d.getMinutes() + (60 * d.getHours())));
            j = j+secs;
            return j
        },


    }
});