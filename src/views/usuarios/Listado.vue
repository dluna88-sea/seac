<script>
import { useCurrentUserStore } from '../../stores/currentUser';
import router from '../../router';
import { useUsuariosStore } from '../../stores/usuarios';

const currentUser = useCurrentUserStore();
const usuarios = useUsuariosStore();

async function cargarDatos(){
    if(currentUser.id == null){ currentUser.getDatos() }
    await usuarios.getAll();
    
}
cargarDatos();
</script>
<template>
    
    <DefaultPage>
        
        <Loading v-if="usuarios.loading"></Loading>

    </DefaultPage>

</template>