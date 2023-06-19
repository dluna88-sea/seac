<script setup>
import { useAutoresStore } from '../../../stores/autores';

    const props = defineProps({
        autID:{
            type:String,
            required:true
        },
        pubs:{
            type:Array,
            required:true
        },
        nombre:{
            type:String,
            required:true,
        },
        autores:{
            type:Array,
            required:true,
        }
    });
    const auts = useAutoresStore();

    const deleteAut = async() => {

        let acciones = ""
        if(props.pubs.length > 0){
            if(document.querySelector("#accion").value == "asignarA"){
                acciones = document.querySelector("#autoresAs").value
            }else{
                acciones = "eliminar"
            }
        }
        await auts.delete(props.autID, acciones);
    }

    function checkSelection(){
        if(document.querySelector("#accion").value == "asignarA"){
            document.querySelector("#listUsers").classList.remove("d-none");
        }else{
            document.querySelector("#listUsers").classList.add("d-none");
        }
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" id="deleteAut" tabindex="-1" aria-labelledby="deleteAutModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteAutModalLabel">
                        <Icon name="trash-fill" /> &nbsp;Eliminar Autor
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div v-if="auts.loading" class="modal-body py-4 my-4">
                    <Loading />
                </div>
                <div v-else class="modal-body">
                    <div class="text-center">
                        <h2>
                            <Icon name="exclamation-triangle-fill" /> &nbsp;¡ADVERTENCIA!<br>
                        </h2>
                        
                        <p class="py-1">
                            Estas a punto de eliminar de forma permanente a este autor
                        </p>
                            <div v-if="pubs.length > 0" class="py-1">
                                Hay <span v-if="pubs.length == 1">una publicación relacionada</span><span v-else> {{ pubs.length }} publicaciones relacionadas</span> con este autor.<br> ¿Qué deseas hacer?
                                <select name="action" @change="checkSelection()" id="accion" class="form-control">
                                    <option value="deleteAll">Eliminar todo</option>
                                    <option value="asignarA">Asignar a otro autor</option>
                                </select>
                                
                                <div id="listUsers" class="my-2 d-none">
                                    <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Asignar a:</span>
                                    <select class="form-select" id="autoresAs">
                                        <option v-for="autor in autores" :value="autor.id">{{ autor.nombre }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <div v-if="!auts.loading" class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="deleteAut" data-bs-dismiss="modal" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>