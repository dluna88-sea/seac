import { defineStore } from "pinia";
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore/lite";

export const useModulosStore = defineStore('ModulosStore',{

    state: () => ({
        loading: false,
        isError: false,
        error: null,
        datos: [],
        listado:[],
        success: false,
        successMsg: null,
        passwordError: false,
        passwordErrMsg: null
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


        setError(msg = "Algo salió mal. Intentalo de nuevo"){
            this.isError = true;
            this.error = msg;
            setTimeout(() => { this.isError = false; this.error = ""; }, 6000)
        },

        setSuccess(msg = "Realizado correctamente."){
            this.success = true;
            this.successMsg = msg;
            setTimeout(() => { this.success = false; this.successMsg = ""; }, 6000)
        }

    }

});
