<script setup>
import { usePublicacionesStore } from '../../stores/publicaciones';
import { useAutoresStore } from '../../stores/autores';
const autores = useAutoresStore();
const publicaciones = usePublicacionesStore();

async function getAllPubs(){
    await publicaciones.all();
}

getAllPubs();
const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Publicaciones', href:'', class:'active' }
]
</script>

<template>
    <DefaultPage>
        <PageTitle :bread="bread">
            <Icon name="newspaper" /> &nbsp;Publicaciones 
            <RouterLink class="btn btn-secondary mx-2" to="publicaciones/nueva">
                <Icon name="file-plus" />
            </RouterLink>
        </PageTitle>
        
        <div class="container">
            <div class="row">
                <div class="col">
                    <nav class="nav">
                        <a class="nav-link" href="publicaciones/autores"><Icon name="people-fill" Class="mx-2" />Autores</a>
                        <a class="nav-link" href="#"><Icon name="tag-fill" Class="mx-2" />Etiquetas</a>
                    </nav>
                </div>
            </div>
        </div>

        <hr>

        <div class="container">
            <div class="row g-4">
                
                <div v-for="pub in publicaciones.allPubs" class="col-12 col-md-6 col-lg-4 col-xl-3" >
                    <a :href="`publicacion/${pub.id}`" style="text-decoration:none; color:black">
                        <div class="card h-100 shadow">
                            <div :style="`height: 200px; backround-position:center; background-size: cover; background-image: url(${pub.imagen});`"></div>
                            <div class="card-body">
                                <h5 class="card-title">{{ pub.titulo }}</h5>
                                <p class="text-muted">Creado el {{ pub.fecha }}</p>
                                
                            </div>
                            <div class="card-footer">
                                <div class="d-flex align-items-center">
                                    <div class="rounded-circle" :style="`width: 35px; margin-right:10px; height: 35px; background-size:cover; background-image:url(${pub.autor.imagen})`"></div>
                                    {{ pub.autor.nombre }}
                                </div>
                            </div>
                        </div>
                    </a>
                </div>  
            </div>
        </div>
        
    </DefaultPage>
</template>