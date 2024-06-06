<script setup>
import { auth } from '../firebase.js'
import { signOut } from 'firebase/auth';

async function salir(){
    try{
        await signOut(auth)
        location.href='/';
    } catch(e){ console.log(e); }
}

salir();

</script>
<template>
    <Loading />
</template>