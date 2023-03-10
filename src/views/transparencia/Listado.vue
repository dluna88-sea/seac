<script setup>
import { useCurrentUserStore } from '../../stores/currentUser';
import { useModuloStore } from '../../stores/modulo';
import ModalNuevoModulo from '../../components/modals/ModalNuevoModulo.vue';

const currentUser = useCurrentUserStore();
const modulo = useModuloStore();


async function getDatos(){
    if(currentUser.id == null){ await currentUser.getDatos(); }
    await currentUser.getModulos();
    if(modulo.modsOrd.art20.length == 0){ await modulo.getAll(); }
    if(modulo.userList.length == 0){ await modulo.getUserList(); }
    await modulo.getArticulos();
}
getDatos();

</script>
<template>
    <DefaultPage>
        <PageTitle>
            <Icon name="boxes" /> &nbsp;Módulos de transparencia
        </PageTitle>
        
        <div v-if="currentUser.rol == 'admin'" class="row mb-3">
            <nav class="navbar bg-body-tertiary px-3">
                <span class="navbar-text">
                    Herramientas de administrador:
                </span>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button data-bs-toggle="modal" data-bs-target="#ModalNuevoModulo" type="button" class="btn btn-secondary">
                        <Icon name="plus-circle" />&nbsp; Crear
                    </button>
                </div>
            </nav>
        </div>

        <div class="row mb-5">
            <div class="col" v-if="currentUser.rol == 'admin'">

                <ul  class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-mods-tab" data-bs-toggle="pill" data-bs-target="#pills-mods" type="button" role="tab" aria-controls="pills-mods" aria-selected="true">
                            Tus módulos
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-todos-tab" data-bs-toggle="pill" data-bs-target="#pills-todos" type="button" role="tab" aria-controls="pills-todos" aria-selected="false">
                            Todos los módulos
                        </button>
                    </li>
                </ul>
                <div class="tab-content container bg-light shadow p-4 mb-4" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-mods" role="tabpanel" aria-labelledby="pills-mods-tab" tabindex="0">
                        <p>Estos son los módulos en los que te han designado como encargado:</p>
                        <Info v-if="currentUser.modulos == 0">No tienes asignados módulos de transparencia.</Info>
                        <div v-else >
                            <div class="list-group shadow-sm">
                                <router-link class="list-group-item" v-for="mod in currentUser.modulos" :to="'transparencia/'+mod.fbid">
                                    {{ mod.fraccion }} - {{ mod.titulo }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="pills-todos" role="tabpanel" aria-labelledby="pills-todos-tab" tabindex="0">
                        <p>Estos son todos los módulos registrados:</p>

                        <div v-if="modulo.modsOrd.art20.length > 0">
                            <h3>Artículo 20</h3>
                            <div class="list-group mt-3 mb-4 shadow-sm">
                                <router-link v-for="mod in modulo.modsOrd.art20" class="list-group-item" :to="`/transparencia/${mod.fbid}`">
                                    {{ mod.fraccion }} - {{ mod.titulo }}
                                </router-link>
                            </div>
                            <hr>
                        </div>

                        <div v-if="modulo.modsOrd.art21.length > 0">
                            <h3>Artículo 21</h3>
                            <div class="list-group mt-3 mb-4 shadow-sm">
                                <router-link v-for="mod in modulo.modsOrd.art21" class="list-group-item" :to="`/transparencia/${mod.fbid}`">
                                    {{ mod.fraccion }} - {{ mod.titulo }}
                                </router-link>
                            </div>
                            <hr>
                        </div>

                        <div v-if="modulo.modsOrd.art25.length > 0">
                            <h3>Artículo 25</h3>
                            <div class="list-group mt-3 mb-4 shadow-sm">
                                <router-link v-for="mod in modulo.modsOrd.art25" class="list-group-item" :to="`/transparencia/${mod.fbid}`">
                                    {{ mod.fraccion }} - {{ mod.titulo }}
                                </router-link>
                            </div>
                            <hr>
                        </div>

                        <div v-if="modulo.modsOrd.art70.length > 0">
                            <h3>Artículo 70</h3>
                            <div class="list-group mt-3 mb-4 shadow-sm">
                                <router-link v-for="mod in modulo.modsOrd.art70" class="list-group-item" :to="`/transparencia/${mod.fbid}`">
                                    {{ mod.fraccion }} - {{ mod.titulo }}
                                </router-link>
                            </div>
                            <hr>
                        </div>

                        <div v-if="modulo.modsOrd.artLGCG.length > 0">
                            <h3>Transparencia LGCG</h3>
                            <div class="list-group mt-3 mb-4 shadow-sm">
                                <router-link v-for="mod in modulo.modsOrd.artLGCG" class="list-group-item" :to="`/transparencia/${mod.fbid}`">
                                    {{ mod.fraccion }} - {{ mod.titulo }}
                                </router-link>
                            </div>
                            <hr>
                        </div>

                        <div v-if="modulo.modsOrd.artCPC.length > 0">
                            <h3>CPC</h3>
                            <div class="list-group mt-3 mb-4 shadow-sm">
                                <router-link v-for="mod in modulo.modsOrd.artCPC" class="list-group-item" :to="`/transparencia/${mod.fbid}`">
                                    {{ mod.fraccion }} - {{ mod.titulo }}
                                </router-link>
                            </div>
                            <hr>
                        </div>

                        <!-- <div  class="list-group shadow-sm">
                            <router-link v-for="mod in modulo.todos" class="list-group-item" :to="`/transparencia/${mod.fbid}`">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </router-link>
                        </div> -->
                    </div>
                </div>

            </div>

            <div class="col" v-else>
                <div class="bg-light p-4">
                    <p>Estos son los módulos en los que te han designado como encargado:</p>
                    
                    <Info v-if="currentUser.modIds.length == 0">No tienes asignados módulos de transparencia.</Info>
                    
                    <div v-else >
                        <div class="list-group shadow-sm">
                            <router-link class="list-group-item" v-for="mod in currentUser.modulos" :to="'transparencia/'+mod.fbid">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalNuevoModulo 
            :userList="modulo.userList" 
            :currentUser="currentUser" />

    </DefaultPage>
</template>