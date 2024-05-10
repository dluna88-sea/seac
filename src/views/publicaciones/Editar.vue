<script setup>
import { useRoute } from 'vue-router';
import { usePublicacionesStore } from '../../stores/publicaciones';
import { useAutoresStore } from '../../stores/autores';
import { useGaleriaStore } from '../../stores/galeria';

let route = useRoute();
let pub = usePublicacionesStore();
let autores = useAutoresStore();
let galeria = useGaleriaStore();

let openGallery = async () => {
    await galeria.loadGaleria(route.params.id);
}

const uploadImage = () => {
    let uploadImageInput = document.querySelector("#nuevoGaleria");
    uploadImageInput.click()
}

const uploadImageToGalery = async () => {
    await galeria.subir(document.querySelector("#nuevoGaleria").files[0], route.params.id);
    openGallery();
}

const deletePicture = async (imgName) => {
    await galeria.borrar(imgName, route.params.id);
    openGallery();
}

async function getDetail(){
    await pub.get(route.params.id);
    document.querySelector(".imagenPortada").style.backgroundImage = `url(${pub.singlePub.imagen})`
    await autores.getExcept(pub.singlePub.autor.id);
}
getDetail()

let savePublication = async() => {

    let imagen = document.querySelector("#imagen").files[0];
    let newDoc = null;
    if(pub.singlePub.documento){
        newDoc = document.querySelector("#uploadFile").files[0];
    }
    let content = pub.singlePub.contenido;
    
    if(pub.singlePub.documento == false){
        content = tinymce.get("contenido").getContent();
    }
    let datos = {
        contenido: content,
        excerpt: document.querySelector("#excerpt").value,
        titulo: document.querySelector("#titulo").value,
        imagen: imagen,
        documento:newDoc,
        etiquetas:document.querySelector("#etiquetas").value,
        autor:document.querySelector("#autores").value,
        publishAt:document.querySelector("#publishAt").value,
        status:document.querySelector("#status").value
    }

    await pub.actualizar(route.params.id,datos).then(() => {
        getDetail();
    });

}

function selectURL(event){
    event.target.select();
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copy command was ' + msg);
    } catch (err) {
        console.error('Oops, unable to copy', err);
    }
}

function selectImage(){
    let fileInput = document.querySelector("#imagen");
    fileInput.click()
}

function previsualizar(){
    let imagen = document.querySelector("#imagen").files[0];
    if (imagen) {
        let divPrevisualizacion = document.querySelector(".imagenPortada");
        divPrevisualizacion.style.backgroundImage = `url(${URL.createObjectURL(imagen)})`;
    }
}

function clearPicture(){
    document.querySelector("#imagen").value = "";
    document.querySelector(".imagenPortada").style.backgroundImage = "";
}

</script>

