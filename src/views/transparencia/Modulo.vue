<script setup>
import { useRoute } from 'vue-router';
import ModalNuevaSeccion from '../../components/modals/ModalNuevaSeccion.vue';
import { useCurrentUserStore } from '../../stores/currentUser';
import { useModuloStore } from '../../stores/modulo';
const route = useRoute();
const currentUser = useCurrentUserStore();
const modulo = useModuloStore();


async function getMod(){ 
    
    if(currentUser.id == null){ await currentUser.getDatos(); }
    await modulo.get(route.params.id);

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
    if(documento != undefined){
        await modulo.uploadFile(documento,{modID:modulo.fbid, secID:secId});
    }
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
                <div class="col-12">
                    <p>
                        Última actualización el {{ modulo.actualizacion }}<br />
                    </p>
                    <br>
                </div>
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

                    <Card Class="mb-5" v-for="seccion in modulo.secciones">
                        <CardHeader>
                            <div class="row">
                                <label for="subtitulo" class="col-sm-3 col-form-label text-sm-end">Subtítulo</label>
                                <div class="col-sm-9">
                                    <form :name="`secSubtitulo_${seccion.id}`" @submit.prevent="updSubtitulo(seccion.id,seccion.subtitulo)" class="row row-cols-auto g-3">
                                        <div class="col-xl-10 col-lg-8 col-md-7 col-sm-7 col-xs-12">
                                            <input type="hidden" name="idSeccion" :value="seccion.id">
                                            <input type="text" class="form-control" name="subtitulo" :value="seccion.subtitulo">
                                        </div>
                                        <div class="col-xl-2 col-lg-4 col-md-5 col-sm-5 col-xs-12">
                                            <button class="btn btn-secondary" type="submit">Editar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody Class="p-4">

                            <div class="row mb-3">
                                <label for="descripcion" class="col-sm-3 col-form-label text-sm-end">Descripción</label>
                                <div class="col-sm-9">
                                    <form :name="`secDescripcion_${seccion.id}`" @submit.prevent="updDescripcion(seccion.id,seccion.descripcion)">
                                        <textarea placeholder="Opcional" class="form-control" id="descripcion" name="descripcion">{{ seccion.descripcion }}</textarea>
                                        <button type="submit" class="btn btn-secondary mt-2">Actualizar descripción</button>
                                    </form>
                                </div>
                            </div>

                            <hr>

                            <fieldset class="row mb-3">
                                
                                <legend class="col-form-label col-sm-3 pt-0  text-sm-end">
                                    <Icon name="paperclip" /> Documentos adjuntos:
                                </legend>

                                <div class="col-sm-9">
                                    <div class="mb-3">
                                        <form :name="`uplFilepdf_${seccion.id}`" @submit.prevent="uploadFile(seccion.id)">
                                            <input class="form-control" type="file" accept="application/pdf" name="filepdf">
                                            <button type="submit" class="btn btn-secondary mt-2">Subir archivo</button>
                                        </form>
                                    </div>
                                    
                                    <Info v-if="seccion.documentos.length == 0">No hay documentos adjuntos</Info>
                                    
                                    <ul v-else class="list-group shadow-sm" >
                                        <li v-for="(doc) in seccion.documentos" class="list-group-item ">
                                            <a style="text-decoration: none;" :href="doc.url" target="_blank" >
                                                <Icon name="file-pdf" />
                                                <span class="mx-2">{{ doc.nombre }}</span>
                                            </a>
                                            <a class="float-end" data-bs-toggle="modal" :data-bs-target="`#deleteModal${seccion.id}-${doc.id}`" style="color:red; cursor:pointer"><Icon name="x-circle-fill" /></a>
                                            <ModalDeleteFile 
                                                :id="`deleteModal${seccion.id}-${doc.id}`"
                                                :archivo="{  
                                                    docID: doc.id,
                                                    seccion: seccion.id, 
                                                    nombre: doc.nombre, 
                                                    modulo:modulo.fbid,
                                                    url: doc.url 
                                                }"></ModalDeleteFile>
                                        </li>
                                    </ul>
                                </div>

                            </fieldset>

                        </CardBody>    
                        
                    </Card>

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