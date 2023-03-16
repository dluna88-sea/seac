<script setup>
import { useDepartamentosStore } from '../../stores/departamentos';

const departamentos = useDepartamentosStore();
async function deps(){
    if( departamentos.all.length == 0 ) await departamentos.getAll();
} 
deps();

const asignarEncargado = async () => {

    const depID = document.forms['asignarEncargadoForm']['encargado'].value.trim();

    await departamentos.asignarModulo(depID, props.modID).then(() => { location.reload() });

}

const props = defineProps({
    modID:{
        type:String,
        required:true
    },
    titulo:{
        type:String,
        required:true
    },
    encargado:{
        type:String,
        required:true
    }
});

</script>

<template>
    <!-- Modal -->
    <div class="modal fade" id="asignarEncargado" tabindex="-1" aria-labelledby="asignarEncargadoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="asignarEncargadoModalLabel">
                        <Icon name="briefcase-fill" /> &nbsp;Asignar Encargado
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form name="asignarEncargadoForm" @submit.prevent="asignarEncargado()">
                    <div class="modal-body">
                        
                        <Loading v-if="departamentos.loading"></Loading>
                        <div v-else>

                            <Error v-if="departamentos.message.error && departamentos.message.place == 'modalAsignar'">{{ departamentos.message.text }}</Error>
                            <Success v-if="departamentos.message.success && departamentos.message.place == 'modalAsignar'">{{ departamentos.message.text }}</Success>

                            <div class="my-3">
                                <h4>{{ titulo }}</h4>
                                <p>Encargado Actual:</p>
                                <p class="list-group">
                                    <div class="list-group-item">{{ encargado }}</div>
                                </p>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label class="input-group-text" for="encargado">Asignar a:</label>
                                    <select class="form-control" name="encargado" id="encargado">
                                        <option v-for="dpt in departamentos.all" :value="dpt.id">{{ dpt.nombre }}</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" @click="deleteModulo" data-bs-dismiss="modal" class="btn btn-primary">Asignar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>