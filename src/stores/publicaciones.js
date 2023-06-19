import { defineStore } from "pinia";
import { db } from '../firebase.js';
import router from '../router';
import { query, collection, startAt, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp, Timestamp } from "firebase/firestore/lite";
import { orderByChild } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export const usePublicacionesStore = defineStore('publicacionesStore',{
    state: () => ({
        loading:false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        allPubs:[],
        singlePub:null,
        etiquetas:"",
        autores:[]
    }),

    actions: {

        async crear(datos){
            try {
                this.loading = true;
                let id;
                //getting last id:
                await getDocs(
                    query(
                        collection(db, '/publicaciones')
                    )
                ).then((pubs) => {
    
                    if(pubs.docs.length > 0){
                        id = (eval(pubs.docs[pubs.docs.length-1].id) + 1).toString()
                        if(id.slice(0,4) != new Date().getFullYear()){
                            id = (new Date().getFullYear() + "0001").toString();
                        }
                    }else{
                        id = (new Date().getFullYear() + "0001").toString();
                    }
                })
                let img = 'https://firebasestorage.googleapis.com/v0/b/transparenciaseac.appspot.com/o/publicaciones%2Fstatic%2Fdefault-img.gif?alt=media&token=08f789f9-4bfc-44a9-9533-a2933847ece5&_gl=1*19trn8a*_ga*MTE3MjQ1NzAyOC4xNjg1OTgxNDcw*_ga_CW55HF8NVT*MTY4NjU5MzE2OS4xNi4xLjE2ODY1OTMyOTQuMC4wLjA.'
                
                if(datos.imagen != undefined){
                    let imgName = "imagen_"+id+"."+datos.imagen.type.split("/")[1];
                    let upldRef = ref(getStorage(), '/publicaciones/'+id+'/'+imgName);
                    await uploadBytes(upldRef, datos.imagen );
                    img = await getDownloadURL(upldRef);
                }
                
                let data = {
                    id:id,
                    titulo: datos.titulo,
                    excerpt: datos.excerpt,
                    autor: datos.autor,
                    contenido: "",
                    etiquetas: [],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    publishAt: serverTimestamp(),
                    imagen: img
                }

                console.log(data);

                await setDoc(doc(db, '/publicaciones', id), data).then(() => {
                    location.href = "/publicacion/"+id+"/editar";
                })
                
            } catch (e) {
                console.log(e)
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        async actualizar(id, datos){
            try {
                this.loading = true;
                
                await getDoc(doc(db, '/publicaciones', id)).then(async (pub) => {
                    let etiquetas = datos.etiquetas.split(", ");
                    let imgUrl = pub.data().imagen;
                    let publishAt = new Date(datos.publishAt);
                        

                    if(datos.imagen != undefined){
                        let imgName = "imagen_"+id+"."+datos.imagen.type.split("/")[1];
                        let upldRef = ref(getStorage(), '/publicaciones/'+id+'/'+imgName);
                        await uploadBytes(upldRef, datos.imagen );
                        imgUrl = await getDownloadURL(upldRef);
                    }
                    await setDoc(doc(db, '/publicaciones', id),
                        {
                            titulo: datos.titulo,
                            excerpt: datos.excerpt,
                            etiquetas: etiquetas,
                            imagen:imgUrl,
                            contenido:datos.contenido,
                            updatedAt:serverTimestamp(),
                            autor:datos.autor,
                            publishAt:publishAt
                        }, 
                        { merge:true }
                    ).then(() => { console.log("Ok") })
                    .catch((e) => { console.log(e.message) });
                    
                })


                
            } catch (e) {
                console.log(e.message)
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        async saveTags(tags){

        },

        async delete(id){
            try {
                this.loading = true;
                console.log(id);
                await deleteDoc(doc(db,'/publicaciones', id)).then(() => {
                    location.href = "/publicaciones";
                })
                
            } catch (e) {
                this.setError(e);
            } finally {
                this.loading = false;
            }
        },

        async get(id){
            try {
                this.loading = true;
                this.singlePub = null;
                
                let docSnap = await getDoc(doc(db, 'publicaciones', id))
                
                if (docSnap.exists()) {
                    await getDoc(doc(db,'/autores', docSnap.data().autor)).then((autorData) => {
                        this.etiquetas = "";
                        docSnap.data().etiquetas.forEach((tag) => {
                            if(this.etiquetas == ""){ this.etiquetas = tag; }else{
                                this.etiquetas = this.etiquetas + ", " + tag;
                            }
                        })
                        let publicadoEn = this.formatDateToInput(docSnap.data().publishAt);
                        this.singlePub = { 
                            id:docSnap.id,
                            contenido:docSnap.data().contenido,
                            titulo:docSnap.data().titulo,
                            imagen:docSnap.data().imagen,
                            etiquetas:docSnap.data().etiquetas,
                            autor:{
                                id:docSnap.data().autor,
                                nombre:autorData.data().nombre,
                                imagen:autorData.data().profilepic
                            },
                            excerpt:docSnap.data().excerpt,
                            publishAt:publicadoEn,
                            fecha:this.fechaFormateada(docSnap.data().createdAt),
                            publicada:this.fechaFormateada(docSnap.data().publishAt),
                        };
                    }).catch(() => { this.setError("no se puso encontrar los datos del autor ") });
                } else {
                    this.setError("No se encontró la publicación")
                }

            } catch (e) {
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        formatDateToInput(fbtimestamp){
            let pDate = fbtimestamp.toDate();
            let ano = pDate.getFullYear();
            let mes = pDate.getMonth() + 1;
            let dia = pDate.getDate();
            let hora = pDate.getHours();
            let minutos = pDate.getMinutes();
            if(mes < 10){ mes = "0"+mes }
            if(dia < 10){ dia = "0"+pDate.getDate() }
            if(hora < 10){ hora = "0"+pDate.getHours() }
            if(minutos < 10){ minutos = "0"+pDate.getMinutes() }

            return  ano+"-"+mes+"-"+dia+"T"+hora+":"+minutos;
        },

        async all(){
            try {
                this.loading = true;
                this.allPubs = [];
                 await getDocs(
                    query(collection(db, '/publicaciones'), orderBy('createdAt') ),
                    
                 ).then(async (pubs) => {
                    pubs.docs.forEach(async(pub) => {

                        await getDoc(doc(db,'/autores', pub.data().autor)).then((autorData) => {
                            this.allPubs.push({ 
                                id:pub.id, 
                                titulo:pub.data().titulo,
                                imagen:pub.data().imagen,
                                autor:{
                                    id:pub.data().autor,
                                    nombre:autorData.data().nombre,
                                    imagen:autorData.data().profilepic
                                },
                                fecha:this.fechaFormateada(pub.data().createdAt),
                            });
                        }).catch(()=> { this.setError("El autor relacionado a esta nota no existe."); })

                    })
                 })
                
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

        fechaFormateada(fecha){
            let fechaSplitted = String(fecha.toDate().toDateString()).split(" ");
            let dia = fechaSplitted[0];
            let mes = fechaSplitted[1];
            let diaNum = fechaSplitted[2];
            let anio = fechaSplitted[3];
            
            switch (dia){
                case "Sun": dia = "domingo"; break;
                case "Mon": dia = "lunes"; break;
                case "Tue": dia = "martes"; break;
                case "Wed": dia = "miércoles"; break;
                case "Thu": dia = "jueves"; break;
                case "Fri": dia = "viernes"; break;
                case "Sat": dia = "sábado"; break;
            }

            switch (mes){
                case "Jan": mes = "enero"; break;
                case "Feb": mes = "febrero"; break;
                case "Mar": mes = "marzo"; break;
                case "Apr": mes = "abril"; break;
                case "May": mes = "mayo"; break;
                case "Jun": mes = "junio"; break;
                case "Jul": mes = "julio"; break;
                case "Aug": mes = "agosto"; break;
                case "Sep": mes = "septiembre"; break;
                case "Oct": mes = "octubre"; break;
                case "Nov": mes = "noviembre"; break;
                case "Dec": mes = "diciembre"; break;
            }

            return dia+", "+diaNum+" de "+mes+" de "+anio;

        },
    }
})