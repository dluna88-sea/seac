<script setup>
import { useCurrentUserStore } from '../../stores/currentUser';
import { useModuloStore } from '../../stores/modulo';
import { useModulosStore } from '../../stores/modulos';


const currentUser = useCurrentUserStore();
const modulo = useModuloStore();
const modulos = useModulosStore();

async function getDatos(){
    modulos.get();
    console.log(modulos.listado)
}
getDatos();

</script>
<template>
    <DefaultPage>
        <PageTitle>
            <Icon name="boxes" /> &nbsp;Módulos de transparencia
        </PageTitle>
        
        <Loading v-if="modulos.loading"></Loading>
        <div v-else class="list-group" >
            
            <div class="list-group-item" v-for="mod in modulos.listado">
                {{ mod.titulo }}
            </div>

        </div>

    </DefaultPage>
</template>