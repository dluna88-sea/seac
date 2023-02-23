import { defineStore } from "pinia";
import { updateEmail, updatePassword, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore/lite";

export const useCurrentUserStore = defineStore('CurrentUser',{
    state: () => ({
        loading: false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        id:null,
        cargo: null,
        email: null,
        nombre: null,
        rol: null,
        uid: null,
        modIds: [],
        modulos: [],
    }),
    actions:{
        
        async getAll(){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async get(uid){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async update(uid, data){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async delete(uid){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async asignarModulo(uid, modId){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async getModulos(uid){
            try {
                this.loading = true;
            } catch (error) {
                this.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

    }
})