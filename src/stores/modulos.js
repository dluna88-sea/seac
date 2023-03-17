import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
import { orderByChild } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";


export const useModulosStore = defineStore('pluralModulos',{
    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        listado:[],
        art20:[],
        art21:[],
        art25:[],
        art70:[],
        artLGCG:[],
        artCPC:[],
        articulos:[]

    }),
    actions:{

        async get(){
            try{
                this.loading = true;

                this.listado = [];
                this.art20 = [];
                this.art21 = [];
                this.art25 = [];
                this.art70 = [];
                this.artLGCG = [];
                this.artCPC = [];

                const user = await getDocs(query(collection(db,'usuarios'), where( 'uid', "==", auth.currentUser.uid ))).catch((e) => {
                    console.log(e.message);
                })
                if(user.docs[0].data().rol == "admin"){

                    await getDocs(
                        query( collection(db,'modulos'), orderBy('uid', 'asc') ) 
                    ).then((r) => {

                        r.docs.forEach((m) => {
                            this.listado.push({ id:m.id, ...m.data() });
                            switch(m.data().articulo){
                                case "20": this.art20.push({ id:m.id, ...m.data() }); break;
                                case "21": this.art21.push({ id:m.id, ...m.data() }); break;
                                case "25": this.art25.push({ id:m.id, ...m.data() }); break;
                                case "70": this.art70.push({ id:m.id, ...m.data() }); break;
                                case "LGCG": this.artLGCG.push({ id:m.id, ...m.data() }); break;
                                case "CPC": this.artCPC.push({ id:m.id, ...m.data() }); break;
                            }
                        })

                    }).catch((e) => { this.setError(e.message); })

                }else if(user.docs.length == 1){
                    const rol = user.docs[0].data().rol;
                    const dpts = [];
                    await getDocs(query(
                        collection(db, 'departamentos'), 
                        where('titular', "==", user.docs[0].id)
                    )).then((r) => {

                        if(r.docs.length == 0){
                            this.setError('NO TIENES MODULOS ASIGNADOS')
                        }else{
                            r.docs.forEach((d) => {
                                dpts.push(d.id)
                            });
                        }

                    }).catch((e) => {
                        console.log(e.message);
                    })
                    

                    await getDocs(
                        query( collection(db,'modulos'), orderBy('uid', 'asc') ) 
                    ).then((r) => {

                        r.docs.forEach((m) => {
                            if(dpts.includes(m.data().encargado)){
                                this.listado.push({ id:m.id, ...m.data() });
                                switch(m.data().articulo){
                                    case "20": this.art20.push({ id:m.id, ...m.data() }); break;
                                    case "21": this.art21.push({ id:m.id, ...m.data() }); break;
                                    case "25": this.art25.push({ id:m.id, ...m.data() }); break;
                                    case "70": this.art70.push({ id:m.id, ...m.data() }); break;
                                    case "LGCG": this.artLGCG.push({ id:m.id, ...m.data() }); break;
                                    case "CPC": this.artCPC.push({ id:m.id, ...m.data() }); break;
                                }
                            }

                        })

                    }).catch((e) => { this.setError(e.message); })
                }else{
                    this.setError('No se pudo obtener el rol de usuario. Inicia Sesión nuevamente');
                }

            }catch(e) { this.setError(e.message) }
            finally{ this.loading=false; }
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

        async getArticulos(){
            try {
                this.loading = true;
                this.articulos = [];
                await getDocs(query(collection(db,'articulos'))).then((arts) => {

                    arts.docs.forEach((art) => {
                        this.articulos.push({ id:art.id, ...art.data() });
                    });

                }).catch((e) => { this.setError(e.message); });

            } catch (e) { this.setError(e.message) } 
            finally { this.loading = false; }
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