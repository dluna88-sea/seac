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
    
    const parrafos = [];
    
    const np = countChildrenNumber(document.querySelector('#description'));
    let i = 1;
    let id = "00";
    let orden = 1;

    while(i<=np){
        if(i<10){ id = "0"+i.toString(); } else { id = i.toString(); }
        //const txta = document.forms["modDescripcion"]["descripcion-"+i].value;
        const txta = document.forms['modDescripcion']["descripcion-"+id].value;
        if(txta.trim() != ""){
            let or = "";
            if(orden < 10){ or = "0"+orden.toString() }else{ or = orden.toString(); }
            parrafos.push({
                orden: or,
                valor: txta.trim()
            })
            orden++;
        }
        i++;
    }

    await modulo.update({descripcion:parrafos}, modulo.fbid);
    location.reload()
}

const createPDesc = () => {
    const ndiv = document.createElement("div");
    
    const nid = countChildrenNumber(document.querySelector("#description"))+1;
    let id = "0"
    if(nid < 10) id = "0"+nid.toString(); else id = nid;
    
    const delbtn = document.createElement("a");
    delbtn.setAttribute("href","#");
    delbtn.setAttribute("class","badge bg-danger rounded-pill float-end");
    delbtn.setAttribute("onclick", "javascript:document.querySelector('#divDescP-"+parseInt(id)+"').remove()" );
    
    const icon = document.createElement("i");
    icon.setAttribute("class","bi bi-x-lg");

    delbtn.appendChild(icon);
    
    ndiv.setAttribute("id","divDescP-"+parseInt(id));
    ndiv.appendChild(delbtn);
    
    const textarea = document.createElement("textarea");
    textarea.setAttribute("class", "form-control my-2");
    textarea.setAttribute("name", "descripcion-"+id);
    textarea.setAttribute("id", "descripcion-"+id);

    ndiv.appendChild(textarea);

    document.querySelector("#description").appendChild(ndiv)
}

function countChildrenNumber(el) {
  let result = 0
  if (el.children && el.children.length > 0) {
    result = result + el.children.length;
    // for (let i = 0; i < el.children.length; i++) {
    //   result = result + countChildrenNumber(el.children[i]);
    // }
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
                        
                        <div class="mb-3">
                            <Error v-if="modulo.message.error && modulo.message.place == 'descripcion'">{{ modulo.message.text }}</Error>
                            <Success v-if="modulo.message.success && modulo.message.place == 'descripcion'">{{ modulo.message.text }}</Success>
                            <div>
                                <label class="my-3">Descripción (Opcional)</label>
                                <div id="description" >
                                    <div v-for="desc in modulo.descripcion">
                                        <a href="#" data-bs-toggle="modal" :data-bs-target="`#descP-${desc.orden}`" class="badge bg-danger rounded-pill float-end"><Icon name='x-lg' /></a>
                                        <textarea 
                                            class="form-control my-2" 
                                            :name="`descripcion-${desc.orden}`"
                                            :id="`descripcion-${desc.orden}`">{{ desc.valor }}</textarea>
                                        <DeletePDescripcionModal :id="`descP-${desc.orden}`" :modID="route.params.id" :datos="desc"></DeletePDescripcionModal>
                                    </div>
                                </div>
                                <div class="text-center my-3" style="font-size: 35px; color:#c4c4c4">
                                    <span style="cursor:pointer" @click="createPDesc" data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar un párrafo" ><Icon name="plus-circle" /></span>
                                </div>
                            </div>
                            <button class="btn btn-secondary my-3 float-center" type="submit">Actualizar descripción</button>
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