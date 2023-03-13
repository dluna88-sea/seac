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
    }),
    actions:{

        async get(){
            try{
                this.loading = true;
                await getDocs(
                    query(
                        collection(db, 'modulos')
                    )
                ).then((result) => {

                    result.docs.forEach((d) => {
                        this.listado.push({ id:d.id, ...d.data() });
                    });
                    
                }).catch((e) => { this.setError(e.message); })
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