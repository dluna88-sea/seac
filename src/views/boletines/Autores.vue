<script setup>
import { useAutoresStore } from '../../stores/autores';
const autores = useAutoresStore();
const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'/boletines', class:'' },
    { text:'Autores', href:'', class:'active' }
]

async function cargarAutores(){
    await autores.getAll();
}

cargarAutores()
</script>

<template>
    <DefaultPage>
        
        <PageTitle :bread="bread">
            <Icon name="people" Class="mx-2" />Autores
        </PageTitle>
        
        <Loading v-if="autores.loading"></Loading>
        <div v-else>
            <div class="row">
                <div class="col-md-8">
                    <div class="list-group">
                        <router-link v-for="autor in autores.listado" :to="`/boletines/autor/${autor.id}`" class="list-group-item">{{ autor.nombre }}</router-link>
                    </div>
                </div>
                <div class="col-md-4">
                    <h4>Registrar nuevo</h4><hr>
                    <form name="nuevoAutorForm">
                        <div class="mt-2">
                            <label for="nombre">Nombre:</label>
                            <input type="text" name="nombre" class="form-control mt-2">
                        </div>
                        <div class="mt-2">
                            <label for="nombre">Cargo o Título:</label>
                            <input type="text" name="cargo" class="form-control mt-2">
                        </div>
                        <div class="mt-2">
                            <label for="nombre">Resumen o biografía:</label>
                            <textarea name="cargo" class="form-control mt-2"></textarea>
                        </div>
                        <hr>
                        <div class="mt-2">
                            <label for="nombre">Enlaces:</label>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="facebook" />
                                </span>
                                <input type="text" class="form-control" placeholder="Username">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="twitter" />
                                </span>
                                <input type="text" class="form-control" placeholder="Username">
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>

    </DefaultPage>
</template>