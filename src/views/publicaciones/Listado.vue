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
        </PageTitle>
        
        <div class="container">
            <div class="row">
                <div class="col">
                    <nav class="nav">
                        <a class="nav-link" href="publicacion/nueva"><Icon name="file-plus" Class="mx-2" />Nueva</a>
                        <a class="nav-link" href="publicaciones/autores"><Icon name="people-fill" Class="mx-2" />Autores</a>
                        <!-- <a class="nav-link" href="#"><Icon name="tag-fill" Class="mx-2" />Etiquetas</a> -->
                    </nav>
                </div>
            </div>
        </div>

        <hr>

        <div v-if="publicaciones.allPubs.length == 0" class="container mb-5 pt-5 mt-5">
            <h1 style="color:#00000028" class="text-center">NO HAY PUBLICACIONES</h1>
        </div>

        <div v-else class="container mb-5">
            <div class="row g-4">
                
                <div v-for="pub in publicaciones.allPubs" class="col-12 col-md-6 col-lg-4 col-xl-3" >
                    <a :href="`publicacion/${pub.id}`" style="text-decoration:none; color:black">
                        <div class="card h-100 shadow">
                            <div class="card-imageprofile" :style="`background-image: url(${pub.imagen});`">
                                <div class="float-end" style="font-size:15px; padding:5px 5px 0 0">
                                    <span v-if="pub.status == 0" style="font-weight: 400; border:solid 1px #ffffff49;" class="badge text-bg-success"><Icon name="globe-americas" /> Público</span>
                                    <span v-if="pub.status == 1" style="font-weight: 400; border:solid 1px #ffffff49;" class="badge text-bg-danger"><Icon name="eraser" /> Borrador</span>
                                </div>
                            </div>
                            <div class="card-body">
                                
                                <h5 class="card-title">{{ pub.titulo }}</h5>
                                <!-- <div style="font-size:12px">Creado el {{ pub.fecha }}</div> -->
                                <div v-if="pub.programada" style="font-size:12px">Programada al {{ pub.publicarEn }}</div>
                                <div v-else style="font-size:12px">Publicado el {{ pub.publicarEn }}</div>
                                
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

<style scoped>
.card-imageprofile{
    height: 200px; 
    background-position:center; 
    background-size: cover;
    border-radius: 5px 5px 0 0;
}
@media(min-width:992px){
    .card-imageprofile{
        height: 150px;
    }
}
</style>