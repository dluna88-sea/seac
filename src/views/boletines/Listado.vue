<script setup>
import NuevoBoletinModal from '../../components/modals/boletines/NuevoBoletinModal.vue';
import {useBoletinesStore} from '../../stores/boletines';
const boletines = useBoletinesStore();

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'', class:'active' }
]

async function getBoletines(){
    await boletines.getAll();
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
                    <RouterLink to="boletines/autores" class="btn btn-secondary">
                        <Icon name="people" Class="mx-2"/>Autores
                    </RouterLink>
                    <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#nuevoBoletinModal">
                        <Icon name="pencil" Class="mx-2"/>Crear Boletín
                    </a>
                    
                </div>
                
            </PageTitle>
            <NuevoBoletinModal></NuevoBoletinModal>

            <div class="row">
                <div class="col">
                    <BigCard>
                        <Info v-if="boletines.all.length == 0">No hay publicaciones creadas</Info>
                        <div v-else class="list-group">
                            <router-link class="list-group-item" v-for="b in boletines.all" :to="`/boletin/${b.id}`" >
                            {{ b.titulo }} - Autor: {{ b.autor }}
                            </router-link>
                        </div>
                    </BigCard>
                </div>
            </div>

        </div>

    </DefaultPage>
    
</template>