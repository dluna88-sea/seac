import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { useRoute } from "vue-router";
import { query, collection, serverTimestamp, startAfter, where, limit, getDocs, setDoc, getDoc, doc, orderBy, addDoc, Timestamp } from "firebase/firestore/lite";
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
        autorID:null,
        fecha:'',
        imagen:'/default-img.gif',
        status:'',
        lastFileURL:'',
        publishTimestamp:null,
        publicarEl: '',
        fechaFormateada: '',
        pageList:[],
        primero:null,
        ultimo:null,
        pageLimit:5,
    }),
    actions:{

        async guardar(id, obj){
            try {
                this.loading = true;
                
                if( typeof obj != "string"){
                    
                    const docRef = ref( getStorage(), '/boletines/notas/' + id + '/' + obj.imagen.name );
                    await uploadBytes(docRef, obj.imagen);
                    obj.imagen = await getDownloadURL(docRef)

                }
                let fechia = new Date(obj.publishTimestamp+"T00:00:00")
                obj.publishTimestamp = Timestamp.fromDate(fechia)
                
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
                        createdTimestamp:serverTimestamp(), 
                        createdAt:this.getFecha(), 
                        autor:autor, 
                        content:[],
                        imagen:'/default-img.gif', 
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
                    this.imagen = result.data().imagen;
                    this.publishTimestamp = result.data().publishTimestamp;
                    this.publicarEl = this.getFechaFromTimeStamp(result.data().publishTimestamp);
                    this.fechaFormateada = this.formatearFecha(result.data().publishTimestamp);
                    this.autorID = result.data().autor;
                    await getDoc( query(
                        doc(db, 'autores', result.data().autor)
                    )).then((d) => {
                        this.autor = d.data().nombre;
                        console.log()
                    }).catch((e) => { console.log(e); })
                    
                }).catch((e) => { this.setError(e); console.log(e); });
            } catch(e) { this.setError(e); console.log(e); }
            finally { this.loading = false; }
        },

        formatearFecha(timestampDate){
            let fecha = new Date(timestampDate.toDate()).toLocaleDateString().split("/",3);
            let anio = fecha[2];
            let dia = fecha[0];
            let mes = "01";
            if(fecha[1].length == 1){
                mes = "0"+fecha[1];
            }else{
                mes = fecha[1];
            }
            return anio+"-"+mes+"-"+dia;
        },

        getFechaFromTimeStamp(timestampDate){
            let fecha = new Date(timestampDate.toDate()).toLocaleDateString().split("/",3);
            let dia = fecha[0];
            let mes = "enero";
            switch(fecha[1]){
                case "1": mes = "enero"; break;
                case "2": mes = "febrero"; break;
                case "3": mes = "marzo"; break;
                case "4": mes = "abril"; break;
                case "5": mes = "mayo"; break;
                case "6": mes = "junio"; break;
                case "7": mes = "julio"; break;
                case "8": mes = "agosto"; break;
                case "9": mes = "septiembre"; break;
                case "10": mes = "octubre"; break;
                case "11": mes = "noviembre"; break;
                case "12": mes = "diciembre"; break;
            }
            let anio = fecha[2];
            return dia + " de " + mes + " de " + anio;
        },

        async getAll(){
            try {
                this.loading = true;
                await getDocs(collection(db,'boletines')).then((boletines) => {
                    this.all = [];
                    boletines.forEach(async (boletin) => {
                        let autorNombre = '';
                        await getDoc(query(doc(db,'autores',boletin.data().autor))).then((autor) => {
                            autorNombre = autor.data().nombre;
                        }).catch((e) => { console.log(e); })
                        this.all.push({ id:boletin.id, autorNombre:autorNombre, ...boletin.data() });
                    })
                })
            } catch (e) { console.log(e.message) }
            finally { this.loading = false; }
        },

        async getList(order = "desc"){
            try{   
                this.loading = true;
                this.pageList = [];
                
                await getDocs(query(
                    collection(db, "boletines"),
                    orderBy("createdTimestamp", order),
                    limit(this.pageLimit),
                    startAfter(ultimo)
                )).then((documentos) => {

                })


            }catch(e){ console.log(e); }
            finally{ this.loading = false; }
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