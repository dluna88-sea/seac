import { defineStore } from "pinia";
import { getAuth } from "firebase/auth";
import { auth, db } from '../firebase.js'
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import router from '../router';
import { query, collection, where, getDocs, getDoc, setDoc, doc, orderBy } from "firebase/firestore/lite";


export const useAuthUserStore = defineStore('AuthUser', {
    state:() => ({
        loading: false,
        message:{
            error:true,
            success:false,
            text:'',
            place:null
        },
        uid:null,
        nombre:null,
        email:null,
        photoURL:"https://firebasestorage.googleapis.com/v0/b/seseac-107b3.appspot.com/o/static%2Fdefault_profile_pic.jpg?alt=media&token=f2835c42-a14e-4809-9c35-9fe9aadc4e20",
        rol:null,
        departamento:null
    }),

    actions:{

        async datos(){
            try {
                this.loading = true;

                let datos = getAuth().currentUser;
                this.nombre = datos.displayName;
                this.email = datos.email;
                this.photoURL = datos.photoURL;
                
                //Consultar el Rol del usuario
                if(this.rol == null){
                    await getDoc(
                        doc(db, "roles/", this.uid)
                    ).then((data) => { 
                        this.rol = data.data().rol 
                    });
                }
                
                //Consultar el departamento del empleado
                if(this.departamento == null){
                    await getDocs(
                        query(
                            collection(db, "/departamentos"),
                            where("empleados","array-contains",this.uid)
                        )
                    ).then((dptos) => {
                        if(!dptos.empty){
                            this.departamento = {
                                nombre: dptos.docs[0].data().nombre,
                                nombre_corto: dptos.docs[0].data().nombre_corto
                            }
                        }
                    });
                }


            } catch (e) {
                console.log(e);
                this.setError("Hubo un error al intentar cargar los datos");
            } finally {
                this.loading = false;
            }
        },

        //Actualizar Display Name:
        async updateName(value){
            try { this.loading = true;
                
                await updateProfile(auth.currentUser, {
                    displayName:value
                }).then(() => { 
                    this.setSuccess("Datos actualizados correctamente");
                 })

            } catch (e) { this.setError('Error al intentar actualizar los datos. Intenta de nuevo'); } 
            finally { this.loading = false; }
        },


        async login(email, pwd){
            try { this.loading = true;
                await signInWithEmailAndPassword( auth, email, pwd ).then((e) => {
                    router.push("/");
                });
            } catch (e) { console.log(e.message); this.setError('Datos incorrectos'); } 
            finally { this.loading = false; }
        },
        
        async isAuth(){
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(auth, user => {
                    if(user){
                        this.uid = user.uid;
                    }
                    resolve(user)
                },(e) => reject(e))
                unsuscribe();
            })
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