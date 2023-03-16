<script setup>
import { useUsuariosStore } from '../../stores/usuarios';
import { useCurrentUserStore } from '../../stores/currentUser';
import router from '../../router';
import { useRoute } from 'vue-router';
const route = useRoute();
const user = useUsuariosStore();
const currentUser = useCurrentUserStore();

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Usuarios', href:'/usuarios', class:'' }
];

async function getUsuario(){

    if(currentUser.id == null){ await currentUser.getDatos().then(() => { bread.push({ text:currentUser.nombre, href:'', class:'active' }) }); }
    if(currentUser.rol != 'admin'){
        currentUser.setError('No tienes permiso para acceder a esta página')
        router.push('/');
    }
    
    if(user.datos.valueOf.length == 0){ 
        await user.get(route.params.id);
        await user.getModulos(user.datos.modulos);
    }

}

getUsuario();
</script>
<template>
    
    <DefaultPage>

        <PageTitle :bread="bread"><Icon name="people-fill"/> &nbsp;{{ user.datos.nombre }}</PageTitle>

        <div class="row">
            <div class="col">
                <p>
                    Correo electrónico: {{ user.datos.email }}
                </p>
                <p>
                    Cargo: {{ user.datos.cargo }}
                </p>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="list-group">
                    <div v-for="mod in user.datos.modulos" class="list-group-item">
                        {{ mod }}
                    </div>
                </div>
            </div>
        </div>



    </DefaultPage>

</template>