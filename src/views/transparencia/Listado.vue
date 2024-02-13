<script setup>
import { useCurrentUserStore } from '../../stores/currentUser';
import { useModuloStore } from '../../stores/modulo';
import { useModulosStore } from '../../stores/modulos';
import { useDepartamentosStore } from '../../stores/departamentos';
import ModalNuevoModulo from '../../components/modals/ModalNuevoModulo.vue';

const currentUser = useCurrentUserStore();
const dptos = useDepartamentosStore();
const modulos = useModulosStore();

async function getDatos(){
    await modulos.all();
    await dptos.getAll();
    await modulos.getArticulos();
}
getDatos();

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Transparencia', href:'', class:'active' }
];

</script>
<template>
    <DefaultPage>
        <PageTitle :bread="bread">
            <Icon name="boxes" /> &nbsp;Módulos de transparencia
            <button v-if="currentUser.rol == 'admin'" class="btn btn-secondary float-end" data-bs-toggle="modal" data-bs-target="#ModalNuevoModulo" >
                <Icon name="plus" /> Crear módulo
            </button>
        </PageTitle>
        <div v-if="currentUser.rol == 'admin'">
            <ModalNuevoModulo
                :currentUser="currentUser"
                :departamentos="dptos.all"
                :articulos="modulos.articulos"
            ></ModalNuevoModulo>
        </div>
        
        <Loading v-if="modulos.loading"></Loading>
        <div v-else >
            
            <Info v-if="modulos.listado.length == 0">No tienes módulos asignados</Info>
            <div v-else>
    
                <div class="row mb-2" v-if="modulos.art20.length > 0">
                    <div class="col" >
                        <h3>Artículo 20</h3>
                        <div class="list-group shadow-sm mb-4 mt-3">
                            <div class="list-group-item cursorHand" v-for="mod in modulos.art20" :onclick="`javascript:location.href='/transparencia/${mod.id}'`">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </div>
                        </div>
                        <hr class="my-2">
                    </div>
                </div>
                
                <div class="row mb-2" v-if="modulos.art21.length > 0">
                    <div class="col" >
                        <h3>Artículo 21</h3>
                        <div class="list-group shadow-sm mb-4 mt-3">
                            <div class="list-group-item cursorHand" v-for="mod in modulos.art21" :onclick="`javascript:location.href='/transparencia/${mod.id}'`">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </div>
                        </div>
                        <hr class="my-2">
                    </div>
                </div>
    
                <div class="row mb-2" v-if="modulos.art25.length > 0">
                    <div class="col" >
                        <h3>Artículo 25</h3>
                        <div class="list-group shadow-sm mb-4 mt-3">
                            <div class="list-group-item cursorHand" v-for="mod in modulos.art25" :onclick="`javascript:location.href='/transparencia/${mod.id}'`">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </div>
                        </div>
                        <hr class="my-2">
                    </div>
                </div>
    
                <div class="row mb-2" v-if="modulos.art70.length > 0">
                    <div class="col" >
                        <h3>Artículo 70</h3>
                        <div class="list-group shadow-sm mb-4 mt-3">
                            <div class="list-group-item cursorHand" v-for="mod in modulos.art70" :onclick="`javascript:location.href='/transparencia/${mod.id}'`">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </div>
                        </div>
                        <hr class="my-2">
                    </div>
                </div>
    
                <div class="row mb-2" v-if="modulos.artLGCG.length > 0">
                    <div class="col" >
                        <h3>Transparencia LGCG</h3>
                        <div class="list-group shadow-sm mb-4 mt-3">
                            <div class="list-group-item cursorHand" v-for="mod in modulos.artLGCG" :onclick="`javascript:location.href='/transparencia/${mod.id}'`">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </div>
                        </div>
                        <hr class="my-2">
                    </div>
                </div>
    
                <div class="row mb-2" v-if="modulos.artCPC.length > 0">
                    <div class="col" >
                        <h3>CPC</h3>
                        <div class="list-group shadow-sm mb-4 mt-3">
                            <div class="list-group-item cursorHand" v-for="mod in modulos.artCPC" :onclick="`javascript:location.href='/transparencia/${mod.id}'`">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </div>
                        </div>
                        <hr class="my-2">
                    </div>
                </div>

                <div class="row mb-2" v-if="modulos.monitoreo.length > 0">
                    <div class="col" >
                        <h3>Monitoreo Legislativo</h3>
                        <div class="list-group shadow-sm mb-4 mt-3">
                            <div class="list-group-item cursorHand" v-for="mod in modulos.monitoreo" :onclick="`javascript:location.href='/transparencia/${mod.id}'`">
                                {{ mod.fraccion }} - {{ mod.titulo }}
                            </div>
                        </div>
                        <hr class="my-2">
                    </div>
                </div>

            </div>

        </div>

    </DefaultPage>
</template>