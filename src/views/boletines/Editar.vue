<script setup>

import { useRoute } from "vue-router";
import { serverTimestamp } from "firebase/firestore/lite";
import { useCurrentUserStore } from "../../stores/currentUser";
import Quill from "quill";
import {useBoletinesStore} from '../../stores/boletines';
import {useUsuariosStore} from '../../stores/usuarios';
import {useAutoresStore} from '../../stores/autores';
const autores = useAutoresStore();
const usuarios = useUsuariosStore();
const boletines = useBoletinesStore();
const currentUser = useCurrentUserStore();
const route = useRoute();
let isError = false;
let errorText = '';
let imgDestacada = '/default-img.gif';
const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'/boletines', class:'' },
    { text:'Nuevo', href:'', class:'active' },
];

var toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['link','blockquote', 'code-block'],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction


    ['clean']                                         // remove formatting button
];

let quill = null;
let laFecha = new Date();
async function cargarDatos(){
    await boletines.get(route.params.id);
    quill = new Quill('#postContainer', { theme:'snow', modules: { toolbar: toolbarOptions }, }).focus();
    await usuarios.getAll();
    await autores.getAll();
    await autores.get(boletines.autor);
    laFecha = new Date(boletines.publishTimestamp.seconds * 1000 + boletines.publishTimestamp.nanoseconds/1000000);
    document.querySelector("#fecha").setAttribute("value", getFormattedDate(laFecha));
}

function getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

cargarDatos();

const guardar = async (status) => {
    quill = new Quill("#postContainer").getContents();
    let stat = "borrador";
    let imagen = document.querySelector("#imagenDestacada").value;
    let autor = document.querySelector("#autor").value;
    let titulo = document.querySelector("#titulo").value;
    let publishTimestamp = document.querySelector("#fecha").value;
    if(status == 1){
        stat = "publicado";
    }
    let data = {
        content: JSON.stringify(quill),
        autor:autor,
        imagen:imagen,
        status:status,
        titulo:titulo,
        fecha:fecha
    }

    console.log(data);
}

</script>

<template>
    <Loading v-if="boletines.loading"></Loading>
    <div v-else>
        <MainNavbar></MainNavbar>
        
        <FWPage>

            <div class="row">

                <div class="col-sm-12 col-md-8 col-lg-9">
                    <BigCard>
                        <div class="row mb-3">
                            <div class="col-12">
                                <input type="text" :value="boletines.titulo" class="form-control quillTitle" name="titulo" id="titulo" placeholder="Escribe aquí el título">
                            </div>
                        </div>
                        <div class="row mb-3">
                            
                            <div class="col" id="postContainer"></div>
                        </div>
                    </BigCard>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-3">
                    <Card>
                        <CardHeader>Detalles:</CardHeader>
                        <CardBody>
                            <div class="my-3">
                                <label>Imágen de portada:</label>
                                <div class="imgPreview" :style="`background-image: url('${imgDestacada}');`"></div>
                                <input type="hidden" id="imagenDestacada" :value="imgDestacada">
                            </div>
                            <div class="my-3">
                                <label for="fecha">
                                    Fecha de publicación: 
                                </label>
                                <input type="date" id="fecha" class="form-control" >
                                
                            </div>
                            <hr>
                            <div class="my-3">
                                <label for="fecha">
                                    Autor: 
                                </label>
                                <select name="autor" id="autor" class="form-control">
                                    <option selected :value="autores.datos.id">{{ autores.datos.nombre }}</option>
                                    <optgroup label="Todos:">
                                        <option v-for="autor in autores.listado" :value="autor.id">{{ autor.nombre }}</option>
                                    </optgroup>
                                </select>
                            </div>
                            <hr>
                            <div class="my-3">
                                <label>
                                    Creado el: {{ boletines.fecha }}
                                </label>
                                <label>
                                    Status: Borrador
                                </label>
                            </div>
                            <hr>
                            <div class="btn-group my-3 d-flex">
                                <button @click="guardar(0)" class="btn btn-secondary">Borrador <Icon name="eraser"></Icon></button>
                                <button @click="guardar(1)" class="btn btn-primary">Publicar <Icon name="globe"></Icon></button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

        </FWPage>
    </div>
    
</template>

<style scoped>
    .imgPreview{
        width: 100%;
        height: 200px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>