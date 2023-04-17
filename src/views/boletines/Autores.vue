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
            <Icon name="people-fill" Class="mx-2" />Autores
        </PageTitle>
        
        <Loading v-if="autores.loading"></Loading>
        <div class="mb-5" v-else>
            <div class="row mb-5">
                <div class="col-md-7 mb-5">
                    <Info v-if="autores.listado.length == 0">No hay autores registrados</Info>
                    <div v-else class="list-group shadow-sm">
                        <router-link v-for="autor in autores.listado" :to="`/boletines/autor/${autor.id}`" class="list-group-item">{{ autor.nombre }}</router-link>
                    </div>
                </div>
                <div class="col-md-5">
                    <h4>Registrar nuevo</h4><hr>
                    <form name="nuevoAutorForm">
                        <div class="mt-2">
                            <label for="nombre">Nombre:</label>
                            <input autocomplete="off" type="text" name="nombre" class="form-control mt-2">
                        </div>
                        <div class="mt-2">
                            <label for="nombre">Resumen o biografía:</label>
                            <textarea autocomplete="off" name="cargo" class="form-control mt-2"></textarea>
                        </div>
                        <hr>
                        <div class="mt-2">
                            <label>Enlaces:</label><br>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="envelope" />
                                </span>
                                <input type="text" class="form-control" placeholder="Dirección de correo electrónico">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="globe" />
                                </span>
                                <input type="text" class="form-control" placeholder="Pega el enlace del sitio web">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="twitter" />
                                </span>
                                <input type="text" class="form-control" placeholder="Pega el enlace de twitter">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="facebook" />
                                </span>
                                <input type="text" class="form-control" placeholder="Pega el enlace de facebook">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="github" />
                                </span>
                                <input type="text" class="form-control" placeholder="Pega el enlace de github">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="linkedin" />
                                </span>
                                <input type="text" class="form-control" placeholder="Pega el enlace de linkedin">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="instagram" />
                                </span>
                                <input type="text" class="form-control" placeholder="Pega el enlace de instagram">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="tiktok" />
                                </span>
                                <input type="text" class="form-control" placeholder="Pega el enlace de tiktok">
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>

    </DefaultPage>
</template>