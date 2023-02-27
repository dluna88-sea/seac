<script setup>
import { useRoute } from 'vue-router';
import ModalNuevaSeccion from '../../components/modals/ModalNuevaSeccion.vue';
import DeleteSeccionModal from '../../components/modals/DeleteSeccionModal.vue';
import UploadFileModal from '../../components/modals/UploadFileModal.vue';
import { useCurrentUserStore } from '../../stores/currentUser';
import { useModuloStore } from '../../stores/modulo';
const route = useRoute();
const currentUser = useCurrentUserStore();
const modulo = useModuloStore();


async function getMod(){ 
    
    if(currentUser.id == null){ await currentUser.getDatos(); }
    await modulo.get(route.params.id);

    modulo.getLastID(route.params.id)
}
getMod();


/**
 * Acciones del módulo:
 */
const updateDescripcion = async() => {
    modulo.message.place = 'descripcion';
    const desc = document.forms['modDescripcion']['descripcion'].value.trim()
    await modulo.update({descripcion:desc}, modulo.fbid);
    //getMod();
    location.reload()
}

const updateNota = async() => {
    modulo.message.place = 'nota';
    const note = document.forms['modNota']['nota'].value.trim()
    await modulo.update({nota:note}, modulo.fbid);
    // getMod();
    location.reload()
}


/** 
 * Acciones de cada sección
*/
const updSubtitulo = async(secID, subt) => {
    const subtNuevo = document.forms['secSubtitulo_'+secID]['subtitulo'].value.trim();
    if(subtNuevo != subt){
        await modulo.updateSeccion({subtitulo:subtNuevo},modulo.fbid,secID);
        location.reload();
    }
}

const updDescripcion = async(secID, desc) => {
    const descNueva = document.forms['secDescripcion_'+secID]['descripcion'].value.trim();
    if(descNueva != desc){
        await modulo.updateSeccion({descripcion:descNueva},modulo.fbid,secID);
        location.reload();
    }
}

const uploadFile = async(secId) => {
    const documento = document.forms['uplFilepdf_'+secId]['filepdf'].files[0];
    const nombre = document.forms['uplFilepdf_'+secId]['nombre'].value.trim();
    
    if(documento != undefined){
        await modulo.uploadFile(documento,{modID:route.params.id, secID:secId}, nombre);
    }
}

const updateFecha = async() => {
    await modulo.update(null, modulo.fbid)
}

</script>

<template>
    <Loading v-if="currentUser.loading || modulo.loading"></Loading>
    <div v-else>
        
        <DefaultPage>
            <Error v-if="modulo.message.error && modulo.message.place == null">{{ modulo.message.text }}</Error>
            <Success v-if="modulo.message.success && modulo.message.place == null">{{ modulo.message.text }}</Success>

            <PageTitle>{{ modulo.titulo }}</PageTitle>
            
            
            <div class="row">
                <div class="col-12 mb-3">
                    <p>
                        <Icon name="person" />&nbsp; Encargado: {{ modulo.encargado.nombre }} - {{ modulo.encargado.cargo }}<br>
                    </p>
                    <p>
                        <Icon name='calendar' />&nbsp; Última actualización: {{ modulo.actualizacion }} <button @click="updateFecha()" class="btn btn-secondary btn-sm mb-2"> <Icon name="clock" />&nbsp; Marcar actualización</button>
                    </p>
                </div>

                <hr>
            </div>


            <div class="row">
                <div class="col-12">
                    <form @submit.prevent="updateDescripcion()" name="modDescripcion">
                        <div class="mb-3">
                            <Error v-if="modulo.message.error && modulo.message.place == 'descripcion'">{{ modulo.message.text }}</Error>
                            <Success v-if="modulo.message.success && modulo.message.place == 'descripcion'">{{ modulo.message.text }}</Success>
                            <div>
                                <label for="floatingTextarea">Descripción (Opcional)</label>
                                <textarea style="height:90px" class="form-control" placeholder="Escribe una descripción del módulo" name="descripcion" id="modDescripcion">{{ modulo.descripcion }}</textarea>
                            </div>
                            <button class="btn btn-secondary mt-3" type="submit">Actualizar descripción</button>
                        </div>
                    </form>
                </div>


                <hr>
            </div>

            <div class="row">
                <div class="col-12 my-2">
                    <nav class="navbar bg-body-tertiary px-3 mb-4 shadow-sm">
                        <span class="navbar-text">
                            SECCIONES
                        </span>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <a class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#nuevaSeccionModal" style="cursor:pointer">
                                <Icon name="plus-circle" /> Agregar Sección
                            </a>
                        </div>
                    </nav>
                </div>
            </div>

            <!-- Modal para agregar una nueva sección -->
            <ModalNuevaSeccion
                :modID="route.params.id"
                id="nuevaSeccionModal"
            >
            </ModalNuevaSeccion>

            <!-- Secciones-->
            <div class="row">
                <Info v-if="modulo.secciones.length == 0" >
                    <div class="text-center">NO HAY SECCIONES REGISTRADAS</div>
                </Info>
                <div v-else>

                    <div class="list-group shadow">
                        <div v-for="seccion in modulo.secciones" class="list-group-item d-flex justify-content-between align-items-center">
                            <router-link :to="`/transparencia/${modulo.fbid}/${seccion.id}`" style="text-decoration:none; color:black" class="col-11">
                                {{ seccion.subtitulo }}
                            </router-link>
                            <div class="col-1">
                                <a href="#" data-bs-toggle="modal" :data-bs-target="`#deleteSeccionModal-${seccion.id}`" class="badge bg-danger rounded-pill float-end"><Icon name='trash-fill' /></a>
                                <DeleteSeccionModal
                                    :id="seccion.id"
                                    :modID="route.params.id"
                                    :subtitulo="seccion.subtitulo"
                                ></DeleteSeccionModal>
                            </div>
                        </div>
                        <!-- <router-link 
                            v-for="seccion in modulo.secciones" 
                            :to="`/transparencia/${modulo.fbid}/${seccion.id}`" 
                            class="list-group-item"
                            >
                                {{ seccion.subtitulo }} 
                                
                                <span class="badge bg-primary rounded-pill">14</span>
                                 <a class="float-end" data-bs-toggle="modal" :data-bs-target="`#deleteSeccionModal-${seccion.id}`" style="color:red; z-index:100; cursor:pointer"><Icon name="x-circle-fill" /></a>
                                <DeleteSeccionModal
                                    :id="seccion.id"
                                    :modID="route.params.id"
                                    :subtitulo="seccion.subtitulo"
                                ></DeleteSeccionModal>
                        </router-link> -->
                        
                    </div>

                </div>
            </div>


            <!-- nota de cierre-->
            <div class="row mb-5">
                <div class="col-12">
                    <hr>
                    <form @submit.prevent="updateNota()" name="modNota">
                        <div class="mb-3">
                            <Error v-if="modulo.message.error && modulo.message.place == 'nota'" >{{ modulo.message.text }}</Error>
                            <Success v-if="modulo.message.success && modulo.message.place == 'nota'" >{{ modulo.message.text }}</Success>
                        </div>
                        <div class="mb-3">
                            <div>
                                <label for="notaCierre">Nota de cierre</label>
                                <textarea style="height:90px" class="form-control" placeholder="Escribe una descripción del módulo" name="nota" id="notaCierre">{{ modulo.nota }}</textarea>
                            </div>
                            <button class="btn btn-secondary mt-3" type="submit">Actualizar nota de cierre</button>
                        </div>
                    </form>
                </div>
            </div>

        </DefaultPage> 
        
    </div>

</template>