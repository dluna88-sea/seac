<script setup>
import { useModuloStore } from '../../../stores/modulo';

    const props = defineProps({
        id:{
            type:String,
            required:true
        },
        archivo:{
            type:Object,
            required:true
        }
    });

    
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" :id="`${id}`" tabindex="-1" aria-labelledby="updateFileDataModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="updateFileDataModal">
                        <Icon name="file-earmark-text" />&nbsp; Actualizar documento
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    
                    Documento actual: <a :href="archivo.url" target="_blank" rel="noopener noreferrer">{{ archivo.nombre }}</a>
                    <hr class="my-3">
                    <form name="updateFileDataForm">
                        <label for="nombre">Nombre:</label>
                        <input type="text" name="nombre" id="nombre" class="form-control" :value="archivo.nombre">
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger">Actualizar</button>
                </div>
            </div>
        </div>
    </div>
</template>