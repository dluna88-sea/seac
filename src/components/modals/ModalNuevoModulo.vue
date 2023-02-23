<script setup>
import { useModuloStore } from '../../stores/modulo';

    const props = defineProps({
        currentUser:{
            type:Object,
            required:true
        },
    });

const crearModulo = async() => {

    const modulo = useModuloStore();

    const datos = {
        titulo: document.forms['nuevoModulo']['titulo'].value.trim(),
        descripcion: document.forms['nuevoModulo']['descripcion'].value.trim(),
        encargado: 
            {
                nombre: document.forms['nuevoModulo']['encargado'].value.trim(),
                cargo: document.forms['nuevoModulo']['cargo'].value.trim(),
            },
        nota: document.forms['nuevoModulo']['nota'].value.trim(),
        articulo: document.forms['nuevoModulo']['articulo'].value.trim(),
        fraccion: document.forms['nuevoModulo']['fraccion'].value.trim(),
    }
    
    await modulo.nuevoModulo(datos)
}
</script>

<template>
    <div class="modal fade" id="ModalNuevoModulo" aria-hidden="true" aria-labelledby="ModalNuevoModuloLabel" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            
            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="nuevaSeccionModalLabel">
                        Crear nuevo módulo
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form name="nuevoModulo" @submit.prevent="crearModulo()">
                    <div class="modal-body">
                        
                        <div class="row p-3">
                            
                            <div class="col-12 mb-3">
                                <label for="titulo" class="form-label">Título</label>
                                <input required type="text" class="form-control" placeholder="Escribe el título del módulo" name="titulo">
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="articulo" class="form-label">Título</label>
                                <input required type="number" class="form-control" value="21" placeholder="Escribe el título del módulo" name="articulo">
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="fraccion" class="form-label">Título</label>
                                <input required type="number" class="form-control" placeholder="Escribe el número de fracción" name="fraccion">
                            </div>
                            
                            <div class="col-12 mb-3">
                                <label for="descripcion" class="form-label">Descripción (opcional)</label>
                                <textarea class="form-control" name="descripcion" placeholder="Escribe una descripción"></textarea>
                            </div>
                            
                            <hr>
                            <label class="mb-3">ENCARGADO</label>
                            <div class="col-md-6 mb-3">
                                <label for="encargado" class="form-label">Nombre:</label>
                                <input type="text" class="form-control" name="encargado" placeholder="Nombre">
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label for="cargo" class="form-label">Cargo</label>
                                <input type="text" class="form-control" name="cargo" placeholder="Escribe el cargo">
                            </div>
                            
                            <hr class="mt-3">
                            
                            <div class="col-12 mb-3">
                                <label for="nota" class="form-label">Nota de cierre (opcional)</label>
                                <textarea class="form-control" name="nota" placeholder="Escribe una nota de cierre"></textarea>
                            </div>
                        </div>
    
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="submit">Crear</button>
                    </div>
                </form>


            </div>

        </div>
    </div>
</template>