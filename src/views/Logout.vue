<script setup>
import router from '../router'
import { useCurrentUserStore } from '../stores/currentUser';
const currentUser = useCurrentUserStore();

async function salir(){
    try{

        if(currentUser.id != undefined){
            await currentUser.logout();
            setTimeout(() => { location.href="/" },2000)
        }else{
            location.href='/';
        }

    } catch(e){ console.log(e); }
}

salir();

</script>
<template>
    <Loading />
</template>