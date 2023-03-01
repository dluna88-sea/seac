<script setup>
import { useModuloStore } from '../../../stores/modulo';

    const props = defineProps({
        id:{
            type:String,
            required:true
        }
    });

    const updateFileData = async() => {
        // const modulo = useModuloStore();
        // const tit = document.forms['nuevoTitulo']['titulo'].value.trim();
        // if(tit != props.tituloActual && tit != ""){
        //     const valores = { titulo: tit }
        //     await modulo.update(valores, props.modID)
        // }
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModalLabel">
                        <Icon name="file-earmark-text" />&nbsp; Actualizar documento
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <p class="py-1">
                        <form name="nuevoTitulo" @submit.prevent="updateFileData">
                            <label for="archivo">Reemplazar archvio:</label>
                            <input class="form-control" type="file" name="archivo" id="archivo" >
                        </form>
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="updateFileData" class="btn btn-danger">Actualizar</button>
                </div>
            </div>
        </div>
    </div>
</template>