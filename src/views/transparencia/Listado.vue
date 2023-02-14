<script setup>
import { useDataUserStore } from '../../stores/dataUser';
import { useModulosStore } from '../../stores/modulos';

const modulos = useModulosStore();
const dataUser = useDataUserStore();

async function getDatos(){
    if(dataUser.datos.length == 0){ 
        await dataUser.getData();
    }

    if(dataUser.modulos.length == 0){
        await dataUser.getModulos();
    }
}
getDatos();

</script>
<template>
    <DefaultPage>
        <PageTitle>
            <Icon name="boxes" /> &nbsp;Módulos de transparencia
        </PageTitle>
        
        <div v-if="dataUser.datos.rol == 'admin'" class="row mb-3">
            <nav class="navbar bg-body-tertiary px-3">
                <span class="navbar-text">
                    Herramientas de administrador:
                </span>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-primary">Left</button>
                    <button type="button" class="btn btn-primary">Middle</button>
                    <button type="button" class="btn btn-primary">Right</button>
                </div>
            </nav>
        </div>

        <div class="row">
            <div class="col">
                <BigCard>
                    <p>Estos son los módulos en los que te han designado como encargado:</p>
                    <ul class="list-group list-group-flush shadow-sm" v-for="mod in dataUser.modulos">
                        <router-link style="text-decoration:none" :to="`/transparencia/${mod.id}`">
                            <li class="list-group-item">{{ mod.titulo }}</li>
                        </router-link>
                    </ul>
                </BigCard>
            </div>
        </div>

    </DefaultPage>
</template>