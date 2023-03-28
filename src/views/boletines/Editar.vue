<script setup>
import { useRoute } from "vue-router";
import { useCurrentUserStore } from "../../stores/currentUser";
import Quill from "quill";
import { auth } from "../../firebase";
import {useBoletinesStore} from '../../stores/boletines';
const boletines = useBoletinesStore();
const currentUser = useCurrentUserStore();
const route = useRoute();

let imageCurrent = "";
let currentDoc = "";

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'/boletines', class:'' },
    { text:'Nuevo', href:'', class:'active' },
];

const uploadFile = async () => {
    const archivo = document.getElementById('pictureFile');
    const imgtag = document.getElementById(imageCurrent);
    imgtag.src = URL.createObjectURL(archivo.files[0])
    await boletines.uploadFile(archivo.files[0], route.params.id).then(() => {
        imgtag.src = boletines.lastFileURL;
        imageCurrent = "";
    });
    
}

const uploadDocFile = async () => {
    const archivo = document.getElementById('documentFile');
    const docDiv = document.getElementById(currentDoc);
    docDiv.innerHTML = 'Subiendo archivo. Espere....';
    await boletines.uploadFile(archivo.files[0], route.params.id).then(() => {
        console.log(boletines.lastFileURL);
        docDiv.innerHTML = '<a href="'+boletines.lastFileURL+'" target="_blank">'+archivo.files[0].name+'</a>'
    });
}

const createElement = async (type) => {
    var counter = countElements();
    var div = document.createElement('div');
    div.setAttribute('class','position-relative mb-5 postElement '+type);
    div.setAttribute('id','element-'+counter);
    let content = '';
    switch(type){
        case 'quill':
            content = '<span @click="dropElement('+counter+')" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cursorHand">x</span><div class="myQuill" id="quill-'+counter+'"></div>'
            break;
        case 'image':
            const file = document.getElementById("pictureFile");
            content = '<span @click="dropElement('+counter+')" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cursorHand">x</span><image id="image-'+counter+'" class="img-fluid mx-auto d-block" src="/default-img.gif" />';
            imageCurrent = 'image-'+counter;
            file.click();
            break;
        case 'document':
            const doc = document.getElementById("documentFile");
            currentDoc = "document-"+counter;
            
            doc.click();
            break;
    }
    //div.innerHTML = content;
    document.getElementById('postContainer').append(div);
    if(type=="quill"){ setTimeout(createQuill("quill-"+counter),2000); }
}

function createQuill(id){
    new Quill('#'+id, { theme:'snow' }).focus();
}

function countElements(){
    return document.getElementById('postContainer').childNodes.length;
}

async function guardar(status = 0){
    const elements = [];

    let elementos = Array.from(document.getElementsByClassName('postElement'));
    
    elementos.forEach((elemento) => {
        let clases = Array.from(elemento.classList)
        if(clases.includes('quill')){
            if(elemento.innerHTML.includes("myQuill")){
                var qui = new Quill("#"+elemento.lastElementChild.id).getContents();
                elements.push({ id:elemento.id, type:'quill', content:JSON.stringify(qui) });
            }
        }
        if(clases.includes('image')){
            elements.push({ id:elemento.id, type:'image', src:elemento.lastElementChild.src });
        }
        if(clases.includes('document')){
            elements.push({ id:elemento.id, type:'document', src:elemento.lastElementChild.src });
        }
    })

    console.log(elements)
}

async function cargarDatos(){
    await boletines.get(route.params.id);
}

cargarDatos();


</script>

<template>
    
    <DefaultPage>

        <Loading v-if="boletines.loading"></Loading>
        <div v-else>

            <PageTitle :bread="bread"></PageTitle>

            <div class="row">
                <div class="col">
                    <Card>
                        <CardBody>
                        <div class="row">
                            <div class="col-12 mb-3">
                                
                                <input type="text" :value="boletines.titulo" class="form-control quillTitle" name="titulo" id="titulo" placeholder="Escribe aquí el título">
                                
                            </div>
                        </div>


                        <div class="row mb-3">
                            <div class="col" id="postContainer"></div>
                        </div>

                        <div class="row">
                            <div class="col-12 text-center p-4 shadow-sm my-3 bg-light">
                                <div class="btn-group">
                                    <button @click="createElement('quill')" class="btn btn-secondary btn-sm"><Icon name="plus-circle" /> Párrafo</button>
                                    <button @click="createElement('image')" class="btn btn-secondary btn-sm"><Icon name="image" /> Imágen</button>
                                    <button @click="createElement('document')" class="btn btn-secondary btn-sm"><Icon name="paperclip" /> Documento</button>
                                </div>
                                <input class="visually-hidden" type="file" accept="image/*" name="imagen" @change="uploadFile()" id="pictureFile">
                                <input class="visually-hidden" type="file" accept="application/pdf, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain" @change="uploadDocFile()" id="documentFile">
                            </div>
                        </div>

                        <hr class="my-4">

                        <div class="row my-3">
                            <div class="col-12">
                                <div class="btn-group float-end">
                                    <button class="btn btn-secondary" @click="guardar(0)">Guardar</button>
                                    <button class="btn btn-primary" @click="guardar(1)">Publicar</button>
                                </div>
                            </div>
                        </div>

                        </CardBody>
                    </Card>
                </div>
            </div>

        </div>

    </DefaultPage>
    
</template>