<script setup>
import { useModuloStore } from '../../stores/modulo';
import router from '../../router'

    const props = defineProps({
        modID:{
            type:String,
            required:true
        }
    });

    const deleteModulo = async() => {
        const modulo = useModuloStore();
        await modulo.deleteModulo(props.modID).then(() => {
            router.push('/transparencia')
        });
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" id="deleteModulo" tabindex="-1" aria-labelledby="deleteModuloModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModuloModalLabel">
                        <Icon name="trash-fill" /> &nbsp;Eliminar Módulo
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <h2>
                        <Icon name="exclamation-triangle-fill" /> &nbsp;¡ADVERTENCIA!<br>
                    </h2>
                    <p class="py-1">
                        ¿Realmente deseas eliminar este módulo?
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="deleteModulo" data-bs-dismiss="modal" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>