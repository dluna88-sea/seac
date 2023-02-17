<script setup>
import { useRoute } from 'vue-router';
import { useDataUserStore } from '../../stores/dataUser';

import { useCurrentUserStore } from '../../stores/currentUser';

import { useModulosStore } from '../../stores/modulos';
const route = useRoute();
const currentUser = useCurrentUserStore();
const modulos = useModulosStore();


async function getMod(){ 
    if(currentUser.id == null){ await currentUser.getDatos(); }
    if(currentUser.modulos.length == 0){ await currentUser.getModulos(); }

    console.log(route.params.id);

    console.log()
    
}
getMod();


// /**
//  * Acciones del módulo:
//  */
// const updateDescripcion = async() => {
//     modulos.message.place = 'descripcion';
//     const desc = document.forms['modDescripcion']['descripcion'].value.trim()
//     await modulos.update({descripcion:desc}, route.params.id);
//     // getMod();
//     setTimeout(() => { location.reload() }, 3500)
// }

// const updateNota = async() => {
//     modulos.message.place = 'nota';
//     const note = document.forms['modNota']['nota'].value.trim()
//     await modulos.update({nota:note}, route.params.id);
//     // getMod();
//     setTimeout(() => { location.reload() }, 3500)
// }


// /** 
//  * Acciones de cada sección
// */
// const updSubtitulo = async(seccion) => {
//     console.log('actualizar el subtítulo de la sección '+seccion);
// }

// const updDescripcion = async(seccion) => {
//     console.log('actualizar la descripción de la sección '+seccion);
    
// }

// const uploadFile = async(seccion) => {
//     const documento = document.forms['uplFilepdf']['filepdf'].files[0];
//     console.log(documento)
// }


</script>

