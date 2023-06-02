<script setup>
import { useRoute } from 'vue-router';
import { usePublicacionesStore } from '../../stores/publicaciones';
let route = useRoute();
let publicaciones = usePublicacionesStore();

async function getDetail(){
    await publicaciones.get(route.params.id);
}
getDetail()
</script>

<template>
    <div>
        {{ publicaciones.singlePub }}
    </div>
</template>