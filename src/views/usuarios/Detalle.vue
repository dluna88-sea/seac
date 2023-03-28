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
    await user.get(route.params.id);
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
                <br>
                    Cargo: {{ user.datos.cargo }} de {{ user.datos.departamento }}
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