<template>
    <Loading v-if="currentUser.loading"></Loading>
    <div v-else>
        
        <DefaultPage>
        <!-- <Error v-if="modulos.message.error && modulos.message.place == null">{{ modulos.message.text }}</Error>
        <Success v-if="modulos.message.success && modulos.message.place == null">{{ modulos.message.text }}</Success>

        <PageTitle>{{ dataUser.currentMode.titulo }}</PageTitle>
        
        
            <div class="row">
                <div class="col-12">
                    <p>
                        Última actualización el {{ dataUser.currentMode.actualizacion }}<br />
                    </p>
                    <br>
                </div>

                <div class="col-12">
                    <form @submit.prevent="updateDescripcion()" name="modDescripcion">
                        <div class="mb-3">
                            <Error v-if="modulos.message.error && modulos.message.place == 'descripcion'">{{ modulos.message.text }}</Error>
                            <Success v-if="modulos.message.success && modulos.message.place == 'descripcion'">{{ modulos.message.text }}</Success>
                            <div>
                                <label for="floatingTextarea">Descripción (Opcional)</label>
                                <textarea style="height:90px" class="form-control" placeholder="Escribe una descripción del módulo" name="descripcion" id="modDescripcion">{{ dataUser.currentMode.descripcion }}</textarea>
                            </div>
                            <button class="btn btn-secondary mt-3" type="submit">Actualizar descripción</button>
                        </div>
                    </form>
                </div>


                <hr>
            </div>


            <div class="row mb-5">

                <div class="col-12 my-2">
                    <nav class="navbar bg-body-tertiary px-3 mb-4 shadow-sm">
                        <span class="navbar-text">
                            SECCIONES
                        </span>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button data-bs-toggle="collapse" data-bs-target="#nuevaSeccion" aria-expanded="false" aria-controls="collapseExample" type="button" class="btn btn-secondary" style="font-size:14px">
                                <Icon name="plus-circle" />&nbsp; Agregar nueva sección
                            </button>
                        </div>
                    </nav>
                </div>


                <div class="col-12 mb-4 collapse" id="nuevaSeccion">
                    <BigCard>
                        
                        <form>
                            
                            <div class="row mb-3">
                                <label for="subtitulo" class="col-sm-3 col-form-label text-sm-end">Subtítulo</label>
                                <div class="col-sm-9">
                                    <input type="text" name="subtitulo" class="form-control" placeholder="Opcional" aria-label="Subtítulo" aria-describedby="subtitulo">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="descripcion" class="col-sm-3 col-form-label text-sm-end">Descripción</label>
                                <div class="col-sm-9">
                                    <textarea placeholder="Opcional" class="form-control" id="descripcion" name="descripcion"></textarea>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <Info>Para agregar documentos primero tienes que registrar la sección</Info>
                            </div>

                            <div class="row float-end mb-5">
                                <button type="submit" class="btn btn-secondary">Registrar</button>
                            </div>
                            
                        </form>

                    </BigCard>
                </div>


                <div class="col-12">
                    <Info v-if="!dataUser.currentMode.secciones" >
                        <div class="text-center">NO HAY SECCIONES REGISTRADAS</div>
                    </Info>
                    
                    <BigCard v-else v-for="(seccion, sIndex) in dataUser.currentMode.secciones">
                        <form>
                            
                            <div class="row mb-3">
                                <Error v-if="modulos.message.error && modulos.message.place == 'seccion'" >{{ modulos.message.text }}</Error>
                                <Success v-if="modulos.message.success && modulos.message.place == 'seccion'" >{{ modulos.message.text }}</Success>
                            </div>
                            
                            <div class="row mb-3">
                                <label for="subtitulo" class="col-sm-3 col-form-label text-sm-end">Subtítulo</label>
                                <div class="col-sm-9">
                                    <form @submit.prevent="updSubtitulo(sIndex)">
                                        <div class="mb-3">
                                            <input type="text" :value="seccion.subtitulo" name="subtitulo" class="form-control" placeholder="Opcional" aria-label="Subtítulo" aria-describedby="subtitulo">
                                            <button class="btn btn-secondary mt-2" type="submit">
                                                Actualizar Subtítulo
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                
                            </div>

                            <hr />
                            <div class="row mb-3">
                                <label for="descripcion" class="col-sm-3 col-form-label text-sm-end">Descripción</label>
                                <div class="col-sm-9">
                                    <form @submit.prevent="updDescripcion(sIndex)">
                                        <textarea placeholder="Opcional" class="form-control" id="descripcion" name="descripcion">{{ seccion.descripcion }}</textarea>
                                        <button type="submit" class="btn btn-secondary mt-2">Actualizar descripción</button>
                                    </form>
                                </div>
                            </div>

                            <hr />
                            <fieldset class="row mb-3">
                                
                                <legend class="col-form-label col-sm-3 pt-0  text-sm-end">
                                    <Icon name="paperclip" /> Documentos adjuntos:
                                </legend>

                                <div class="col-sm-9">
                                    <div class="mb-3">
                                        <form @submit.prevent="uploadFile(sIndex)" name="uplFilepdf">
                                            <input class="form-control" type="file" accept="application/pdf" name="filepdf">
                                            <button type="submit" class="btn btn-secondary mt-2">Subir archivo</button>
                                        </form>
                                    </div>
                                    
                                    <Info v-if="seccion.documentos.length == 0">No hay documentos adjuntos</Info>
                                    
                                    <ul v-else class="list-group shadow-sm" >
                                        <li v-for="(doc, dIndex) in seccion.documentos" class="list-group-item ">
                                            <a style="text-decoration: none;" :href="doc.url" target="_blank" >
                                                <Icon name="file-pdf" />
                                                <span class="mx-2">{{ doc.nombre }}</span>
                                            </a>
                                            <a class="float-end" data-bs-toggle="modal" :data-bs-target="`#deleteModal${sIndex}-${dIndex}`" style="color:red; cursor:pointer"><Icon name="x-circle-fill" /></a>
                                            <ModalDeleteFile 
                                                :id="`deleteModal${sIndex}-${dIndex}`" 
                                                :archivo="{ 
                                                    documento:dIndex, 
                                                    seccion: sIndex, 
                                                    nombre: doc.nombre, 
                                                    modulo:null 
                                                }"></ModalDeleteFile>
                                        </li>
                                    </ul>
                                </div>

                            </fieldset>
                            
                        </form>
                    </BigCard>
                </div>


                

            </div>

            <div class="row my-5">
                <div class="col-12">
                    <hr>
                    <form @submit.prevent="updateNota()" name="modNota">
                        <div class="mb-3">
                            <Error v-if="modulos.message.error && modulos.message.place == 'nota'" >{{ modulos.message.text }}</Error>
                            <Success v-if="modulos.message.success && modulos.message.place == 'nota'" >{{ modulos.message.text }}</Success>
                        </div>
                        <div class="mb-3">
                            <div>
                                <label for="notaCierre">Nota de cierre</label>
                                <textarea style="height:90px" class="form-control" placeholder="Escribe una descripción del módulo" name="nota" id="notaCierre">{{ dataUser.currentMode.nota }}</textarea>
                            </div>
                            <button class="btn btn-secondary mt-3" type="submit">Actualizar nota de cierre</button>
                        </div>
                    </form>
                </div>
            </div>
 -->

        </DefaultPage> 
    </div>

</template>