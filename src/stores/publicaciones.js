import { defineStore } from "pinia";
import { db } from '../firebase.js';
import router from '../router';
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
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
    }),

    actions: {

        async crear(datos){
            try {
                this.loading = true;

                
            } catch (e) {
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        async actualizar(id, datos){
            try {
                this.loading = true;

                
            } catch (e) {
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        async saveTags(tags){

        },

        async eliminar(id){
            try {
                this.loading = true;
                
                
            } catch (e) {
                this.setError(e.message);
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
                        this.singlePub = { 
                            id:docSnap.id,
                            contenido:docSnap.data().contenido,
                            titulo:docSnap.data().titulo,
                            imagen:docSnap.data().imagen,
                            autor:{
                                id:docSnap.data().autor,
                                nombre:autorData.data().nombre,
                                imagen:autorData.data().profilepic
                            },
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

        async all(){
            try {
                this.loading = true;
                this.allPubs = [];
                 await getDocs(
                    query(collection(db, '/publicaciones'))
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