import { defineStore } from "pinia";
import { db } from '../firebase.js';
import router from '../router';
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
        data:{},
        encargado:null,
        encargadoID:null,
        cargo:null,
        id:null,
        nota:'',
        descripcion:[],
        secciones:[],
        articulos:[],
        canEdit:[],
    }),
    actions:{

        async get(id){
            try{
                this.loading = true;
                await getDoc(doc(db,'modulos',id)).then( async (mod) => { 
                    this.data = mod.data();
                    if(mod.data().articulo == 'CPC'){
                        this.enlace = 'https://cpccoahuila.org.mx/transparencia/'+mod.data().articulo+'-'+mod.data().fraccion;
                    }else{
                        this.enlace = 'https://seacoahuila.org.mx/transparencia/'+mod.data().articulo+'-'+mod.data().fraccion;
                    }
                    this.id = mod.id;
                    this.descripcion = mod.data().descripcion;
                    this.nota = mod.data().nota;
                    const dptID = mod.data().encargado;
                    
                    this.canEdit = []
                    if(mod.data().canEdit != undefined){ this.canEdit = mod.data().canEdit; }
                    
                    this.secciones = [];
                    await getDocs(
                        query(
                            collection(db, 'modulos/'+id+'/secciones'),
                            orderBy('uid','asc')
                        )
                    ).then((secs) => {
                        secs.docs.forEach((sec) => {
                            this.secciones.push({ id:sec.id, ...sec.data() });
                        })
                    })
                    const dpto = await getDoc(doc(db,'departamentos',dptID));

                    if(dpto.exists){

                        const titular = await getDoc(doc(db,'usuarios',dpto.data().titular));
                        if(titular.exists){
                            this.encargado = titular.data().nombre;
                            this.encargadoID = titular.data().uid;
                            this.cargo = titular.data().cargo + " de " + dpto.data().nombre
                        }else{
                            this.setError('No se encontró al usuario con id: '+dpto.data().titular)
                        }

                    }else{
                        this.setError('No se encontró el departamento con el id: '+dptID);
                    }

                }).catch((e) => { this.setError(e.message); })
            }catch(e) { this.setError(e.message) }
            finally{ this.loading=false; }
        },

        async nuevoModulo(data){
            try {
                this.loading = true;
                const datos = { ...data, actualizacion:this.fecha() }
                
                if(! await this.modExists(data.articulo,data.fraccion)){
                    const nid = await this.getLastModID();
                    await addDoc(collection(db,'modulos'),{ uid: nid, ...datos }).then(
                        this.setSuccess('Creado correctamente')).catch((e) => { this.setError(e.message) })
                        setTimeout(location.reload(),2000);
                }else{
                    this.setError('Ya existe el modulo '+data.fraccion+' del articulo '+data.articulo);
                }

            } catch (e) { this.setError(e.message) }
            finally { this.loading = false; }
        },

        async updateFecha(modID){
            try {
                this.loading = true;

                setDoc(
                    doc(db,'modulos',modID), 
                    { actualizacion:this.fecha() }, 
                    { merge:true }
                ).catch((e) => {
                    this.setError(e.message);
                });

            } catch (e) {
                this.setError(e.message);
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

                await setDoc(doc(db,'/modulos',id), values, {merge: true}).then(async () => {
                    this.setSuccess('¡Actualizado correctamente!')
                    await this.get(id)
                }).catch((e) => { this.setError(e.message) });

            } catch (error) {
                this.setError(error.message);
            } finally{
                this.loading = false;
            }
        },

        async deleteParrafoDescMod(id, modID){
            try {
                this.loading = true;

                
                const path = "/modulos/"+modID;
                await getDoc( doc(db, path) ).then( async(result) => {

                    const descrip = result.data().descripcion;
                    const descNueva = [];
                    descrip.forEach((ob) => {
                        if(ob.orden != id){
                            descNueva.push({ ...ob });
                        }
                    });

                    await setDoc( doc(db, path ), { descripcion: descNueva }, {merge: true}).then(() => {
                        location.reload()
                    }).catch((e) => { console.log(e); });
                    
                }).catch((e) => { console.log(e); })

            } catch (e) {
                console.log(e);
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async deleteSeccion(id, modID){
            try {
                this.loading = true;
                const path = "/modulos/"+modID+"/secciones";
                await deleteDoc(doc(db, path, id)).then(async () =>{
                    await this.update(null, modID);
                }).catch((e) => { this.setError(e.message) });

            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async deleteFile(props){
            try{
                this.loading = true;
                
                const ruta = ref(getStorage(), props.modID+"/"+props.secID+"/"+props.archivo.filename);
                const rutaFB = "modulos/"+props.modID+"/secciones/"+props.secID+"/documentos";
                await deleteObject(ruta).then(async() => { 
                    await deleteDoc(doc(
                        db,
                        "modulos/"+props.modID+"/secciones/"+props.secID+"/documentos/",
                        props.archivo.id)
                    ).then(async () => {
                        location.reload();
                    }).catch((e) => { console.log(e); })
                })
            }catch(e){
                this.setError(e.message);
            }finally{
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
                    this.update(null, datos.modulo);
                    location.reload()
                }).catch((e) => { console.log(e); })

            } catch (e) {
                this.setError(e.message)
                console.log(e)
            } finally {
                this.loading = false;
            }
        },

        async reorderSection(actOrder, newOrder, modID, secID){
            try {
                this.loading = true;

                const modif = await getDocs(
                    query(
                        collection(db,'modulos/'+modID+'/secciones'), 
                        where('uid','==',newOrder.toString())
                    )
                )

                const neSecID = modif.docs[0].id;

                await setDoc(doc(db, 'modulos/'+modID+'/secciones', neSecID), { uid:actOrder.toString() }, { merge:true }).then(async() => {
                    await setDoc(doc(db,'modulos/'+modID+'/secciones', secID), { uid:newOrder.toString() }, { merge:true }).then(() => {
                        
                    }).catch((e) => { console.log('adentro: '+e) })
                }).catch((e) => { console.log('afuera: '+e); })

            } catch (e) {
                this.setError(e.message)
                console.log(e)
            } finally { this.loading = false; }
        },

        async deleteModulo(id){
            try {
                this.loading = true;

                await deleteDoc( doc(db,'modulos',id) ).then(async () => {
                    this.setSuccess('Módulo eliminado correctamente');
                }).catch((e) => { this.setError(e.message) })

            } catch (e) {
                this.setError(e.message)
            } finally { this.loading = false; }
        },

        async getArticulos(){
            try {
                this.loading = true;

                await getDocs(collection(db,'articulos')).then((arts) => {

                    arts.docs.forEach((art) => {

                        this.articulos.push({ id:art.id, ...art.data() });

                    });

                }).catch((e) => { this.setError(e.message); });

            } catch (e) { this.setError(e.message) } 
            finally { this.loading = false; }
        },

        async getLastModID(){
            const defaultFirst = (new Date(Date.now()).getFullYear())+"00001";
            let modulo = await getDocs(
                query(
                    collection(db,'modulos'),
                    orderBy('uid','desc'),
                    limit(1)
                )
            )
            
            if(modulo.docs.length > 0){
                let modID = parseInt(modulo.docs[0].data().uid,10)+1;
                return modID.toString();
            }else return defaultFirst;
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

        async modExists(articulo, fraccion){
            try {
                this.loading = true;

                const mods = await getDocs(query(
                    collection(db,'modulos'),
                    where('articulo', '==', articulo.toString())
                ));

                let coincidencias = false;

                if(mods.docs.length > 0){
                    mods.docs.forEach((mod) => {
                        if(mod.data().fraccion == fraccion){
                            coincidencias = true;
                        }
                    })
                }

                return coincidencias;

            } catch (e) {
                this.setError(e.message)
            } finally { this.loading = false; }
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

    }
});