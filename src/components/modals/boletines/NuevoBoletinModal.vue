<script setup>
import { useBoletinesStore } from '../../../stores/boletines';
import { useCurrentUserStore } from '../../../stores/currentUser';
import { useAutoresStore } from '../../../stores/autores';
const autores = useAutoresStore();
const currentUser = useCurrentUserStore();
const boletin = useBoletinesStore();

const crearBoletin = async () => {
    const titulo = document.forms['nuevoBoletinForm']['titulo'].value.trim();
    const autor = document.forms['nuevoBoletinForm']['autor'].value.trim();
    if(titulo != ''){
        await boletin.crear(titulo, autor);
    }
}
async function cargarDatos(){
    await autores.getAll();
}
cargarDatos()
</script>

<template>
    <div class="modal fade" id="nuevoBoletinModal" aria-hidden="true" aria-labelledby="nuevoBoletinModalLabel" tabindex="-1">

        <div class="modal-dialog modal-dialog-centered modal-lg">

            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="nuevoBoletinModalLabel">
                        Nueva Publicación
                    </h1>
                </div>
                <div class="modal-body">
                    <Loading v-if="boletin.loading"></Loading>
                    <Error v-else-if="autores.listado.length == 0"> DEBE REGISTRAR PRIMERO UN AUTOR </Error>
                    <form v-else name="nuevoBoletinForm">
                        <div class="mb-3">
                            <label for="titulo" class="form-label">Título:</label>
                            <input type="text" class="form-control" id="titulo" placeholder="Escriba un título para la publicación">
                        </div>
                        <div class="mb-3">
                            <label for="titulo" class="form-label">Autor:</label>
                            <select class="form-control" name="autor" id="autor">
                                <option v-for="aut in autores.listado" :value="aut.id">{{ aut.nombre }}</option>
                            </select>
                        </div>
                    </form>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" @click="crearBoletin()" >Crear</button>
                </div>
            </div>

        </div>

    </div>
</template>