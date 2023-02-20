<script setup>
import { useCurrentUserStore } from '../stores/currentUser';
const currentUser = useCurrentUserStore();
async function traerDatos(){
    if(currentUser.id == null){ await currentUser.getDatos(); }
    if(currentUser.modulos.length == 0){ await currentUser.getModulos(); }
    
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
            <div class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <Loading v-if="currentUser.loading"></Loading>
                    <div v-else>
                        <h2><Icon name="boxes" /> Transparencia</h2>
                        <Info v-if="currentUser.modulos.length == 0">No tienes módulos asignados</Info>
                        
                        <!-- Mostrar solo 5 módulos de transparencia -->
                        <ul v-else class="list-group my-3">
                            <RouterLink v-for="mod in currentUser.modulos.slice(0,4)" :to="`/transparencia/${mod.fbid}`" class="list-group-item">{{ mod.titulo }}</RouterLink>
                        </ul>

                        <RouterLink class="btn btn-outline-secondary" to="/transparencia"><Icon name="plus" />Ver más</RouterLink>
                    </div>
                        
                </BigCard> 
            </div>

            <!-- CARD BOLETINES DE PRENSA -->
            <div class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="file-text" /> Boletines</h2>
                    <p>Publica un nuevo boletín o administra los existentes.</p>
                    <div class="btn-group d-flex" role="group">
                        <button class="btn btn-outline-secondary" type="button"><Icon name="pencil" /> Crear nuevo</button>
                        <button class="btn btn-outline-secondary" type="button"><Icon name="files" /> Ver todos</button>
                    </div>
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
            <div v-if="currentUser.rol == 'admin'" class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="people-fill" /> Usuarios</h2>
                    <ul class="list-group list-group-flush my-3">
                        <li class="list-group-item"><Icon name="person-check-fill" /> Administra los usuarios registrados</li>
                        <li class="list-group-item"><Icon name="person-fill-add" /> Registra nuevos usuarios</li>
                        <li class="list-group-item"><Icon name="person-fill-gear" /> Asigna o revoca nuevos roles</li>
                    </ul>
                    <RouterLink class="btn btn-outline-secondary" to="/usuarios"><Icon name="gear-fill" /> Administrar</RouterLink>
                </BigCard>
            </div>
            
        </div>

    </DefaultPage>
</template>