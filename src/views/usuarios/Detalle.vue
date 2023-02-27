<script setup>
import { useUsuariosStore } from '../../stores/usuarios';
import { useCurrentUserStore } from '../../stores/currentUser';
import router from '../../router';
import { useRoute } from 'vue-router';
const route = useRoute();
const user = useUsuariosStore();
const currentUser = useCurrentUserStore();
async function getUsuario(){

    if(currentUser.id == null){ await currentUser.getDatos(); }
    if(currentUser.rol != 'admin'){
        currentUser.setError('No tienes permiso para acceder a esta página')
        router.push('/');
    }
    
    if(user.datos.valueOf.length == 0){ await user.get(route.params.id); }

}

getUsuario();
</script>
<template>
    
    <DefaultPage>

        <PageTitle><Icon name="people-fill"/> &nbsp;{{ user.datos.nombre }}</PageTitle>
        <div class="row">
            <div class="col">
                Correo electrónico: {{ user.datos.email }}
            </div>
        </div>

    </DefaultPage>

</template>