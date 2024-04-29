<script setup>
import { useAuthUserStore } from '../stores/authUser';
const authUser = useAuthUserStore();

</script>

<template>

    <Loading v-if="authUser.loading"></Loading>
    <DefaultPage v-else>

        <PageTitle>Bienvenido</PageTitle>
        <div class="row mb-5">
            
            Hola mundo
        </div>
        
    </DefaultPage>
</template>