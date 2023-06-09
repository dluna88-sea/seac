<script setup>
import { useRoute } from 'vue-router';
import { usePublicacionesStore } from '../../stores/publicaciones';
import { useAutoresStore } from '../../stores/autores';

let route = useRoute();
let pub = usePublicacionesStore();
let autores = useAutoresStore();

async function getDetail(){
    await pub.get(route.params.id);
    document.querySelector(".imagenPortada").style.backgroundImage = `url(${pub.singlePub.imagen})`
    await autores.getAll();    
}
getDetail()

let savePublication = async() => {

    let imagen = document.querySelector("#imagen").files[0];

    let datos = {
        contenido: tinymce.get("contenido").getContent(),
        excerpt: document.querySelector("#excerpt").value,
        titulo: document.querySelector("#titulo").value,
        imagen: imagen,
        etiquetas:document.querySelector("#etiquetas").value,
        autor:document.querySelector("#autores").value,
        publishAt:document.querySelector("#publishAt").value
    }

    await pub.actualizar(route.params.id,datos).then(() => {
        getDetail();
    });

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

            <div class="row ">
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
                    <label>Etiquetas (separadas por coma):</label>
                    <textarea name="tags" id="etiquetas" class="form-control" rows="2">{{ pub.etiquetas  }}</textarea>
                    <label class="mt-2">Autor: </label>
                    <select id="autores" class="form-control">
                        <option :value="pub.singlePub.autor.id">{{ pub.singlePub.autor.nombre }}</option>
                        <optgroup label="Cambiar autor:">
                            <option v-for="autor in autores.all" :value="autor.id">{{ autor.nombre }}</option>
                        </optgroup>
                    </select>
                    <label class="mt-2">Fecha de publicación: </label>
                    <input class="form-control" type="datetime-local" id="publishAt" :value="pub.singlePub.publishAt">
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

</style>