<script setup>
import { useModuloStore } from '../../stores/modulo';
import { useUsuariosStore } from '../../stores/usuarios';
const modulos = useModuloStore();
const usuarios = useUsuariosStore();
let allEx = [];

const props = defineProps({
    modID:{
        type:String,
        required:true
    },
    encargado:{
        type:Object,
        required:true
    },
    canEdit:{
        type:Array,
        required:true
    }
});

async function getUsuarios(){
    await usuarios.getFromList(props.canEdit);
    props.canEdit.forEach((uid) => { allEx.push(uid); });
    allEx.push(props.encargado.uid);
    await usuarios.getAllExcept(allEx);
}

getUsuarios();

async function asignarPermisos(){
    props.canEdit.push(document.getElementById('usuarios').value.trim());
    await modulos.update({ canEdit:props.canEdit }, props.modID);
    location.reload();
}

async function removePermisos(uid){
    let newCanEdit = [];
    props.canEdit.forEach((user) => {
        if(user != uid){
            newCanEdit.push(user)
        }
    });
    await modulos.update({ canEdit:newCanEdit}, props.modID);
    location.reload();
}

</script>

<template>
    <!-- Modal -->
    <div class="modal fade" id="asignarPermisos" tabindex="-1" aria-labelledby="asignarPermisosModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="asignarPermisosModalLabel">
                        <Icon name="person-fill-lock" /> &nbsp;Usuarios con permisos de edición
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form name="asignarPermisosForm" @submit.prevent="asignarPermisos()">
                    <div class="modal-body">
                        
                        <Loading v-if="modulos.loading || usuarios.loading"></Loading>
                        <div v-else>

                            <div class="mb-3">
                                <div v-if="usuarios.listFromArray.length == 0" class="p5 alert alert-light text-center">
                                    Solo {{ encargado.nombre }}, como encargado de este módulo, tiene permisos de edición
                                </div>
                                <div class="list-group shadow-sm">
                                    <div class="list-group-item bg-light" v-for="user in usuarios.listFromArray">
                                        {{ user.nombre }}
                                        <a href="#" class="btn btn-danger btn-sm float-end" @click="removePermisos(user.uid)"><Icon name="x" /></a>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label>Asignar permiso a:</label>
                                <select class="form-select" name="usuarios" id="usuarios">
                                    <option v-for="user in usuarios.listExcept" :value="user.uid">{{ user.nombre }}</option>
                                </select>
                            </div>

                        </div>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar permisos</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>