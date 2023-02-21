<script setup>
import { useCurrentUserStore } from '../../stores/currentUser';
import { useModuloStore } from '../../stores/modulo';
import ModalNuevoModulo from '../../components/modals/ModalNuevoModulo.vue';

const currentUser = useCurrentUserStore();
const modulo = useModuloStore();

async function getDatos(){
    if(currentUser.id == null){ await currentUser.getDatos(); }
    currentUser.getModulos();
}
getDatos();

</script>
<template>
    <DefaultPage>
        <PageTitle>
            <Icon name="boxes" /> &nbsp;Módulos de transparencia
        </PageTitle>
        
        <div v-if="currentUser.rol == 'admin'" class="row mb-3">
            <nav class="navbar bg-body-tertiary px-3">
                <span class="navbar-text">
                    Herramientas de administrador:
                </span>
                <div class="btn-group" role="group" aria-label="Basic example">
                    
                    <button type="button" class="btn btn-primary"><Icon name="list" />&nbsp; Ver todos</button>
                    <button data-bs-toggle="modal" data-bs-target="#ModalNuevoModulo" type="button" class="btn btn-secondary">
                        <Icon name="plus-circle" />&nbsp; Crear
                    </button>
                </div>
            </nav>
        </div>

        <div class="row">
            <div class="col">
                <BigCard>
                    <p>Estos son los módulos en los que te han designado como encargado:</p>
                    <Info v-if="currentUser.modulos == 0">No tienes asignados módulos de transparencia.</Info>
                    <ul v-else class="list-group list-group-flush shadow-sm" v-for="mod in currentUser.modulos">
                        <router-link style="text-decoration:none" :to="`/transparencia/${mod.fbid}`">
                            <li class="list-group-item">{{ mod.titulo }}</li>
                        </router-link>
                    </ul>
                </BigCard>
            </div>
        </div>

        <ModalNuevoModulo :currentUser="currentUser" />

    </DefaultPage>
</template>