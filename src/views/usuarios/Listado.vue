<script setup>
import { useUsuariosStore } from '../../stores/usuarios';
import ListadoDptoModal from '../../components/modals/departamentos/ListadoDptoModal.vue';
import AddDptoModal from '../../components/modals/departamentos/AddDptoModal.vue'
import { useCurrentUserStore } from '../../stores/currentUser';
import router from '../../router';
const usuarios = useUsuariosStore();

async function getUsuarios(){

    if(usuarios.listado.length == 0){ await usuarios.getAll(); }

}

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Usuarios', href:'', class:'active' }
];

getUsuarios();
</script>
<template>
    
    <DefaultPage>
        
        <Loading v-if="usuarios.loading"></Loading>

        <div v-else>

            <div v-if="usuarios.message.error" class="row">
                <Error>{{ usuarios.message.text }}</Error>
            </div>

            <div v-if="usuarios.message.success" class="row">
                <Error>{{ usuarios.message.text }}</Error>
            </div>

            <PageTitle :bread="bread">
                <Icon name="people-fill" /> &nbsp; Usuarios
            </PageTitle>


            <div class="row mb-3">
                <nav class="navbar bg-body-tertiary px-3">
                    <span class="navbar-text">
                        Herramientas de administrador:
                    </span>
                    <div class="btn-group" role="group" aria-label="Herrmaientas">
                        <RouterLink class="btn btn-light" to="/usuario/nuevo">
                            <Icon name="person-plus-fill" />&nbsp; Registrar
                        </RouterLink>
                        <a data-bs-toggle="modal" data-bs-target="#dptosListModal" class="btn btn-light" href="#"> <Icon name="list-task" />&nbsp; Departamentos </a>
                        <a data-bs-toggle="modal" data-bs-target="#dptosAddModal" class="btn btn-light" href="#"> <Icon name="plus-square" />&nbsp; Crear nuevo </a>
                        
                    </div>
                    <ListadoDptoModal :user-list="usuarios.listado"></ListadoDptoModal>
                    <AddDptoModal></AddDptoModal>
                </nav>
            </div>

            <div class="row mb-5">

                <div class="col">
                    <div class="list-group shadow-sm">
                        <router-link v-for="usuario in usuarios.listado" class="list-group-item" :to="`/usuario/${usuario.id}`">
                            {{ usuario.nombre }} - {{ usuario.email }}
                        </router-link>
                    </div>
                </div>

            </div>

        </div>

    </DefaultPage>

</template>