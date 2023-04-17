<script setup>
import { useModuloStore } from '../../stores/modulo';

    const props = defineProps({
        archivo:{
            type:Object,
            required:true
        },
        id:{
            type:String,
            required:true
        },
        modID:{
            type:String,
            required:true
        },
        secID:{
            type:String,
            required:true
        }
    });

    const eliminarArchivo = async() => {
        const modulo = useModuloStore();
        await modulo.deleteFile( props );
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModalLabel">
                        <Icon name="trash-fill" /> &nbsp;Eliminar Archivo
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="py-1">
                        ¿Estás seguro que deseas eliminar el archivo:<br> 
                        <a target="_blank" :href="archivo.url">{{ archivo.nombre }}</a>
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="eliminarArchivo" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>