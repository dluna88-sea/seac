<script setup>
import { useModuloStore } from '../../stores/modulo';


    const props = defineProps({
        id:{
            type:String,
            required:true
        },
        datos:{
            type:Object,
            required:true
        },
        modID:{
            type:String,
            required:true
        }
    });

    const deletePDesc = async() => {
        const modulo = useModuloStore();
        await modulo.deleteParrafoDescMod(props.datos.orden, props.modID )
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="deleteParrafo" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteParrafo">
                        <Icon name="trash-fill" /> &nbsp;Eliminar Párrafo
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="py-1">
                        Este párrafo ya está guardado y se muestra en línea. <br>
                        ¿Realmente deseas eliminarlo? 
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="deletePDesc" data-bs-dismiss="modal" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>