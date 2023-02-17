<script setup>
import router from '../router'
import { useCurrentUserStore } from '../stores/currentUser';
const currentUser = useCurrentUserStore();

async function salir(){
    try{
        await currentUser.logout();
        
        setTimeout(() => { router.push('/') },2000)

    } catch(e){ console.log(e); }
}

salir();

</script>
<template>
    <Loading />
</template>