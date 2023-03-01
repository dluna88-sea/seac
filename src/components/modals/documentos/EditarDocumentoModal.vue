<script setup>
import { useModuloStore } from '../../../stores/modulo';

    const props = defineProps({
        id:{
            type:String,
            required:true
        },
        archivo:{
            type:Object,
            required:true
        },
        modID:{
            type:String,
            required:true
        },
        secID:{
            type:String,
            required:true
        }
    });

    const updateFileData = async () => {
        const nombre = document.forms['updateFileDataForm_'+props.id]['nombre'].value.trim();
        const descripcion = document.forms['updateFileDataForm_'+props.id]['descripcion'].value.trim();
        const documento = document.forms['updateFileDataForm_'+props.id]['filepdf'].files[0]

        let nuevosDatos = {};
        
        if(nombre != props.archivo.nombre && nombre != ""){
            nuevosDatos = { ...nuevosDatos, nombre:nombre }
        }

        if(descripcion != props.archivo.descripcion && nombre != ""){
            nuevosDatos = { ...nuevosDatos, descripcion:descripcion }
        }

        if(documento != undefined){
            nuevosDatos = { ...nuevosDatos, documento:documento }
        }

        if(JSON.stringify(nuevosDatos) === "{}"){
            console.log('no hago cambios')
        }else{
            nuevosDatos = { modID:props.modID, secID:props.secID, docID:props.archivo.id, ...nuevosDatos }
            const modulos = useModuloStore();
            await modulos.updateDatosFile(nuevosDatos);
        }
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" :id="`${id}`" tabindex="-1" aria-labelledby="updateFileDataModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="updateFileDataModal">
                        <Icon name="file-earmark-text" />&nbsp; Actualizar documento
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    
                    Documento actual: <a :href="archivo.url" target="_blank" rel="noopener noreferrer">{{ archivo.nombre }}</a>
                    <hr class="my-3">
                    <form @submit.prevent="updateFileData" :name="`updateFileDataForm_${id}`">
                        <label class="mb-2" for="nombre">Nombre:</label>
                        <input required class="mb-2 form-control" type="text" name="nombre" id="nombre" :value="archivo.nombre">
                        <label class="mb-2" for="descripcion">Descripción:</label>
                        <textarea class="mb-2 form-control" type="text" name="descripcion" id="descripcion" placeholder="(Opcional)">{{ archivo.descripcion }}</textarea>
                        <label class="mb-2" for="archivo">Reemplazar archivo:</label>
                        <input type="file" class="form-control mb-3" accept="application/pdf" id="uploadFile" name="filepdf" aria-describedby="uploadFileAddon" aria-label="Upload">
                        
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="updateFileData" class="btn btn-danger">Actualizar</button>
                </div>
            </div>
        </div>
    </div>
</template>