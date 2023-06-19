import { defineStore } from "pinia";
import { db } from '../firebase.js';
import router from '../router';
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
import { orderByChild } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export const useAutoresStore = defineStore('autoresStore',{
    state: () => ({
        loading:false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        autor:null,
        all:[],
        notFound:false,
        myPubs:[],
        allBut:[],
    }),

    actions: {

        async getPubsFrom(id){
            try {
                this.loading = true;
                this.myPubs = [];
                await getDocs(query(
                    collection(db, '/publicaciones'),
                    where("autor","==",id),
                    orderBy("createdAt")
                )).then((pubs) => {
                    pubs.forEach((pub) => {
                        this.myPubs.push({ id:pub.id, ...pub.data() })
                    })
                })

            } catch (e) {
                this.setError(e.message);
                console.log(e);
            } finally{
                this.loading = false;
            }
        },

        async get(id){
            try{
                this.loading = true;
                this.autor = null;
                let autor = await getDoc(doc(db, "/autores", id));
                if(autor.exists()){

                    this.autor = {
                        id: autor.id,
                        ... autor.data()
                    }

                }else{
                    this.setError("No se encontró el registro. Intenta de nuevo.");
                }
            }catch(e){
                this.setError("No se pudieron cargar los datos de este autor. Intenta nuevamente.");
            } finally{
                this.loading = false;
            }
        },

        async getAll(){
            try{
                this.loading = true;
                this.all = [];
                await getDocs(query(collection(db,'/autores'))).then((autores) => {
                    autores.forEach((autor) => {
                        this.all.push(
                            { id:autor.id, ...autor.data() }
                        )
                    })
                })
            }catch(e){
                this.setError("No se pudieron cargar los autores. Intenta nuevamente.");
            } finally{
                this.loading = false;
            }
        },

        async getExcept(id){
            try {
                this.loading = true;
                this.allBut = [];
                await getDocs(query(collection(db,'/autores'))).then((autores) => {
                    autores.forEach((aut) => {
                        if(aut.id != id){ this.allBut.push({ id:aut.id, ...aut.data() }); }
                    })
                });

            } catch (e) {
                this.setError("No se pudieron cargar los autores. Intenta nuevamente.");
            }
            finally{
                this.loading = false;
            }
        },

        async update(id, newData){

            try {
                
                this.loading = true;
                
                await setDoc(doc(db,'/autores',id),newData,{ merge:true }).then(() => {
                    this.setSuccess("Datos actualizados correctamente");
                    location.href = "/publicaciones/autor/"+id;
                })

            } catch (e) {
                this.setError(e.message);
                console.log(e);
            } finally {
                this.loading = false;
            }

        },

        async nuevo(datos){
            try{
                this.loading = true;

                let imgURL = "https://firebasestorage.googleapis.com/v0/b/transparenciaseac.appspot.com/o/publicaciones%2Fstatic%2Fdefault_profile.jpg?alt=media&token=86c69bc1-25a3-4486-bc3b-643a62034a38&_gl=1*10j1qoz*_ga*MTE3MjQ1NzAyOC4xNjg1OTgxNDcw*_ga_CW55HF8NVT*MTY4NjY3MTAwNi4yMC4xLjE2ODY2NzIwODQuMC4wLjA.";

                if(datos.imagen != undefined){
                    let imgName = datos.imagen.name;
                    let imgRef = ref(getStorage(), '/publicaciones/autores/'+imgName);
                    await uploadBytes(imgRef, datos.imagen);
                    imgURL = await getDownloadURL(imgRef);
                }

                let data = {
                    nombre: datos.nombre,
                    biografia: datos.biografia,
                    profilepic: imgURL,
                    links: datos.links
                }


                await addDoc(collection(db,'/autores'),data).then((docRef) => {
                    this.setSuccess("Autor registrado correctamente");
                    location.href="/publicaciones/autor/"+docRef.id
                })

            }catch(e){
                console.log(e.message);
                this.setError(e.message);
            }finally{
                this.loading = false;
            }
        },

        async delete(id, accion){
            try {
                this.loading = true;
                let publicacionesAlteradas = 0;
                
                if(accion != ""){
                    if(accion == "eliminar"){
                        
                        await getDocs(
                            query(collection(db,'/publicaciones'),
                            where("autor", "==", id)
                        )).then((pubs) => {
                            pubs.forEach( async(pub) => {
                                await deleteDoc(doc(db,'/publicaciones',pub.id))
                                publicacionesAlteradas++;
                            })
                        });
    
                    }else{
                        //set to action
                        await getDocs(
                            query(collection(db,'/publicaciones'),
                            where("autor", "==", id)
                        )).then((pubs) => {
                            pubs.forEach( async(pub) => {
                                await setDoc(doc(db,'/publicaciones',pub.id),
                                    { autor:accion },
                                    { merge:true }
                                )
                            })
                        })
                    }
                }

                await deleteDoc(doc(db,'/autores',id)).then(() => {
                    location.href='/publicaciones/autores';
                });

            }catch(e){
                this.setError(e.message);
                console.log(e);
            }finally{
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
    }
})