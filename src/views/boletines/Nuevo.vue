<script setup>
import { useCurrentUserStore } from "../../stores/currentUser";
import Quill from "quill";
import { auth } from "../../firebase";
import {useBoletinesStore} from '../../stores/boletines';
const boletines = useBoletinesStore();
const currentUser = useCurrentUserStore();

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'/boletines', class:'' },
    { text:'Nuevo', href:'', class:'active' },
];


const addQuill = () => {
    var counter = countElements();
    var div = document.createElement('div');
    div.setAttribute('class','border position-relative my-2')
    div.innerHTML = '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cursor-pointer">x</span><div id="quill-'+counter+'"></div>';
    document.getElementById('postContainer').append(div);
    setTimeout(createQuill('quill-'+counter), 2000);
}

function createQuill(id){
    new Quill('#'+id, { theme:'bubble' }).focus();
}

function countElements(){
    return document.getElementById('postContainer').childNodes.length;
}

</script>

<template>
    
    <DefaultPage>

        <Loading v-if="boletines.loading"></Loading>
        <div v-else>

            <PageTitle :bread="bread">
                Nuevo boletín
            </PageTitle>

            <div class="row">
                <div class="col">
                    <Card>
                        <CardBody>
                        <div class="row">
                            <div class="col-12">
                                
                                <input type="text" class="form-control quillTitle" name="titulo" id="titulo" placeholder="Escribe aquí el título">
                                
                            </div>
                        </div>


                        <div class="row mb-3">
                            <div class="col" id="postContainer"></div>
                        </div>

                        <div class="row">
                            <div class="col-12 text-center p-4 shadow-sm my-3 bg-light">
                                <div class="btn-group">
                                    <button @click="addQuill()" class="btn btn-secondary btn-sm"><Icon name="plus-circle" /> Párrafo</button>
                                    <button @click="" class="btn btn-secondary btn-sm"><Icon name="image" /> Imágen</button>
                                    <button @click="" class="btn btn-secondary btn-sm"><Icon name="paperclip" /> Documento</button>
                                </div>
                            </div>
                        </div>

                        <hr class="my-4">

                        <div class="row my-3">
                            <div class="col-12">
                                <div class="btn-group float-end">
                                    <button class="btn btn-secondary" @click="saveQuill">Guardar</button>
                                    <button class="btn btn-primary">Publicar</button>
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