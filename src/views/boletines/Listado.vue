<script setup>
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
                <router-link to="/boletin/nuevo" class="btn btn-primary float-end">
                    <Icon name="pencil" Class="mx-2"/>Crear Boletín
                </router-link>
            </PageTitle>

            <div class="row">
                <div class="col">
                    <BigCard>
                        <h4>Boletines: </h4>
                        <hr>
                        <Info v-if="boletines.all.length == 0"></Info>
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