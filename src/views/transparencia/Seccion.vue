<script setup>
import { useRoute } from 'vue-router';
import { useModuloStore } from '../../stores/modulo';
import DeleteSeccionModal from '../../components/modals/DeleteSeccionModal.vue';
import EditarDocumentoModal from '../../components/modals/documentos/EditarDocumentoModal.vue';
import UploadFileModal from '../../components/modals/UploadFileModal.vue';

const modulo = useModuloStore();
const route = useRoute();
let documentos = [];
async function getDatos(){
    await modulo.getSeccion(route.params.modID, route.params.secID)
    documentos = await modulo.getDocuments(route.params.modID, route.params.secID)
}

getDatos();

/** 
 * Acciones de cada sección
*/
const updSubtitulo = async() => {
    const subtNuevo = document.forms['secSubtitulo']['subtitulo'].value.trim();
    if(subtNuevo != modulo.seccion.subtitulo){
        await modulo.updateSeccion({subtitulo:subtNuevo},route.params.modID,modulo.seccion.id);
        location.reload();
    }
}

const updDescripcion = async() => {
    const descNueva = document.forms['secDescripcion']['descripcion'].value.trim();
    if(descNueva != modulo.seccion.descripcion){
        await modulo.updateSeccion({descripcion:descNueva},route.params.modID,modulo.seccion.id);
        location.reload();
    }
}

</script>
<template>

<DefaultPage>

    <ul class="nav nav-pills mb-2 mt-3">
                <li class="nav-item">
                    <routerLink :to="`/transparencia/${route.params.modID}`" class="nav-link active" aria-current="page">
                        <Icon name="arrow-left" /> Regresar
                    </routerLink>
                </li>
                <!-- <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li> -->
            </ul>

    <Loading v-if="modulo.loading"></Loading>

    <Card v-else Class="mb-5">
    <CardHeader>
        <div class="row">

            <label for="subtitulo" class="col-sm-3 col-form-label text-sm-end">Subtítulo</label>
            <div class="col-sm-9">
                
                <form name="secSubtitulo" @submit.prevent="updSubtitulo(modulo.seccion.id,modulo.seccion.subtitulo)" class="row row-cols-auto g-3">
                    <input type="hidden" name="orden" :value="modulo.seccion.orden">
                    <div class="col-xl-10 col-lg-8 col-md-7 col-sm-7 col-xs-12">
                        <input type="hidden" name="idSeccion" :value="modulo.seccion.id">
                        <input type="text" class="form-control" name="subtitulo" :value="modulo.seccion.subtitulo">
                    </div>
                    <div class="col-xl-2 col-lg-4 col-md-5 col-sm-5 col-xs-12">
                        <button class="btn btn-secondary" type="submit">Editar</button>
                        <a class="float-end" data-bs-toggle="modal" :data-bs-target="`#deleteSeccionModal-${modulo.seccion.id}`" style="color:red; cursor:pointer"><Icon name="x-circle-fill" /></a>
                    </div>
                </form>
                <DeleteSeccionModal
                    :id="modulo.seccion.id"
                    :modID="route.params.modID"
                    :subtitulo="modulo.seccion.subtitulo"
                ></DeleteSeccionModal> 
            </div>
        </div>
    </CardHeader>
    <CardBody Class="p-4">

        <div class="row mb-3">
            <label for="descripcion" class="col-sm-3 col-form-label text-sm-end">Descripción</label>
            <div class="col-sm-9">
                <form name="secDescripcion" @submit.prevent="updDescripcion()">
                    <textarea placeholder="Opcional" class="form-control" id="descripcion" name="descripcion">{{ modulo.seccion.descripcion }}</textarea>
                    <button type="submit" class="btn btn-secondary mt-2">Actualizar descripción</button>
                </form>
            </div>
        </div>

        <hr>

        <fieldset class="row mb-3">
            
            <legend class="col-form-label col-sm-3 pt-0  text-sm-end">
                <Icon name="paperclip" /> Documentos adjuntos:
                <br />
                <a class="btn btn-secondary mt-3" data-bs-toggle="modal" :data-bs-target="`#uploadModal_${modulo.seccion.id}`" ><Icon name="upload" /> Subir archivo</a>
                    
            </legend>
            <UploadFileModal
                :id="`uploadModal_${modulo.seccion.id}`"
                :seccion="{ modID:route.params.modID, secID:route.params.secID }"
            ></UploadFileModal>
            
            <div class="col-sm-9">
                
                <Loading v-if="modulo.loading"></Loading>
                
                <Info v-else-if="modulo.documentos.length == 0">No hay documentos adjuntos</Info>
                
                <ul v-else class="list-group shadow-sm" >
                    <li v-for="(doc) in modulo.documentos" class="list-group-item ">
                        <Icon name="file-pdf" />
                        <a style="text-decoration: none;" :href="doc.url" target="_blank" >
                            <span class="mx-2">{{ doc.nombre }}</span>
                        </a>
                        
                        <a class="float-end mx-2" data-bs-toggle="modal" :data-bs-target="`#deleteModal${modulo.seccion.id}-${doc.id}`" style="color:red; cursor:pointer"><Icon name="x-circle-fill" /></a>
                        <a class="float-end" data-bs-toggle="modal" :data-bs-target="`#updateFileData_${doc.id}`" style="color:blue; cursor:pointer"><Icon name="pencil-fill" /></a>
                        <EditarDocumentoModal
                            :id="`updateFileData_${doc.id}`"
                            :archivo="doc"
                        ></EditarDocumentoModal>
                        <ModalDeleteFile 
                            :id="`deleteModal${modulo.seccion.id}-${doc.id}`"
                            :archivo="{  
                                docID: doc.id,
                                seccion: modulo.seccion.id, 
                                nombre: doc.nombre,
                                filename: doc.filename, 
                                modulo:route.params.modID,
                                url: doc.url 
                            }"></ModalDeleteFile>
                        
                    </li>
                </ul>
            </div>

        </fieldset>

    </CardBody>    
    
    </Card>

</DefaultPage>

</template>