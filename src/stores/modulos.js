import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore/lite";

export const useModulosStore = defineStore('ModulosStore',{

    state: () => ({
        loading: false,
        isError: false,
        error: '',
        datos: [],
        listado:[],
        success: false,
        successMsg: '',

        message: {
            error: false,
            success: false,
            text:'',
            place: null
        }

    }),
    actions:{

        async getData(modId){
            try {
                this.loading = true;

                

            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async getAll(){

            try{
                this.loading = true;


            } catch (e) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }

        },

        async update(values, modId = null){
            try {
                this.loading = true;

                const modulo = await getDocs(
                    query(
                        collection(db, '/modulos'),
                        where('id', '==', modId)
                    )
                );

                if(modulo.docs.length == 1){

                    const docRef = doc(db,'/modulos',modulo.docs[0].id);
                    await setDoc(docRef, values, {merge: true});
                    this.setSuccess('Actualizado correctamente')

                }else{
                    this.setError("No se encontró el módulo con el id: "+modId);
                }

            } catch (e) {
                this.setError(e.message);
            } finally {
                this.loading = false;
            }
        },

        async updateSeccion(modId, secIndex, values){
            try{
                this.loading = true;
                

            }catch(e){ this.setError(e.message) }
            finally { this.loading = false; }
        },

        setError(msg = "Algo salió mal. Intentalo de nuevo"){
            this.message.text = msg;
            this.success = false;
            this.message.error = true;
        },

        setSuccess(msg = "Realizado correctamente."){
            this.message.text = msg;
            this.message.error = false;
            this.message.success = true;
        }

    }

});
