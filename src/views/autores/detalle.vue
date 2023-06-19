<script setup>
import { useAutoresStore } from '../../stores/autores';
import { useRoute } from 'vue-router';
import EliminarAutor from '../../components/modals/autores/EliminarAutor.vue';

const route = useRoute();
const autores = useAutoresStore();

async function getDetails(){
    await autores.get(route.params.id);
    await autores.getPubsFrom(route.params.id);
    await autores.getExcept(route.params.id);
}

getDetails();

</script>

<template>
    <DefaultPage>
        <Loading v-if="autores.loading" ></Loading>
        <div v-else>

            <div class="container">

                <div v-if="autores.notFound" class="row">
                    <div class="col text-center">
                        <div class="cuatro04">404</div>
                        <h3>No se encontró el autor solicitado.</h3>
                        <hr>
                        <p><button class="btn btn-secondary">
                            <Icon name="chevron-left" Class="mx-2" /> Regresar
                        </button></p>
                    </div>
                </div>

                <div v-else>

                    <div class="row">
                        <div class="col">
                            <div class="btn-group">
                                <a href="/publicaciones/autores" class="btn btn-secondary">
                                    <Icon name="chevron-left" />
                                </a>
                                <a style="background-color:#8f979d !important" :href="`${route.params.id}/editar/`" class="btn btn-secondary">
                                    <Icon name="pencil"/><small style="margin-left: 5px;">Editar</small>
                                </a>
                                <a href="#" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteAut">
                                    <Icon name="x" /><small style="margin-left:5px">Eliminar</small>
                                </a>
                            </div>
                            <EliminarAutor :autores="autores.allBut" :pubs="autores.myPubs" :nombre="autores.autor.nombre" :autID="route.params.id"></EliminarAutor>
                        </div>
                    </div>
                    <hr>

                    <div class="row">
                        <div class="col">
                            <div class="d-flex justify-content-center">
                                <div :style="`background-image:url(${autores.autor.profilepic})`" class="profilePic shadow my-4"></div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col text-center">
                            <h1>{{ autores.autor.nombre }}</h1>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-10 col-md-7 col-lg-5 mx-auto text-center">
                            <p>{{ autores.autor.biografia }}</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col text-center">
                            
                            <a v-for="link in autores.autor.links" target="_blank" :href="link.link" class="socialLink">
                                <Icon :name="link.icon" />
                            </a>
                        </div>
                    </div>

                    <hr>

                    <div v-if="autores.myPubs.length == 0">
                        <div class="row my-5">
                            <div class="col  text-center text-uppercase">
                                <h3 style="color:#d1d1d1">No hay publicaciones de {{ autores.autor.nombre }}</h3>
                            </div>
                        </div>
                    </div>
                    <div v-else>

                        <div class="row">
                            <div v-if="autores.myPubs.length > 1" class="col">
                                Hay {{ autores.myPubs.length }} publicaciones de {{ autores.autor.nombre }} 
                            </div>
                            <div v-else class="col">
                                Hay 1 publicacion de {{ autores.autor.nombre }} 
                            </div>
                        </div>

                        

                        <div class="row g-4 mt-2 mb-5">
                            <div v-for="pub in autores.myPubs" class="col-12 col-md-6 col-lg-4 col-xl-3" >
                                <a :href="`/publicacion/${pub.id}`" style="text-decoration:none; color:black">
                                    <div class="card h-100 shadow">
                                        <div class="card-imageprofile" :style="`background-image: url(${pub.imagen});`"></div>
                                        <div class="card-body">
                                            <h5 class="card-title">{{ pub.titulo }}</h5>
                                            <p class="text-muted">Creado el {{ pub.createdAt.toDate().toDateString() }}</p>
                                            
                                        </div>
                                    </div>
                                </a>
                            </div>  
                        </div>


                    </div>

                </div>

            </div>

        </div>
    </DefaultPage>
</template>

<style scoped>
.cuatro04{
    font-size:150px; 
    font-family: 'Poppins', sans-serif; 
    font-weight: bolder; 
    color:#A4A4A4;
}
.profilePic{
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border:solid 5px #fff;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
.socialLink{
    margin:0 5px;
    padding:3px;
    font-size:30px;
    text-decoration: none;
    color:#363636
}

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