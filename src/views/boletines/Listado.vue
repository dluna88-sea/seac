<script setup>
import NuevoBoletinModal from '../../components/modals/boletines/NuevoBoletinModal.vue';
import {useBoletinesStore} from '../../stores/boletines';
import { useAutoresStore } from '../../stores/autores';
import { useRoute } from "vue-router";

const route = useRoute();
const boletines = useBoletinesStore();

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'', class:'active' }
]

async function getBoletines(start = 0){
    
}

getBoletines();
</script>

<template>
    
    <DefaultPage>

        <Loading v-if="boletines.loading"></Loading>
        <div v-else>

            <PageTitle :bread="bread">
                <Icon name="file-earmark-richtext" Class="mx-2" />Boletines

                <div class="btn-group float-end">
                    <RouterLink to="/boletines/autores" class="btn btn-secondary">
                        <Icon name="people" Class="mx-2"/>Autores
                    </RouterLink>
                    <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#nuevoBoletinModal">
                        <Icon name="pencil" Class="mx-2"/>Crear Boletín
                    </a>
                    
                </div>
                
            </PageTitle>
            <NuevoBoletinModal></NuevoBoletinModal>

            <div class="row">
                <Info v-if="boletines.pageList.length == 0">No hay publicaciones creadas</Info>
                <div class="container" v-else>
                    <div class="row mb-3">
                        <div v-for="pub,i in boletines.pageList" class="col-sm-6 col-xs-12 col-md-4 col-lg-3 mb-4">
                            <router-link :to="`/boletin/${pub.id}`" style="text-decoration:none">
                                <div class="card shadow h-100">
                                    <img class="card-img-top" :src="pub.imagen" alt="Card image cap">
                                    <div class="card-body">
                                        <h5>{{ pub.titulo }}</h5>
                                    </div>
                                    <div class="card-footer text-muted">
                                        Autor: {{ pub.nombreAutor }} <br>
                                        Creado el {{ pub.createdAt }}
                                        Público desde el {{ new Date(pub.publishTimestamp.toDate()).toLocaleDateString() }}
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                    <div class="row mt-5">
                        <nav aria-label="Page navigation example">
                            <ul class="pagination justify-content-center">
                                <li class="page-item disabled">
                                <a class="page-link">Previous</a>
                                </li>
                                <li class="page-item">
                                <a class="page-link" @click="" href="#">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

        </div>

    </DefaultPage>
    
</template>