<script setup>
import { useRoute } from "vue-router";
import { useBoletinesStore } from "../../stores/boletines";
import { Quill } from "@vueup/vue-quill";
import { useAutoresStore } from "../../stores/autores";
const autores = useAutoresStore();
const route = useRoute();
const boletines = useBoletinesStore();

//Cargar datos del boletin seleccionado:
async function cargarDatos(){

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];

    await boletines.get(route.params.id);
    await autores.getAll();
    let quill = new Quill("#contentQuill",{
        modules: {
            toolbar:toolbarOptions
        },
        theme: 'snow'
    });
    quill.setContents(JSON.parse(boletines.content)); 
    console.log(autores.listado);
}
cargarDatos();
</script>

<template>
    <Loading v-if="boletines.loading"></Loading>
    <div v-else>
        <MainNavbar></MainNavbar>
        
        <FWPage>
            <div class="row">
                <div class="col">
                    <BigCard>
                        <input type="text" :value="boletines.titulo" class="form-control quillTitle mb-2">
                        <div style="border:none;" id="contentQuill"></div>
                    </BigCard>
                </div>
                <div class="col-md-3 my-3">
                    <Card>
                        <CardBody>
                            <div class="position-relative">
                                <div class="imgPreview" :style="`background-image: url('${boletines.imagen}');`"></div>
                            </div>
                            <hr>
                            <p> 
                                <label for="autor">Autor: </label>
                                <select name="autor" id="autor" class="form-control mb-2">
                                    <option :value="boletines.autorID">{{ boletines.autor }}</option>
                                    <optgroup label="Cambiar por:">
                                        <option v-for="autor in autores.listado" :value="autor.id">{{ autor.nombre }}</option>
                                    </optgroup>
                                </select>
                                <label for="publishAt">Publicar el: </label>
                                <input class="form-control" type="date" name="publishAt" id="publishAt" :value="boletines.fechaFormateada" >
                            </p>
                            <hr>
                            <p> Creado el {{ boletines.fecha }} </p>
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