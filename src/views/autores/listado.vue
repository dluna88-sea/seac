<script setup>
import { useAutoresStore } from '../../stores/autores';
const autores = useAutoresStore();

async function getAllAutores(){
    await autores.getAll();
}

function eliminarUsuario(id){
    console.log("eliminar ID: "+ id);
}

getAllAutores();
const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Publicaciones', href:'/publicaciones', class:'' },
    { text:'Autores', href:'', class:'active' }
]
</script>

<template>
    <DefaultPage>
        <PageTitle :bread="bread">
            <Icon name="people" /> &nbsp;Autores <RouterLink class="btn btn-secondary mx-2" to="autores/nuevo"><Icon name="person-plus-fill" /></RouterLink>
            
        </PageTitle>

        <div class="list-group shadow">
            <router-link class="list-group-item d-flex justify-content-between align-items-center" v-for="autor in autores.all" :to="`autor/${autor.id}`" style="text-decoration: none;">
                <div class="d-flex align-items-center">
                <img :src="autor.profilepic" alt="" style="width: 45px; height: 45px" class="rounded-circle" />
                <div class="ms-3">
                    <p class="fw-bold mb-1">{{ autor.nombre }}</p>
                </div>
            </div>
            </router-link>
        </div>


    </DefaultPage>
</template>