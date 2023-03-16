<script setup>
import { useRoute } from 'vue-router';
import ModalNuevaSeccion from '../../components/modals/ModalNuevaSeccion.vue';
import DeleteSeccionModal from '../../components/modals/DeleteSeccionModal.vue';
import UpdateModTituloModal from '../../components/modals/secciones/UpdateModTituloModal.vue';
import DeleteModuloModal from '../../components/modals/DeleteModuloModal.vue';
import DeletePDescripcionModal from '../../components/modals/DeletePDescripcionModal.vue';
import AsignarEncargado from '../../components/modals/AsignarEncargado.vue';
import { useCurrentUserStore } from '../../stores/currentUser';
import { useModuloStore } from '../../stores/modulo';
import { useDepartamentosStore } from '../../stores/departamentos';

const route = useRoute();
const currentUser = useCurrentUserStore();
const modulo = useModuloStore();
const departamentos = useDepartamentosStore();

let bread = [
    { href:"/", class:"", text:"Panel" },
    { href:"/transparencia", class:"", text:"Transparencia" },
]

async function getMod(){ 
    
    if(currentUser.id == null){ await currentUser.getDatos(); }
    await modulo.get(route.params.id);
    await departamentos.getAll();
    
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

    await modulo.update({descripcion:parrafos}, modulo.id);
    
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
    await modulo.updateFecha(modulo.id).then(getMod());
}


</script>

<template>
    <Loading v-if="currentUser.loading || modulo.loading"></Loading>
    <div v-else>
        
        <DefaultPage>


            <Error v-if="modulo.message.error && modulo.message.place == null">{{ modulo.message.text }}</Error>
            <Success v-if="modulo.message.success && modulo.message.place == null">{{ modulo.message.text }}</Success>

            <PageTitle :bread="bread">
                {{ modulo.data.titulo }}
                <button 
                    v-if="currentUser.rol == 'admin'" 
                    class="btn btn-outline-primary"
                    data-bs-target="#updateTitleModal"
                    data-bs-toggle="modal"
                    >
                    <Icon name="pencil-fill" />
                </button>

                
            </PageTitle>
            <div v-if="currentUser.rol == 'admin'">
                <UpdateModTituloModal
                    :tituloActual="`${modulo.data.titulo}`"
                    :modID="route.params.id"
                ></UpdateModTituloModal>
            </div>
            <!-- ENCARGADO -->
            <div class="row my-3">
                <div class="col">

                    <div class="list-group">
                        <div class="list-group-item bg-light">
                            <Icon name="person-fill" /> Encargado: {{ modulo.encargado }} - {{ modulo.cargo }} &nbsp;
                            <span v-if="currentUser.rol == 'admin'" class="badge text-bg-primary cursorHand" data-bs-toggle="modal" data-bs-target="#asignarEncargado"> <Icon name="pencil" /> &nbsp;Editar </span>
                        </div>
                        <div class="list-group-item bg-light">
                            <Icon name="calendar2-check" /> Última actualización: {{ modulo.data.actualizacion }} &nbsp;
                            <span class="badge text-bg-primary cursorHand" @click="updateFecha()" > <Icon name="clock" /> &nbsp;Marcar actualización</span>
                        </div>
                    </div>

                </div>
            </div>

            <div v-if="currentUser.rol == 'admin' && !modulo.loading">
            <AsignarEncargado
                :modID="route.params.id"
                :titulo="`${modulo.data.titulo}`"
                :encargado="`${modulo.encargado} ${modulo.cargo}`"
            ></AsignarEncargado>
            </div>



            <div class="row">
                
                <div class="col-12">
                    <hr>
                    <form @submit.prevent="updateDescripcion()" name="modDescripcion">
                        
                        <div class="mb-3">
                            <Error v-if="modulo.message.error && modulo.message.place == 'descripcion'">{{ modulo.message.text }}</Error>
                            <Success v-if="modulo.message.success && modulo.message.place == 'descripcion'">{{ modulo.message.text }}</Success>
                            <div>
                                <label class="my-3">Descripción (Opcional)</label>
                                <div id="description">
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
                    <hr>
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