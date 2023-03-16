<script setup>
import { useRoute } from 'vue-router';
import { useSeccionStore } from '../../stores/seccion';
import DeleteSeccionModal from '../../components/modals/DeleteSeccionModal.vue';
import EditarDocumentoModal from '../../components/modals/documentos/EditarDocumentoModal.vue';
import UploadFileModal from '../../components/modals/UploadFileModal.vue';

const seccion = useSeccionStore();
const route = useRoute();

async function getDatos(){
    await seccion.get(route.params.modID, route.params.secID)
}

getDatos();

let bread = [
    { href:"/", class:"", text:"Panel" },
    { href:"/transparencia", class:"", text:"Transparencia" },
    { href:"/transparencia/"+route.params.modID, class:"", text:'Módulo' },
    { href:"", class:"active", text:'Seccion' },
]

const editSubtitulo = async () => {
    const subtitulo = document.forms['editSubtituloForm']['subtitulo'].value.trim();
}

const editDescripcion = async () => {
    const descripcion = document.form['editDescripcionForm']['descripcion'].value.trim();
}


</script>
<template>

<DefaultPage>

    

    <Loading v-if="seccion.loading"></Loading>

    <PageTitle :bread="bread"></PageTitle>

    <div class="row my-3">
        <div class="col">
            <div class="list-group shadow-sm">
                <div class="list-group-item bg-light">
                    <h4 class="float-start">Editar Sección</h4>
                    <button class="btn btn-danger float-end" data-bs-toggle="modal" :data-bs-target="`#deleteSeccionModal-${route.params.secID}`">
                        <Icon name="x-circle" />
                        Eliminar esta sección</button>
                </div>
                <div class="list-group-item p-4">
                    <div class="mb-3">
                        <form @submit.prevent="editSubtitulo()" name="editSubtituloForm">
                            <label for="subtitulo" class="form-label">Título:</label>
                            <input type="text" :value="seccion.subtitulo" class="form-control" name="subtitulo" id="subtitulo" placeholder="Escribe el nombre de la sección">
                            <button type="submit" class="btn btn-secondary mt-2 float-end"><Icon name="pencil" /> Actualizar</button>
                        </form>
                    </div>
                </div>
                <div class="list-group-item p-4">
                    <div class="mb-3">
                        <form @submit.prevent="editDescripcion()" name="editDescripcionForm"></form>
                        <label for="descripcion" class="form-label">Descripción: (Opcional)</label>
                        <textarea name="descripcion" id="descripcion" class="form-control">{{ seccion.descripcion }}</textarea>
                        <button type="submit" class="btn btn-secondary mt-2 float-end"><Icon name="pencil" /> Actualizar</button>
                    </div>
                </div>
                
            </div>
            <DeleteSeccionModal
                :id="route.params.secID"
                :modID="route.params.modID"
                :subtitulo="seccion.subtitulo"
            ></DeleteSeccionModal>
        </div>
    </div>

    <div class="row my-5">
        <div class="col-12 text-center">
            <h4>
                <Icon name="paperclip" />
                Documentos adjuntos:
            </h4>
            <p>
                <button class="btn btn-secondary btn-sm" data-bs-toggle="modal" :data-bs-target="`#uploadModal_${seccion.id}`"><Icon name="upload" Class="mx-2" /> Subir</button>
            </p>
        </div>
        <div v-if="seccion.documentos.length == 0" class="col-12 text-center">
            <Info>NO HAY DOCUMENTOS ADJUNTOS EN ESTA SECCIÓN</Info>
        </div>
        <div v-else class="col-12 mt-3 mb-5">
            <div class="list-group">
                
                <div v-for="doc, i in seccion.documentos" class="list-group-item d-flex justify-content-between align-items-center">
                    <a :href="doc.url" target="_blank" style="text-decoration:none; color:black" class="col-11">
                        {{ doc.nombre }}
                    </a>
                    <div class="col-1">
                        <div class="btn-group btn-group-sm float-end shadow-sm" role="group" aria-label="Basic example">
                            <button v-if="i > 0" @click="reorder(seccion.uid,1, seccion.id)" type="button" class="btn btn-light">
                                <Icon name="chevron-up" />
                            </button>
                            <button v-if="i < (seccion.documentos.length -1)" @click="reorder(seccion.uid,0, seccion.id)" type="button" class="btn btn-light">
                                <Icon name="chevron-down" />
                            </button>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" :data-bs-target="`#deleteSeccionModal-${seccion.id}`">
                                <Icon name="x" />
                            </button>
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
        <UploadFileModal
            :id="`uploadModal_${seccion.id}`"
            :seccion="{ modID:route.params.modID, secID:route.params.secID }"
        ></UploadFileModal>
    </div>

</DefaultPage>

</template>