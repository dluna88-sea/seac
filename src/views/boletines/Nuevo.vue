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

let mainQuill = null;

const saveQuill = async () => {
    var delta = mainQuill.getContents();
    let datos = {
        content: JSON.stringify(delta), 
        autor: currentUser.id, 
        titulo:document.querySelector('#titulo').value.trim(),
        status:0 
    }
    await boletines.guardar(datos);
}

const publishQuill = async () => {
    var delta = mainQuill.getContents();
    await boletines.guardar({
        content: delta, 
        autor: currentUser.id, 
        titulo:document.querySelector('#titulo').ariaValueMax.trim(),
        status:1 
    });
}

const createQuill = async () => {
    if(currentUser.id == null){ await currentUser.getDatos(); }
    mainQuill = new Quill('#MainContentQuill',{ theme:'bubble', placeholder:'Escribe aquí' });
    mainQuill.focus();

}
setTimeout(createQuill,2500);
</script>

<template>
    
    <DefaultPage>

        <Loading v-if="boletines.loading"></Loading>
        <div v-else>

            <PageTitle :bread="bread">
                Nuevo boletín
            </PageTitle>

            <div class="row">
                <div class="col-6">
                    <BigCard>
                        <div class="row">
                            <div class="col-12">
                                
                                <input type="text" class="form-control quillTitle" name="titulo" id="titulo" placeholder="Escribe aquí el título">
                                
                            </div>
                        </div>


                        <div class="row mb-3">
                            <div class="col-12">
                                <div id="MainContentQuill"></div>
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
                        
                    </BigCard>
                </div>

                <div class="col-6">
                    <BigCard>
                        <div id="result"></div>
                    </BigCard>
                </div>
            </div>

        </div>

    </DefaultPage>
    
</template>