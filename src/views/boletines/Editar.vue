<script setup>

import { useRoute } from "vue-router";
import { useCurrentUserStore } from "../../stores/currentUser";
import Quill from "quill";
import { auth } from "../../firebase";
import {useBoletinesStore} from '../../stores/boletines';
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
async function cargarDatos(){
    await boletines.get(route.params.id);
    quill = new Quill('#postContainer', { theme:'snow', modules: { toolbar: toolbarOptions }, }).focus();
    imgDestacada = 'https://as01.epimg.net/epik/imagenes/2020/05/13/portada/1589364125_491181_1589365301_noticia_normal.jpg'
}

cargarDatos();

const guardar = async (status) => {
    quill = new Quill("#postContainer").getContents();
    let stat = "borrador";
    let imagen = document.querySelector("#imagenDestacada").value;
    if(status == 1){
        stat = "publicado";
    }
    console.log(quill);
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
                                <input type="date" name="fecha" class="form-control">
                            </div>
                            <hr>
                            <div class="my-3">
                                <label>
                                    Autor: John Camaney
                                </label>
                                <label>
                                    Creado el: 10 de abril de 2023
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