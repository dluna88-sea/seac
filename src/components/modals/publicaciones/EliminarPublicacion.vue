<script setup>
import { usePublicacionesStore } from '../../../stores/publicaciones';

    const props = defineProps({
        pubID:{
            type:String,
            required:true
        },
        docName:{
            type:String,
            required:false,
            default:""
        }
    });

    const deletePub = async() => {
        const pubs = usePublicacionesStore()
        await pubs.delete(props.pubID, props.docName);
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" id="deletePub" tabindex="-1" aria-labelledby="deletePubModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deletePubModalLabel">
                        <Icon name="trash-fill" /> &nbsp;Eliminar Publicación
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <h2>
                        <Icon name="exclamation-triangle-fill" /> &nbsp;¡ADVERTENCIA!<br>
                    </h2>
                    <p class="py-1">
                        ¿Realmente deseas eliminar esta publicación?
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="deletePub" data-bs-dismiss="modal" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>