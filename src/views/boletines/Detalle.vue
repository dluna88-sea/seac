<script setup>
import { useBoletinesStore } from '../../stores/boletines';
import { useRoute } from 'vue-router';
import Quill from "quill";

const boletines = useBoletinesStore();
const route = useRoute();

const bread = [
    {href:'/',class:'',text:'Panel'},
    {href:'/boletines',class:'',text:'Boletines'},
    {href:'',class:'active',text:'Boletín'},
]
let quillContent = null;
async function getBoletin(){
    await boletines.get(route.params.id).then(() => {
        quillContent = new Quill('#quillContent');
        quillContent.enable(false);
        quillContent.setContents(boletines.delta)
    });

}

getBoletin()
</script>

<template>
    <DefaultPage>
        <PageTitle :bread="bread">
            <Icon name="file-text" Class="mx-2" />Boletin:
        </PageTitle>

        <div class="row mb-5"><div class="col">

            <BigCard>
                <Loading v-if="boletines.loading"></Loading>
                
                <div v-else>
                    <h1>{{ boletines.titulo }}</h1>
                    <p>Por: {{ boletines.autor }} <br> El {{ boletines.fecha }}</p>
                    <hr class="my-3">
                    <div id="quillContent"></div>
                </div>
            </BigCard>

        </div></div>
    </DefaultPage>
</template>