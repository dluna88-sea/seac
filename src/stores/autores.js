import { defineStore } from "pinia";
import { auth, db, firebaseConfig } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, addDoc, doc, getDoc, deleteDoc } from "firebase/firestore/lite";
import { createUserWithEmailAndPassword, initializeAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";


export const useAutoresStore = defineStore('AutoresStore',{
    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        listado:[],
        datos:{},
        publicaciones:[]
    }),
    actions:{
        
        async getAll(){
            try {
                this.loading = true;
                this.listado = [];

                await getDocs(
                    collection(db, 'autores')
                ).then((datos) => {
                    
                    datos.docs.forEach((doc) => {
                        this.listado.push({ id: doc.id, ...doc.data() })
                    });

                }).catch((e) => {
                    console.log(e.message);
                    this.setError(e.message);
                })

            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async get(uid){
            try {
                this.loading = true;

                this.datos = {};
                const autor = await getDoc(
                    doc(db, '/autores', uid)
                )
                if(autor.exists()){
                    
                    await getDocs(
                        query(collection(db,'boletines'), 
                        where('autor','==',autor.id))
                    ).then((result) =>{
                        this.publicaciones = [];
                        result.docs.forEach((publicacion) => {
                            this.publicaciones.push({ id:publicacion.id, ...publicacion.data() })
                        })                    
                    })
                    this.datos = { id:autor.id, ...autor.data() }
                }else{
                    this.setError('El autor no existe')
                }

            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async update(uid, data){
            try {
                this.loading = true;
                await setDoc(
                    doc(db,'autores',uid),
                    data, {merge:true}
                ).then(() => {
                    this.setSuccess('Datos actualizados correctamente');
                })
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async delete(id){
            try {
                this.loading = true;
                await deleteDoc(doc(db,'autores',id)).then(() => {
                    this.setSuccess('Autor eliminado correctamente');
                })
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async nuevo(datos){
            try {
                this.loading = true;
                if(datos.profilepic != '/default-profile.jpg'){
                    const docRef = ref( getStorage(), 'boletines/autores/pics/'+this.julDatePlusSecs() );
                    await uploadBytes(docRef, datos.profilepic);
                    datos.profilepic = await getDownloadURL(docRef)
                }
                await addDoc(collection(db,'autores'), datos).then((autor) => {
                    this.setSuccess("Autor registrado correctamente");
                    console.log(autor.id);
                });
            } catch (error) {
                this.setError(error.message);
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
})