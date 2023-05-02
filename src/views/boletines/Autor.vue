<script setup>
import { useAutoresStore } from '../../stores/autores';
import { useRoute } from 'vue-router';
const route = useRoute();
const autor = useAutoresStore();

async function getDatos(){
    await autor.get(route.params.id);
}

getDatos();
</script>

<template>
    <DefaultPage>

        <loading v-if="autor.loading"></loading>
        <div v-else>
            <Error v-if="autor.message.error">{{ autor.message.text }}</Error>
            
            <div class="row">
                <div class="col-sm-12 col-md-6 mt-5">
                    <Card>
                        <CardBody>
                            <div :style="`background-image: url('${autor.datos.profilepic}');`" class="profile-pic profile-pic-card"></div>
                            <h5 class="text-center mt-5">{{ autor.datos.nombre }}</h5>
                            <p class="text-center">
                                {{ autor.datos.biografia }}
                            </p>
                            <hr>
                            <p class="text-center text-sm">Enlaces</p>
                            <Info v-if="Object.keys(autor.datos.links).length == 0">
                                <div class="text-center">
                                    No hay enlaces
                                </div>
                            </Info>
                            <div v-else class="btn-group shadow-sm mb-4 d-flex">
                                <a class="btn btn-light iconRed" 
                                v-for="link in autor.datos.links" 
                                :href="link.url" 
                                target="_blank">
                                        <Icon :name="link.icon" Class="mx-3" />
                                        
                                </a>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <div class="btn-group d-flex">
                                <router-link :to="`/boletines/autor/${route.params.id}/editar`" class="btn btn-primary">
                                    <Icon Class="mx-2" name="pencil" />Editar
                                </router-link>
                                <button class="btn btn-danger">
                                    <Icon name="x" Class="mx-2" />Eliminar
                                </button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div class="col-sm-12 col-md-6 mt-5">
                    <h5>Publicaciones del autor:</h5><hr>
                    <Info v-if="autor.publicaciones.length == 0">No hay publicaciones del autor</Info>
                    <div v-else>
                        <div class="list-group">
                            <div v-for="publicacion in autor.publicaciones" class="list-group-item">
                                <h6 class="float-start">{{ publicacion.titulo }}</h6>
                                <router-link class="float-end" :to="`/boletin/${publicacion.id}`"><Icon name="eye" /> Ver</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultPage>
</template>