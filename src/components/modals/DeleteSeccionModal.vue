<script setup>
import { useModuloStore } from '../../stores/modulo';

    const props = defineProps({
        id:{
            type:String,
            required:true
        },
        modID:{
            type:String,
            required:true
        },
        subtitulo:{
            type:String,
            required:true
        }
    });

    const eliminarSeccion = async() => {
        const modulo = useModuloStore();
        await modulo.deleteSeccion(props.id, props.modID)
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" :id="`deleteSeccionModal-${id}`" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModalLabel">
                        <Icon name="trash-fill" /> &nbsp;Eliminar Sección
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="py-1">
                        ¿Estás seguro que deseas eliminar la sección {{ subtitulo }}?
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="eliminarSeccion" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>