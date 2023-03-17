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
    await seccion.update({ subtitulo:subtitulo }, route.params.modID, route.params.secID ).then(getDatos())
}

const editDescripcion = async () => {
    const descripcion = document.forms['editDescripcionForm']['descripcion'].value.trim();
    await seccion.update({ descripcion:descripcion }, route.params.modID, route.params.secID ).then(getDatos())
}

const reorderFile = async (actUID, to, fileID) => {
    let nuevoUID = 0;
    if(to == 0) nuevoUID = parseInt(actUID) + 1; else nuevoUID = parseInt(actUID) - 1;
    await seccion.reorderFile(actUID,nuevoUID,route.params.modID, route.params.secID, fileID).then(() => { getDatos() });
}

const reorderFile = async (actUID, to, fileID) => {
    let nuevoUID = 0;
    if(to == 0) nuevoUID = parseInt(actUID) + 1; else nuevoUID = parseInt(actUID) - 1;
    await modulo.reorderFile(actUID,nuevoUID,route.params.modID, route.params.secID, fileID).then(() => { getDatos() });
}

</script>
<template>

<DefaultPage>

    

    <Loading v-if="seccion.loading"></Loading>
    <div v-else>

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
                            <form @submit.prevent="editDescripcion()" name="editDescripcionForm">
                                <label for="descripcion" class="form-label">Descripción: (Opcional)</label>
                                <textarea name="descripcion" id="descripcion" class="form-control">{{ seccion.descripcion }}</textarea>
                                <button type="submit" class="btn btn-secondary mt-2 float-end"><Icon name="pencil" /> Actualizar</button>
                            </form>
                        </div>
                    </div>
<<<<<<< HEAD
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

        <div class="row mb-4">
            <div class="col text-center">

                <h4>
                    <Icon name="paperclip" /> Documentos adjuntos:
                </h4>
                <a class="btn btn-secondary mt-3" data-bs-toggle="modal" :data-bs-target="`#uploadModal_${modulo.seccion.id}`" ><Icon name="upload" /> Subir archivo</a>
                
            </div>
            <UploadFileModal
                    :id="`uploadModal_${modulo.seccion.id}`"
                    :seccion="{ modID:route.params.modID, secID:route.params.secID }"
                ></UploadFileModal>
        </div>

        <div class="row mb-4">
            <div class="col">

                <Loading v-if="modulo.loading"></Loading>
                
                <Info v-else-if="modulo.documentos.length == 0">No hay documentos adjuntos</Info>
                
                <ul v-else class="list-group shadow" >
                    <li v-for="(doc, i) in modulo.documentos" class="list-group-item ">
                        <div class="row">
                            <a :href="doc.url" target="_blank" style="text-decoration:none; color:black" class="col-9">
                                <Icon name="file-pdf" />
                                <span class="mx-2">{{ doc.nombre }}</span>
                            </a>
                            <div class="col-3">
                                <div class="btn-group btn-group-sm float-end shadow-sm" role="group" >
                                    <button v-if="i > 0" @click="reorderFile(doc.uid,1,doc.id)" class="btn btn-light">
                                        <Icon name="chevron-up" />
                                    </button>
                                    <button v-if="i < (modulo.documentos.length - 1)" @click="reorderFile(doc.uid,0,doc.id)" class="btn btn-light">
                                        <Icon name="chevron-down" />
                                    </button>
                                    <button class="btn btn-light" data-bs-toggle="modal" :data-bs-target="`#updateFileData_${doc.id}`">
                                        <Icon name="pencil" />
                                    </button>
                                    <button class="btn btn-danger" data-bs-toggle="modal" :data-bs-target="`#deleteModal${modulo.seccion.id}-${doc.id}`">
                                        <Icon name="x" />
                                    </button>
                                </div>
                                <EditarDocumentoModal
=======
                    
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
                                <button v-if="i > 0" @click="reorderFile(doc.uid,1, doc.id)" type="button" class="btn btn-light">
                                    <Icon name="chevron-up" />
                                </button>
                                <button v-if="i < (seccion.documentos.length -1)" @click="reorderFile(doc.uid,0, doc.id)" type="button" class="btn btn-light">
                                    <Icon name="chevron-down" />
                                </button>
                                <button class="btn btn-light" data-bs-toggle="modal" :data-bs-target="`#updateFileData_${doc.id}`">
                                    <Icon name="pencil" />
                                </button>
                                <button type="button" class="btn btn-danger" data-bs-toggle="modal" :data-bs-target="`#deleteSeccionModal-${seccion.id}`">
                                    <Icon name="x" />
                                </button>
                            </div>
                            <EditarDocumentoModal
>>>>>>> Version2
                                :id="`updateFileData_${doc.id}`"
                                :archivo="doc"
                                :modID="route.params.modID"
                                :secID="route.params.secID"
                                
                            ></EditarDocumentoModal>
<<<<<<< HEAD
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
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
        </div>


    </CardBody>    
    
    </Card>
=======
                        </div>
                    </div>
    
                </div>
            </div>
            <UploadFileModal
                :id="`uploadModal_${seccion.id}`"
                :seccion="{ modID:route.params.modID, secID:route.params.secID }"
            ></UploadFileModal>
        </div>
    </div>
>>>>>>> Version2

</DefaultPage>

</template>