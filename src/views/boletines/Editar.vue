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

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'/boletines', class:'' },
    { text:'Nuevo', href:'', class:'active' },
];

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

let quill = null;
async function cargarDatos(){
    await boletines.get(route.params.id);
    quill = new Quill('#postContainer', { theme:'snow', modules: { toolbar: toolbarOptions }, }).focus();

}

cargarDatos();

const guardar = async (status) => {
    
    console.log(quill);
}

</script>

<template>
    
    <DefaultPage>

        <Loading v-if="boletines.loading"></Loading>
        <div v-else>

            <PageTitle :bread="bread"></PageTitle>

            <div class="row">
                <div class="col">
                    <BigCard>
                        <div class="row">
                            <div class="col-12 mb-3">
                                <input type="text" :value="boletines.titulo" class="form-control quillTitle" name="titulo" id="titulo" placeholder="Escribe aquí el título">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col" id="postContainer"></div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <Error v-if="isError">{{ errorText }}</Error>
                                <div class="btn-group float-end mt-2">
                                    <button @click="guardar(0)" class="btn btn-outline-secondary">
                                        <Icon Class="mx-2" name="eraser" />Guardar borrador
                                    </button>
                                    <button @click="guardar(1)" class="btn btn-outline-success">
                                        <Icon Class="mx-2" name="globe" />Publicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </BigCard>
                </div>
            </div>

            
        </div>

    </DefaultPage>
    
</template>