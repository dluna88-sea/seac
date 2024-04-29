<script setup>
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

async function salir(){
    try{

        await signOut(auth);
        location.href="/";
        
    } catch(e){ console.log(e); }
}

salir();

</script>
<template>
    <Loading text="Cerando Sesión..." />
</template>