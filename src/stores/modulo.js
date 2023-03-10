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
        modsOrd:{
            art20:[], 
            art21:[],
            art25:[], 
            art70:[],
            artLGCG:[]
        },
        seccion:{},
        documentos:[],
        userList:[],
        articulos:[]
    }),
    actions:{


        async nuevoModulo(datos){
            try {
                this.loading = true;
                const articulo = datos.articulo+'-'+datos.fraccion;

                if(! await this.modExists(articulo)){

                    const nUID = await this.getLastModID();

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
                        articulo: datos.articulo+"-"+datos.fraccion,
                        uid:nUID
                    }
                    console.log(objData)
                    const docRef = await addDoc(collection(db, "modulos"), objData).catch((e) => { console.log(e) });
                    
                    location.reload();  

                }else{
                    this.setError('El módulo del artículo '+datos.articulo+' fracción '+datos.fraccion+' ya existe');
                }

            } catch (e) {
                this.setError(e.message)
            } finally {
                this.loading = false;
            }
        },

        async deleteModulo(id){
            try {
                this.loading = true;

                await deleteDoc( doc(db,'modulos',id) ).then(async () => {
                    this.setSuccess('Módulo eliminado correctamente');
                    this.resetData();
                    this.getAll()
                }).catch((e) => { this.setError(e.message) })

            } catch (e) {
                this.setError(e.message)
            } finally { this.loading = false; }
        },

        async modExists(articulo){
            try {
                this.loading = true;

                const mod = await getDocs(
                    query(
                        collection(db, 'modulos'),
                        where('articulo','==',articulo.toString())
                    )
                );

                if(mod.docs.length != 0){
                    return true;
                }
                return false;

            } catch (e) {
                this.setError(e.message)
            } finally { this.loading = false; }
        },

        async getArticulos(){
            try {
                this.loading = true;

                await getDocs(query( collection(db, 'articulos') )).then((result) => {

                    result.docs.forEach((art) => {
                        this.articulos.push({ id: art.id, ...art.data() });
                    })

                }).catch((e) => { console.log(e); })

            } catch (e) {
                console.log(e);
            } finally {
                this.loading = false;
            }
        },

        async getAll(){
            try {
                this.loading = true;

                function startsWith(str, word) {
                    return str.lastIndexOf(word, 0) === 0;
                }

                await getDocs(
                    query(
                        collection(db,'modulos'),
                        orderBy("uid","asc")
                    ),
                ).then((result) => {
                    
                    result.docs.forEach((mod) => {
                        
                        let r = { fbid: mod.id, ...mod.data() };

                        this.todos.push(r);

                        if( startsWith( mod.data().articulo, "20-" ) ) this.modsOrd.art20.push(r);
                        else if( startsWith( mod.data().articulo, "21-" ) ) this.modsOrd.art21.push(r);
                        else if( startsWith( mod.data().articulo, "25-" ) ) this.modsOrd.art25.push(r);
                        else if( startsWith( mod.data().articulo, "70-" ) ) this.modsOrd.art70.push(r);
                        else if( startsWith( mod.data().articulo, "LGCG-" ) ) this.modsOrd.artLGCG.push(r);
                        

                    })

                }).catch((e) => { console.log(e) })
                
            

                
            } catch (e) {
                this.setError(e.message)
            } finally {
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
                        location.reload();
                    }).catch((e) => { console.log(e); });
                    
                }).catch((e) => { console.log(e); })

            } catch (e) {
                console.log(e);
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

        async getUserList(){
            try {
                this.loading = true;

                const usuarios = await getDocs( query( collection(db, 'usuarios') ) )

                usuarios.docs.forEach((user) => {
                    if(user.data().rol != "admin"){
                        this.userList.push({ nombre: user.data().nombre, cargo: user.data().cargo });
                    }
                })

            } catch (e) {
                this.setError(e.message);
            } finally { this.loading = false; }
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
            this.fraccion = null;
            this.articulo = null;
            this.fbid = null;
            this.titulo = null;
            this.actualizacion = null;
            this.encargado.nombre = null;
            this.encargado.cargo = null;
            this.nota = null;
            this.secciones = [];
            this.todos = [];
            this.seccion = {};
            this.documentos = [];
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