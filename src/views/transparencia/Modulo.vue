<script setup>
import { useRoute } from 'vue-router';
import { useDataUserStore } from '../../stores/dataUser';
const route = useRoute();
const dataUser = useDataUserStore();

async function getMod(){
    if(dataUser.datos.length == 0){
        await dataUser.getData();
    }

    if(dataUser.modulos.length == 0){
        await dataUser.getModulos()
    }

    dataUser.currentMode = dataUser.modulos.find(o => o.id === route.params.id)
}
getMod();
</script>

<template>
    <Loading v-if="dataUser.loading"></Loading>
    <div v-else>
        <DefaultPage>
            <PageTitle>{{ dataUser.currentMode.titulo }}</PageTitle>

        </DefaultPage>
    </div>
</template>