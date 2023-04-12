import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { useRoute } from "vue-router";
import { query, collection, serverTimestamp, where, getDocs, setDoc, getDoc, doc, orderBy, addDoc } from "firebase/firestore/lite";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export const useBoletinesStore = defineStore('BoletinesStore',{

    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        all:[],
        content:[],
        titulo:'',
        autor:null,
        fecha:'',
        status:'',
        lastFileURL:'',
        publishTimestamp:null
    }),
    actions:{

        async guardar(id, obj){
            try {
                this.loading = true;
                await setDoc(doc(db,'boletines',id),{ ...obj, updatedAt:this.getFecha() },{merge:true})
                .then((result) => {
                    location.href='/boletin/'+result.id;
                })
                .catch((e) => { console.log(e.message) });
            } catch (e) { console.log(e.message) }
            finally { this.loading = false; }
        },

        async crear(titulo, autor){
            try {
                this.loading = true;
                await addDoc(
                    collection(db,'boletines'),
                    { 
                        titulo:titulo, 
                        publishTimestamp:serverTimestamp(), 
                        createdAt:this.getFecha(), 
                        autor:autor, 
                        content:[], 
                        status:0
                    }
                )
                .then((result) => {
                    location.href='/boletin/'+result.id;
                })
                .catch((e) => { console.log(e.message) })
            } catch (e) { console.log(e.message) }
            finally { this.loading = false; }
        },

        async get(id){
            try{
                this.loading = true;
                await getDoc(query(
                    doc(db,'boletines',id)
                )).then(async (result) => {
                    this.content = result.data().content;
                    this.fecha = result.data().createdAt;
                    this.titulo = result.data().titulo;
                    this.publishTimestamp = result.data().publishTimestamp;
                    await getDoc(doc(db,'usuarios',result.data().autor)).then((a) => {
                        this.autor = a.data().nombre;
                    }).catch(() => { this.autor = result.data().autor });
                }).catch((e) => { this.setError(e); console.log(e); });
            } catch(e) { this.setError(e); console.log(e); }
            finally { this.loading = false; }
        },

        async getAll(){
            try {
                this.loading = true;
                await getDocs(collection(db,'boletines')).then((boletines) => {
                    this.all = [];
                    boletines.forEach((boletin) => {
                        this.all.push({ id:boletin.id, ...boletin.data() });
                    })
                })
            } catch (e) { console.log(e.message) }
            finally { this.loading = false; }
        },

        async uploadFile(file, btID){
            try{
                // this.loading = true;
                const docRef = ref( getStorage(), '/boletines/'+btID+'/'+file.name );
                await uploadBytes(docRef, file );
                this.lastFileURL = await getDownloadURL(docRef);
            }catch(e) { console.log(e) }
            // finally { this.loading = false; }
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

        getFecha(){
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
    }

});