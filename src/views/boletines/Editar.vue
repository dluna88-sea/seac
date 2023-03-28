<script setup>
import { useRoute } from "vue-router";
import { useCurrentUserStore } from "../../stores/currentUser";
import Quill from "quill";
import { auth } from "../../firebase";
import {useBoletinesStore} from '../../stores/boletines';
const boletines = useBoletinesStore();
const currentUser = useCurrentUserStore();
const route = useRoute();

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'/boletines', class:'' },
    { text:'Nuevo', href:'', class:'active' },
];

function createQuill(id){
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
    new Quill('#'+id, { theme:'bubble', modules: { toolbar: toolbarOptions }, }).focus();
}

async function cargarDatos(){
    await boletines.get(route.params.id);
    createQuill("postContainer");
}

cargarDatos();


</script>

<template>
    
    <DefaultPage>

        <Loading v-if="boletines.loading"></Loading>
        <div v-else>

            <PageTitle :bread="bread"></PageTitle>

            <div class="row">
                <div class="col-10">
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

                        </CardBody>
                    </Card>
                </div>
                <div class="col-2">
                    sidebar buttons
                </div>

                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasRightLabel">Offcanvas right</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        
                    </div>
                </div>
            </div>

        </div>

    </DefaultPage>
    
</template>