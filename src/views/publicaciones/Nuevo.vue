<script setup>
import { useRoute } from 'vue-router';
import { usePublicacionesStore } from '../../stores/publicaciones';
import { useAutoresStore } from '../../stores/autores';
let autores = useAutoresStore();

let route = useRoute();
let publicaciones = usePublicacionesStore();
let img = 'https://firebasestorage.googleapis.com/v0/b/transparenciaseac.appspot.com/o/publicaciones%2Fstatic%2Fdefault-img.gif?alt=media&token=08f789f9-4bfc-44a9-9533-a2933847ece5&_gl=1*19trn8a*_ga*MTE3MjQ1NzAyOC4xNjg1OTgxNDcw*_ga_CW55HF8NVT*MTY4NjU5MzE2OS4xNi4xLjE2ODY1OTMyOTQuMC4wLjA.'

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Publicaciones', href:'/publicaciones', class:'' },
    { text:'Nueva', href:'', class:'active' }
]

let getAutores = async () => {
    await autores.getAll();
}

let selectPicture = () => {
    let fileInput = document.querySelector("#imagen");
    fileInput.click()
}

function previsualizar(){
    let imagen = document.querySelector("#imagen").files[0];
    if (imagen) {
        let divPrevisualizacion = document.querySelector(".imagenPortada");
        divPrevisualizacion.style.backgroundImage = `url(${URL.createObjectURL(imagen)})`;
        img = imagen;
    }
}

function clearPicture(){
    img = 'https://firebasestorage.googleapis.com/v0/b/transparenciaseac.appspot.com/o/publicaciones%2Fstatic%2Fdefault-img.gif?alt=media&token=08f789f9-4bfc-44a9-9533-a2933847ece5&_gl=1*19trn8a*_ga*MTE3MjQ1NzAyOC4xNjg1OTgxNDcw*_ga_CW55HF8NVT*MTY4NjU5MzE2OS4xNi4xLjE2ODY1OTMyOTQuMC4wLjA.'
    document.querySelector("#imagen").value = "";
    document.querySelector(".imagenPortada").style.backgroundImage = img;
}

getAutores();

let crearPublicacion = async () => {

    let imgn = document.querySelector("#imagen").files[0];

    let datos = {
        contenido: "",
        excerpt: document.querySelector("#excerpt").value,
        titulo: document.querySelector("#titulo").value,
        imagen: imgn,
        etiquetas:"",
        autor:document.querySelector("#autores").value,
        status:1
    }

    await publicaciones.crear(datos).then(() => {
        
    })
}
</script>

<template>
    <DefaultPage>
        <PageTitle :bread="bread">
            <Icon name="file-richtext" /> &nbsp;Crear publicación
        </PageTitle>
        <form @submit.prevent="crearPublicacion()">
            <Loading v-if="publicaciones.loading"></Loading>
            <div v-else class="container">
                <div class="row">
                    <div class="col-sm-12 col-md-7 col-lg-8">        
                        <label>Título:</label>
                        <input required type="text" name="titulo" id="titulo" class="form-control mb-2" autocomplete="off">
                        <label>Autor:</label>
                        <Loading v-if="autores.loading" />
                        <select v-else  name="autores" id="autores" class="form-control mb-2">
                            <option v-for="autor in autores.all" :value="autor.id">{{ autor.nombre }}</option>
                        </select>
                        <label>Descripción corta:</label>
                        <textarea name="excerpt" id="excerpt" rows="3" class="form-control mb-2"></textarea>
                    </div>
                    <div class="col-sm-12 col-md-5 col-lg-4">
                        <label>Imágen de portada:</label>
                        <div @click="selectPicture()" class="square shadow mb-2 mt-1 imagenPortada" style=""></div>
                        <input @change="previsualizar()" type="file" name="imagen" class="d-none" id="imagen">
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mt-2 mb-5">
                        <button type="submit" class="btn btn-primary">Crear</button>
                    </div>
                </div>
            </div>
        </form>
    </DefaultPage>
</template>

<style scoped>

.square {
    position: relative;
    width: 100%;
    border:solid 5px #fff;
    background-image:url('https://firebasestorage.googleapis.com/v0/b/transparenciaseac.appspot.com/o/publicaciones%2Fstatic%2Fdefault-img.gif?alt=media&token=08f789f9-4bfc-44a9-9533-a2933847ece5&_gl=1*19trn8a*_ga*MTE3MjQ1NzAyOC4xNjg1OTgxNDcw*_ga_CW55HF8NVT*MTY4NjU5MzE2OS4xNi4xLjE2ODY1OTMyOTQuMC4wLjA.'); 
    background-position: center; 
    background-repeat: no-repeat; 
    background-size: cover;
    cursor: pointer;
}

.square:after {
    content: "";
    display: block;
    padding-bottom: 65%;
}

</style>