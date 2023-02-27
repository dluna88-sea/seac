<script setup>
import { useUsuariosStore } from '../../stores/usuarios';
import { useCurrentUserStore } from '../../stores/currentUser';
import router from '../../router';
const usuarios = useUsuariosStore();
const currentUser = useCurrentUserStore();

async function getUsuarios(){

    if(currentUser.id == null){ await currentUser.getDatos(); }
    if(currentUser.rol != 'admin'){
        currentUser.setError('No tienes permiso para acceder a esta página')
        router.push('/');
    }
    if(usuarios.listado.length == 0){ await usuarios.getAll(); }

}

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

            <PageTitle>
                <Icon name="people-fill" /> &nbsp; Usuarios
            </PageTitle>


            <div class="row mb-3">
                <nav class="navbar bg-body-tertiary px-3">
                    <span class="navbar-text">
                        Herramientas de administrador:
                    </span>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button data-bs-toggle="modal" data-bs-target="#ModalNuevoModulo" type="button" class="btn btn-secondary">
                            <Icon name="person-plus-fill" />&nbsp; Registrar
                        </button>
                    </div>
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