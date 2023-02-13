<script setup>
import router from '../router'
import { useDataUserStore } from '../stores/dataUser'
const dataUser = useDataUserStore();

async function salir(){
    try{
        await dataUser.logout();
        router.push('/')
    } catch(e){ console.log(e); }
}

salir();

</script>
<template>
    <Loading />
</template>