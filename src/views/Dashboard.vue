<script setup>
import { useCurrentUserStore } from '../stores/currentUser';
import { auth } from '../firebase';
import { useModulosStore } from '../stores/modulos';
import {usePublicacionesStore } from '../stores/publicaciones';

const currentUser = useCurrentUserStore();
const modulos = useModulosStore();
const publicaciones = usePublicacionesStore();

async function traerDatos(){
    if(currentUser.id == null){ await currentUser.getDatos(); }
    
    if(currentUser.rol == "admin"){
        modulos.all();
        await publicaciones.all();
    }
    
    if(currentUser.uid == 'IWti7Rud3AZjnCNzacrJldyKSf53'){
        await publicaciones.all();
    }else{
        modulos.all();
    }
}


traerDatos();
</script>

<template>

    <DefaultPage>
        
        <div v-if="currentUser.message.error && currentUser.message.place == null" class="row">
            <Error>
                {{ currentUser.message.text }}
            </Error>
        </div>

        <div v-if="currentUser.message.success && currentUser.message.place == null" class="row">
            <Success>
                {{ currentUser.message.text }}
            </Success>
        </div>

        <PageTitle>Bienvenido</PageTitle>
        <div class="row mb-5">

            <!-- CARD MÓDULOS DE TRANSPARENCIA -->
            <Loading v-if="currentUser.loading"></Loading>
            <div v-else v-if="currentUser.uid != 'IWti7Rud3AZjnCNzacrJldyKSf53'" class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <Loading v-if="modulos.loading"></Loading>
                    <div v-else>
                        <h2><Icon name="boxes" /> Transparencia</h2>
                        <Info v-if="modulos.listado.length == 0">No tienes módulos asignados</Info>
                        
                        <!-- Mostrar solo 5 módulos de transparencia -->
                        <ul v-else class="list-group my-3">
                            <RouterLink v-for="mod in modulos.listado.slice(0,4)" :to="`/transparencia/${mod.id}`" class="list-group-item">{{ mod.titulo }}</RouterLink>
                        </ul>

                        <RouterLink class="btn btn-outline-secondary" to="/transparencia"><Icon name="plus" />Ver más</RouterLink>
                    </div>
                        
                </BigCard> 
            </div>

            <!-- CARD BOLETINES DE PRENSA -->
            <Loading v-if="publicaciones.loading"></Loading>
            <div v-else v-if="currentUser.rol == 'admin' || currentUser.uid == 'IWti7Rud3AZjnCNzacrJldyKSf53'" class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="file-text" /> Publicaciones</h2>
                    <p>Publicaciones recientes:</p>
                    <ul class="list-group my-3">
                        <router-link class="list-group-item" v-for="pub in publicaciones.allPubs.slice(0,4)" :to="`/publicacion/${pub.id}`">
                            <Icon name="doc" /> {{ pub.titulo }}
                        </router-link>
                    </ul>
                    <hr>
                    <router-link to="/publicaciones">VER TODAS</router-link>
                </BigCard>
            </div>

            <!-- CARD PERFIL DE USUARIO -->
            <div class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="person-fill" /> Mi perfil</h2>
                    <p>Administra tu cuenta:</p>
                    <ul class="list-group list-group-flush my-3">
                        <li class="list-group-item"><Icon name="person-vcard" /> Editar datos personales</li>
                        <li class="list-group-item"><Icon name="shield-lock-fill" /> Recuperar o cambiar la contraseña</li>
                    </ul>
                    <RouterLink class="btn btn-outline-secondary" to="/perfil"><Icon name="gear-fill" /> Administrar</RouterLink>
                </BigCard>
            </div>

            <!-- ADMIN: CARD USUARIOS REGISTRADOS -->
            <!-- <div v-if="currentUser.rol == 'admin'" class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="people-fill" /> Usuarios</h2>
                    <ul class="list-group list-group-flush my-3">
                        <li class="list-group-item"><Icon name="person-check-fill" /> Administra los usuarios registrados</li>
                        <li class="list-group-item"><Icon name="person-fill-add" /> Registra nuevos usuarios</li>
                        <li class="list-group-item"><Icon name="person-fill-gear" /> Asigna o revoca nuevos roles</li>
                    </ul>
                    <RouterLink class="btn btn-outline-secondary" to="/usuarios"><Icon name="gear-fill" /> Administrar</RouterLink>
                </BigCard>
            </div> -->
            
        </div>

    </DefaultPage>
</template>

<style scoped>
.list-group-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>