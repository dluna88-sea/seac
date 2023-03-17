import { defineStore } from "pinia";
import { db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
import { orderByChild } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";


export const useSeccionStore = defineStore('SingleSection',{

    state: () => ({
        loading:false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        id:null,
        subtitulo:'',
        descripcion:'',
        documentos:[]
    }),

    actions:{
        
        async get(modID,secID){
            try{
                this.loading = true;
                
                await getDoc(doc(db,'modulos/'+modID+'/secciones/',secID)).then(async (result) => {
                    this.id = result.id;
                    this.subtitulo = result.data().subtitulo;
                    this.descripcion = result.data().descripcion;
                    this.getDocuments(modID,secID);
                }).catch((e) => { this.setError(e.message) })

            }catch(e) { this.setError(e.message) }
            finally{ this.loading=false; }
        },

        async update(values, modID, secID){
            try{
                this.loading = true;
                
                await setDoc(
                    doc(db,'modulos/'+modID+'/secciones', secID), 
                    { ...values, updatedAt:serverTimestamp() }, 
                    {merge:true}
                ).catch((e) => { this.setError(e.message); });

            }catch(e) { this.setError(e.message) }
            finally{ this.loading=false; }
        },

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

        async uploadFile(file, datos){
            try {
                this.loading = true;
                
                const docRef = ref( getStorage(), '/'+datos.modID+'/'+datos.secID+'/'+file.name );

                await uploadBytes( docRef, file ).then( 
                    async (snapshot) => {
                        const url = await getDownloadURL(docRef)
                        const id = await this.getLastFileID(datos.modID,datos.secID)
                        
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

        async updateDatosFile(datos){
            try{
                this.loading = true;
            
                let data = {}

                if("documento" in datos){
                    //Borrar el doc anterior:
                    const fireStorePath = datos.modID+'/'+datos.secID+'/'+datos.documentoViejo;
                    const docRef = ref(getStorage(), fireStorePath);
                    await deleteObject(docRef).then(async () => {

                        console.log(datos.documento.name)
                        //subir el nuevo archivo
                        const refFile = ref( getStorage(), '/'+datos.modID+'/'+datos.secID+'/'+datos.documento.name );
                        await uploadBytes( refFile, datos.documento ).then( async () => {

                            const newFileurl = await getDownloadURL(refFile);
                            data = {
                                ...data,
                                filename:datos.documento.name,
                                url:newFileurl,
                                uploadedAt:serverTimestamp(),
                            }
                            

                        }).catch((e) => { console.log(e.message) })

                    }).catch((e) => { console.log(e.message) })
                }

                if("descripcion" in datos){
                    data = { ...data, descripcion:datos.descripcion }
                }

                if("nombre" in datos){
                    data = { ...data, nombre:datos.nombre }
                }

                //actualizar la info:
                const path = '/modulos/'+datos.modID+'/secciones/'+datos.secID+'/documentos/'+datos.docID
                await setDoc(
                    doc(db, path),
                    data,
                    {merge:true}
                ).then(() => {
                    this.update(null, datos.modID)

                }).catch((e) => { this.setError(e.message) })

            } catch(e) {
                this.setError(e.message)                
            } finally { this.loading = false; }
        },

        async reorderFile(actOrder, newOrder, modID, secID, fileID){
            try {
                this.loading = true;

                const modif = await getDocs(
                    query(
                        collection(db,'modulos/'+modID+'/secciones/'+secID+'/documentos/'), 
                        where('uid','==',newOrder.toString())
                    )
                );
                const neDocID = modif.docs[0].id;
                await setDoc(
                    doc(db, 'modulos/'+modID+'/secciones/'+secID+'/documentos', neDocID), 
                    { uid:actOrder.toString() }, 
                    { merge:true }
                    ).then(async() => {
                        await setDoc(
                            doc(db,'modulos/'+modID+'/secciones/'+secID+'/documentos', fileID), 
                            { uid:newOrder.toString() }, 
                            { merge:true }
                        ).catch((e) => { console.log('adentro: '+e) })
                }).catch((e) => { console.log('afuera: '+e); })

            } catch (e) {
                this.setError(e.message)
                console.log(e)
            } finally { this.loading = false; }
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
    },


});