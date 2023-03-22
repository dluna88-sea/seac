import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc, orderBy, addDoc } from "firebase/firestore/lite";

export const useBoletinesStore = defineStore('BoletinesStore',{

    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        all:[]
    }),
    actions:{

        async guardar(obj){
            try {
                this.loading = true;
                await addDoc(
                    collection(db,'boletines'),
                    {...obj, createdAt:this.fecha() }
                ).catch((e) => { console.log(e.message) })
            } catch (e) { console.log(e.message) }
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
    }

});