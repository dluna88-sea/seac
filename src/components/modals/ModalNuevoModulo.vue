<script setup>
import { useModuloStore } from '../../stores/modulo';

    const props = defineProps({
        currentUser:{
            type:Object,
            required:true
        },
        departamentos:{
            type:Array,
            required:true
        },
        articulos:{
            type:Array,
            required:true
        }
    });
const modulo = useModuloStore();

const crearModulo = async() => {

    let nombre = "";
    let cargo = "";

    if(document.forms['nuevoModulo']['encargado'].value.trim().split("|",-1)[1] != undefined) cargo = document.forms['nuevoModulo']['encargado'].value.trim().split("|",-1)[1];
    if(document.forms['nuevoModulo']['encargado'].value.trim().split("|",-1)[0] != undefined) nombre = document.forms['nuevoModulo']['encargado'].value.trim().split("|",-1)[0];

    const datos = {
        titulo: document.forms['nuevoModulo']['titulo'].value.trim(),
        descripcion: document.forms['nuevoModulo']['descripcion'].value.trim(),
        encargado: nombre,
        nota: document.forms['nuevoModulo']['nota'].value.trim(),
        articulo: document.forms['nuevoModulo']['articulo'].value.trim(),
        fraccion: document.forms['nuevoModulo']['fraccion'].value.trim(),
    }

    await modulo.nuevoModulo(datos);
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
                            <Loading v-if="modulo.loading"></Loading>
                            <Error v-if="modulo.message.error">{{ modulo.message.text }}</Error>
                            <Success v-if="modulo.message.success">{{ modulo.message.text }}</Success>

                            <div class="col-12 mb-3">
                                <label for="titulo" class="form-label">Título</label>
                                <input required type="text" class="form-control" placeholder="Escribe el título del módulo" name="titulo">
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="articulo" class="form-label">Artículo</label>
                                <select  required name="articulo" class="form-control" id="articulo">
                                    <option v-for="a in articulos" :value="a.id">{{ a.titulo }}</option>
                                </select>
                                
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="fraccion" class="form-label">Fracción</label>
                                <input required type="number" class="form-control" placeholder="Escribe el número de fracción" name="fraccion">
                            </div>
                            
                            <div class="col-12 mb-3">
                                <label for="descripcion" class="form-label">Descripción (opcional)</label>
                                <textarea class="form-control" name="descripcion" placeholder="Escribe una descripción"></textarea>
                            </div>
                            
                            <hr>
                            <label class="mb-3">ENCARGADO</label>
                            <div class="col-md-12 mb-3">
                                <label for="encargado" class="form-label">El titular del departamento:</label>
                                <select class="form-control" name="encargado" id="encargado">
                                    <option v-for="dpto in departamentos" :value="dpto.id">{{dpto.nombre}}</option>
                                </select>
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