import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc, orderBy, limit, FieldPath, serverTimestamp } from "firebase/firestore/lite";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export const useDepartamentosStore = defineStore('DepartamentosStore',{
    state: () => ({
        loading:false,
        message:{
            success:false,
            error:false,
            text:"",
            place:null
        },
        all:[],
        datos:[]
    }),
    actions:{

        async getAll(){
            try {
                this.loading = true;
                this.all = [];
                await getDocs(query(collection(db, 'departamentos'))).then((result) => {
                    result.docs.forEach(async(dpt) => {
                        
                        if(dpt.data().titular != ""){

                            await getDoc(doc(db,'usuarios',dpt.data().titular)).then((titular) => {
    
                                this.all.push({ 
                                    id: dpt.id, nombre:dpt.data().nombre, 
                                    titular:{ 
                                        id:titular.id,
                                        nombre:titular.data().nombre, 
                                        cargo:titular.data().cargo 
                                    } 
                                }); 
                            })
                        }else{
                            this.all.push({ 
                                id: dpt.id, nombre:dpt.data().nombre, 
                                titular:{ nombre:'SIN ASIGNAR', cargo:'' } 
                            });
                        }
                    });
                }).catch((e) => {
                    console.log(e);
                    this.setError(e.message)
                });
            } catch (e) {
                console.log(e);
                this.setError(e.message);
            } finally { this.loading = false; }
        },

        async get(id){
            try {
                this.loading = true;
                this.datos = [];
                await getDoc(doc(db,'departamentos',id)).then((result) => {
                    if(result.exists) this.datos = result.data();
                }).catch((e) => { 
                    console.log(e);
                    this.setError(e.message)
                });
            } catch (e) {
                console.log(e);
                this.setError(e.message);
            } finally { this.loading = false; }
        },

        async nuevo(datos){
            try {
                this.loading = true;
                await addDoc(collection(db,'departamentos'),datos).then((e) => {
                    this.setSuccess('Departamento registrado correctamente');
                }).catch((e) => { console.log(e); this.setError(e.message); });
            } catch (e) {
                console.log(e);
                this.setError(e.message);
            } finally { this.loading = false; }
        },

        async editar(id, datos){
            try {
                this.loading = true;
                await setDoc(doc(db,'departamentos/'+id), datos, { merge:true }).then((e) => {
                    this.setSuccess('Actualizado correctamente. Espere...');
                    setTimeout(() => { location.reload(); }, 2500);
                }).catch((e) => { console.log(e.message); this.setError(e.message); })
            } catch (e) {
                console.log(e);
                this.setError(e.message);
            } finally { this.loading = false; }
        },

        async eliminar(id){
            try {
                this.loading = true;
                await deleteDoc(doc(db, 'departamentos',id)).then(() => {
                    this.setSuccess('Departamento eliminado correctamente');
                }).catch((e) => { console.log(e); this.setError(e.message); });
            } catch (e) {
                console.log(e);
                this.setError(e.message);
            } finally { this.loading = false; }
        },

        async asignarModulo(depID, modID){
            await setDoc(doc(db, 'modulos', modID), { encargado:depID }, { merge:true }).then(() => {
                this.setSuccess('Encargado asignado correctamente');
            }).catch((e) => { e.setError(e.message) })
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
});