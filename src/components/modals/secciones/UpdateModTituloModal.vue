<script setup>
import { useModuloStore } from '../../../stores/modulo';

    const props = defineProps({
        modID:{
            type:String,
            required:true
        },
        tituloActual:{
            type:String,
            required:true
        }
    });

    const updateTitulo = async() => {
        const modulo = useModuloStore();
        const tit = document.forms['nuevoTitulo']['titulo'].value.trim();
        if(tit != props.tituloActual && tit != ""){
            const valores = { titulo: tit }
            await modulo.update(valores, props.modID).then(location.reload())
        }
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" id="updateTitleModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModalLabel">
                        Actualizar el título
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <p class="py-1">
                        <form name="nuevoTitulo" @submit.prevent="updateTitulo">
                            <input class="form-control" type="text" name="titulo" id="titulo" :value="tituloActual">
                        </form>
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="updateTitulo" class="btn btn-danger">Actualizar</button>
                </div>
            </div>
        </div>
    </div>
</template>