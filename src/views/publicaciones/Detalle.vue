<script setup>
import { useRoute } from 'vue-router';
import { usePublicacionesStore } from '../../stores/publicaciones';

let route = useRoute();
let pub = usePublicacionesStore();

async function getDetail(){
    await pub.get(route.params.id);
    
}
getDetail()
</script>

<template>
    <DefaultPage>
        <Loading v-if="pub.loading"></Loading>
        <div v-else class="container py-3 mb-5" >
            <div class="row">
                <div class="col">
                    <div class="btn-group">
                        <a href="/publicaciones" class="btn btn-secondary">
                            <Icon name="chevron-left" />
                        </a>
                        <a style="background-color:#8f979d !important" :href="`${pub.singlePub.id}/editar/`" class="btn btn-secondary">
                            <Icon name="pencil"/><small style="margin-left: 5px;">Editar</small>
                        </a>
                    </div>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col">
                    <h3>{{ pub.singlePub.titulo }}</h3>
                    <p>
                        {{ pub.singlePub.excerpt }}
                    </p>
                    <div class="imagenDestacada picshadow" :style="`background-image: url(${pub.singlePub.imagen});`"></div>
                    <hr>
                    <p class="fechaPublicacion">{{ pub.singlePub.publicada }}</p>
                    <a style="text-decoration:none; color:black" :href="`/publicaciones/autor/${pub.singlePub.autor.id}`" class="d-flex align-items-center mb-3">
                        <div class="rounded-circle" :style="`width: 35px; margin-right:10px; height: 35px; background-size:cover; background-image:url(${pub.singlePub.autor.imagen})`"></div>
                        {{ pub.singlePub.autor.nombre }}
                        <br>
                    </a>
                    <hr>
                </div>
            </div>
            <div class="row">
                <div id="vueEditor" class="col" v-html="pub.singlePub.contenido"></div>
            </div>
            
            <div class="row">
                <div class="col">
                    <hr>
                    Etiquetas: <span v-for="tag in pub.singlePub.etiquetas" class="badge text-bg-primary mx-1">{{ tag }}</span>
                    <hr>
                </div>
            </div>
        </div>
    </DefaultPage>
</template>
<style scoped>

.picshadow{
    box-shadow: 0px -8px 35px -15px rgba(0,0,0,0.34);
}
.fechaPublicacion{
    text-transform: uppercase;
    font-size: 12px;

}
.imagenDestacada{
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    max-width: 900px;
    max-height: 600px;
    height: 500px;
    border-radius: 10px;
    border:solid 5px #fff;
    outline:solid 2px #ffffff34;
    outline-offset: -25px;
}
@media (max-width:767px){
    .imagenDestacada{
        height: 300px;
        max-height: 300px;
    }
}
</style>