<template>
    <DefaultPage>
        <Loading v-if="pub.loading"></Loading>
        <div class="container" v-else>
            
            <div class="row">
                <div class="col">
                    <div class="btn-group">
                        <a :href="`/publicacion/${route.params.id}`" class="btn btn-secondary">
                            <Icon name="chevron-left" />
                        </a>
                    </div>
                </div>
            </div>
            <hr>

            <div class="row my-3">
                <div class="col">
                    <label>Título:</label>
                    <input type="text" id="titulo" name="titulo" class="form-control" style="font-size:24px;" :value="pub.singlePub.titulo">
                </div>
            </div>

            <div class="row my-3">
                <div class="col">
                    <label>Resumen:</label>
                    <textarea id="excerpt" style="font-size:15px;" class="form-control" name="excerpt" rows="2">{{ pub.singlePub.excerpt }}</textarea>
                </div>
            </div>

            <div v-if="pub.singlePub.documento == false" class="row ">
                <div class="col">
                    <label>Contenido:</label>
                    <editor api-key="6dbty1ge6o3ygx3nafzaz6cv5qeersdb4nfphoimlyba0mp2"
                        :init="{
                            plugins: [
                            'lists link image paste help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent ',
                            
                        }"
                        :initial-value="pub.singlePub.contenido"
                        plugins='autoresize code'
                        id="contenido"
                        :inline=false
                        theme= 'modern'
                    />

                    
                </div>
            </div>
            

            <div class="row">
                <div class="col-sm-12 col-md-6 mt-3">
                    <div v-if="pub.singlePub.documento == true">
                        <label><Icon name="file-earmark-richtext" /> Ver documento:</label> <a  target="_blank" :href="pub.singlePub.contenido">{{ pub.singlePub.titulo }}</a>
                        <br><br><label><Icon name="shuffle" /> Reemplazar documento:</label> 
                        <input type="file" class="form-control mb-3" accept="application/pdf" id="uploadFile" name="documento" aria-describedby="uploadFileAddon" aria-label="Upload">
                        
                        <hr>
                    </div>
                    <div class="mb-4">
                        <button @click="openGallery" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#galeriaModal">Ver galería de imágenes</button>
                        <div class="modal modal-xl fade" id="galeriaModal" tabindex="-1" aria-labelledby="galeriaModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-scrollable">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="galeriaModalLabel">Imágenes</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <Loading v-if="galeria.loading == true"></Loading>
                                    <div v-else class="container-fluid">
                                        
                                        <div class="row">
                                            <div class="col text-center my-5" v-if="galeria.allPics.length == 0">
                                            <h4 style="color: #ccc;">NO HAY IMAGENES EN ESTA GALERÍA</h4>
                                            </div>
                                            <div v-else v-for="img in galeria.allPics" class="col-md-6 col-sm-6 col-xs-12 col-lg-3">
                                                <span style="margin-left:-5px" @click="deletePicture(img.nombre)" class="clearBtn float-end"><Icon name="trash3-fill" /></span>
                                                <div class="card mb-3">
                                                    <img :src="img.url" class="card-img-top">
                                                    <div class="card-footer">
                                                        <div class="text-center mb-2">{{ img.nombre }}</div>
                                                        <input class="form-control" @focus="selectURL" type="text" :value="img.url">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <input @change="uploadImageToGalery()" type="file" multiple="false" accept=".png, .jpg, .jpeg" name="nuevoGaleria" id="nuevoGaleria" class="d-none">
                                    <button type="button" @click="uploadImage()" class="btn btn-secondary"><Icon name="upload" /> &nbsp;Subir</button>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <label>Etiquetas (separadas por coma):</label>
                    <textarea name="tags" id="etiquetas" class="form-control" rows="2">{{ pub.etiquetas  }}</textarea>
                    <label class="mt-2">Autor: </label>
                    <select id="autores" class="form-control">
                        <option :value="pub.singlePub.autor.id">{{ pub.singlePub.autor.nombre }}</option>
                        <optgroup label="Cambiar autor:">
                            <option v-for="aut in autores.allBut" :value="aut.id">{{ aut.nombre }}</option>
                        </optgroup>
                    </select>
                    <label class="mt-2">Fecha de publicación: </label>
                    <input class="form-control" type="datetime-local" id="publishAt" :value="pub.singlePub.publishAt">
                    <label class="mt-2">Estado: </label>
                    <select id="status" name="status" class="form-control">
                        <option v-if="pub.singlePub.status == 1" selected :value="1">Borrador</option>
                        <option v-else :value="1">Borrador</option>
                        <option v-if="pub.singlePub.status == 0" selected :value="0">Publico</option>
                        <option v-else :value="0">Publico</option>
                    </select>
                </div>
                <div class="col-sm-12 col-md-6 mt-3">
                    <label>Imágen de portada:</label>
                    <span @click="clearPicture()" class="clearBtn float-end"><Icon name="x" /></span>
                    <div @click="selectImage()" class="imagenPortada">
                    </div>
                    <input @change="previsualizar()" type="file" multiple="false" accept=".png, .jpg, .jpeg" name="imagen" id="imagen" class="d-none">
                </div>
            </div>

            <div class="row my-4">
                <div class="col">
                    <button class="btn btn-secondary float-end" @click="savePublication">Guardar</button>
                </div>
            </div>
        </div>
    </DefaultPage>
</template>
    
<style scoped>
.clearBtn{
    text-decoration: none;
    color: #fff;
    background-color: #f00;
    border-radius: 10px;
    padding:2px 5px 0px 5px;
    cursor: pointer;
}
.imagenPortada{
    background-color:#b9b9b9;
    min-height: 200px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
}
.card-img-top {
  width: 100%;   /* Asegura que la imagen siempre ocupe todo el ancho del card */
  height: 200px; /* Define una altura fija para todas las imágenes */
  object-fit: cover; /* Asegura que la imagen cubra completamente el área asignada, similar al background-size: cover; */
  object-position: center; /* Centra la imagen dentro del área asignada */
}

/* Estilos para dispositivos menores que md */
@media (max-width: 767.98px) {
  .card-img-top {
    height: 100px; /* Altura para móviles */
  }
}

</style>