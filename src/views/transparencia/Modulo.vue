<script setup>
import { useRoute } from 'vue-router';
import ModalNuevaSeccion from '../../components/modals/ModalNuevaSeccion.vue';
import DeleteSeccionModal from '../../components/modals/DeleteSeccionModal.vue';
import UpdateModTituloModal from '../../components/modals/secciones/UpdateModTituloModal.vue';
import DeleteModuloModal from '../../components/modals/DeleteModuloModal.vue';
import DeletePDescripcionModal from '../../components/modals/DeletePDescripcionModal.vue';
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
    const counter = countChildrenNumber(document.querySelector('#description'));
    const parrafos = [];
    let i = 1;
    let key = "00";
    while(i <= counter){
        
        if(i<10) key = "0"+i; else key = i.toString();
        const val = document.querySelector('#descripcion-'+i).value.trim();
        console.log(val);
        if(val != ''){
            parrafos.push({ 
                orden:key, 
                valor:val
            })
        }
        i++;
    }

    //await modulo.update({descripcion:parrafos}, modulo.fbid);
    //location.reload()
}

const removePDesc = (num) => {
    const ta = document.querySelector("#descripcion-"+num.toString());
    ta.remove();
}

const createPDesc = () => {
    const div = document.querySelector('#description');
    const textarea = document.createElement('textarea');
    textarea.className = "form-control my-2";
    textarea.name = "descripcion-"+document.forms['modDescripcion']['p-counter'].value;
    textarea.id = "descripcion-"+document.forms['modDescripcion']['p-counter'].value;
    div.appendChild(textarea);
}

function countChildrenNumber(el) {
  let result = 0
  if (el.children && el.children.length > 0) {
    result = result + el.children.length;
    for (let i = 0; i < el.children.length; i++) {
      result = result + countChildrenNumber(el.children[i]);
    }
  }
  return result;
}

const updateNota = async() => {
    modulo.message.place = 'nota';
    const note = document.forms['modNota']['nota'].value.trim()
    await modulo.update({nota:note}, modulo.fbid);
    // getMod();
    location.reload()
}

const updateFecha = async() => {
    await modulo.update(null, modulo.fbid)
}


</script>

<template>
    <Loading v-if="currentUser.loading || modulo.loading"></Loading>
    <div v-else>
        
        <DefaultPage>

            <ul class="nav nav-pills mb-2 mt-3">
                <li class="nav-item">
                    <routerLink to="/transparencia" class="nav-link active" aria-current="page">
                        <Icon name="arrow-left" /> Regresar
                    </routerLink>
                </li>
            </ul>

            <Error v-if="modulo.message.error && modulo.message.place == null">{{ modulo.message.text }}</Error>
            <Success v-if="modulo.message.success && modulo.message.place == null">{{ modulo.message.text }}</Success>

            <PageTitle>
                {{ modulo.titulo }}
                <button 
                    v-if="currentUser.rol == 'admin'" 
                    class="btn btn-secondary"
                    data-bs-target="#updateTitleModal"
                    data-bs-toggle="modal"
                    >
                    <Icon name="pencil-fill" />
                </button>

                
            </PageTitle>
            
            <UpdateModTituloModal
                :tituloActual="`${modulo.titulo}`"
                :modID="route.params.id"
            ></UpdateModTituloModal>
            
            
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
                        <input type="hidden" name="p-counter" value="1">
                        <div class="mb-3">
                            <Error v-if="modulo.message.error && modulo.message.place == 'descripcion'">{{ modulo.message.text }}</Error>
                            <Success v-if="modulo.message.success && modulo.message.place == 'descripcion'">{{ modulo.message.text }}</Success>
                            <div>
                                <label class="my-3" for="floatingTextarea">Descripción (Opcional)</label>
                                <div id="description" >
                                    <div v-for="desc in modulo.descripcion">
                                        <a href="#" data-bs-toggle="modal" :data-bs-target="`#descP${parseInt(desc.orden)}`" class="badge bg-danger rounded-pill float-end"><Icon name='trash-fill' /></a>
                                        <textarea 
                                            class="form-control my-2" 
                                            :name="`descripcion-${parseInt(desc.orden)}`"
                                            :id="`descripcion-${parseInt(desc.orden)}`">{{ desc.valor }}</textarea>
                                        <DeletePDescripcionModal :id="`descP${parseInt(desc.orden)}`" :modID="route.params.id" :datos="desc"></DeletePDescripcionModal>
                                    </div>
                                </div>
                                <div class="text-center my-3" style="font-size: 28px; color:#c4c4c4">
                                    <span style="cursor:pointer" @click="createPDesc" data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar un párrafo" ><Icon name="plus-circle" /></span>
                                </div>
                            </div>
                            <button class="btn btn-secondary my-3 float-end" type="submit">Actualizar descripción</button>
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

                    <div class="list-group shadow mb-4">
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

            <div v-if="currentUser.rol == 'admin'" class="row mb-5">
                <div class="col-12 p-3">
                    <div class="card border-danger mb-3" style="border-radius:0;">
                        
                        <div class="card-body p-4 bg-danger-subtle text-danger">
                            <h5 class="card-title">ELIMINAR MÓDULO</h5>
                            <p class="card-text">ADVERTENCIA: Esta acción no puede deshacerse</p>
                            <hr>
                            <div class="float-end">
                                <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModulo">
                                    <Icon name="trash-fill" />&nbsp; Eliminar
                                </button>
                            </div>
                        </div>

                        <DeleteModuloModal :modID="route.params.id"></DeleteModuloModal>

                    </div>
                </div>
            </div>

        </DefaultPage> 
        
    </div>

</template>