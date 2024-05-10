import { defineStore } from "pinia";
import { db } from '../firebase.js';
import { getDownloadURL, getMetadata, getStorage, ref, uploadBytes, deleteObject, listAll } from "firebase/storage";

export const useGaleriaStore = defineStore('galeriaStore', {
    state: () => ({
        loading:false,
        message:{
            error:false,
            success:false,
            text:'',
            place:null
        },
        allPics:[],
        pic:null
    }),
    actions:{

        async subir(image, idNota){
            try {
                this.loading = true;
                let uploadRef = ref(getStorage(),'/publicaciones/'+idNota+'/galeria/'+image.name)
                await uploadBytes(uploadRef, image);
            } catch (e) {
                console.log(e);
            } finally {
                this.loading = false;
            }
            
        },

        async borrar(imageName, idNota){
            try {
                this.loading = true;
                let imgRef = ref(getStorage(),'/publicaciones/'+idNota+'/galeria/'+imageName)
                deleteObject(imgRef);
            } catch (e) {
                this.setError(e);
                console.log(e);
            } finally{
                this.loading = false;
            }
        },

        async loadGaleria(idNota){
            try {
                this.loading = true;
                
                this.allPics = [];

                let listRef = ref(getStorage(),'/publicaciones/'+idNota+'/galeria');

                listAll(listRef).then((result) => {
                    // Obtener los metadatos de cada archivo
                    return Promise.all(result.items.map((itemRef) => {
                        return getMetadata(itemRef).then((metadata) => ({
                            ref: itemRef,
                            metadata: metadata
                        }));
                    }));
                })
                .then((filesWithMetadata) => {
                    // Ordenar archivos por fecha de modificación, del más reciente al más antiguo
                    filesWithMetadata.sort((a, b) => b.metadata.updated - a.metadata.updated);
                    
                    // Ahora filesWithMetadata está ordenado, puedes usarlo según necesites
                    filesWithMetadata.forEach(async (file) => {
                        let url = await getDownloadURL(file.ref);
                        this.allPics.push({ 
                            ref:file.ref,
                            nombre: file.ref.name,
                            url:url,
                            fullPath: file.ref.fullPath, 
                            updated: file.metadata.updated
                        })
                    });
                })

            } catch (e) {
                this.setError('Error trying to fetch the gallery. Please try again');
                console.log(e);
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

    }
})