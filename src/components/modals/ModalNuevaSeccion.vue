<script setup>
import { useModuloStore } from '../../stores/modulo';
import { useRoute } from 'vue-router';
const route = useRoute();

    const props = defineProps({
        id:{
            type:String,
            required:true
        },
        modID:{
            type:String,
            required:true,
        },
    });

    const crearSeccion = async() => {
        const modulo = useModuloStore();
        const subtitulo = document.querySelector('#subtitulo').value.trim();
        const descripcion = document.querySelector('#descripcion').value.trim();
        await modulo.crearSeccion(
            { modulo:props.modID, subtitulo, descripcion }
        )
    }
</script>

<template>
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="nuevaSeccionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="nuevaSeccionModalLabel">
                        Crear nueva sección
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                        
                    <div class="mb-3">
                        <label for="subtitulo" class="form-label">Subtítulo</label>
                        <input type="text" class="form-control" id="subtitulo" placeholder="Escribe el título de la sección">
                    </div>
                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción (Opcional)</label>
                        <textarea class="form-control" id="descripcion" placeholder="Escribe una descripción"></textarea>
                    </div>
                    
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="crearSeccion">Crear</button>
                </div>
            </div>
        </div>
    </div>
</template>