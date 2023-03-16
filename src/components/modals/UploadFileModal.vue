<script setup>
import { useSeccionStore } from '../../stores/seccion';
const seccion = useSeccionStore();

const props = defineProps({
    seccion:{
        type:Object,
        required:true
    },
    id:{
        type:String,
        required:true
    }
});

const subirArchivo = async () => {
    const nombre = document.forms['uploadFileForm_'+props.id]['nombre'].value.trim();
    const descripcion = document.forms['uploadFileForm_'+props.id]['descripcion'].value.trim();
    const file = document.forms['uploadFileForm_'+props.id]['filepdf'].files[0];
    const datos = {
        modID:props.seccion.modID, 
        secID:props.seccion.secID, 
        descripcion:descripcion, 
        nombre:nombre 
    }
    await seccion.uploadFile(file, datos)
}

</script>

<template>
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="nuevaSeccionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="nuevaSeccionModalLabel">
                        <Icon name="paperclip" /> Subir archivo
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <form :name="`uploadFileForm_${id}`">
                        <input type="file" class="form-control mb-3" accept="application/pdf, .xlsx, .xls" id="uploadFile" name="filepdf" aria-describedby="uploadFileAddon" aria-label="Upload">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre: </label>
                            <input type="text" required class="form-control" name="nombre" placeholder="Escribe el nombre del archivo">
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción: </label>
                            <textarea type="text" class="form-control" name="descripcion" placeholder="(Opcional)"></textarea>
                        </div>   
                    </form>  
                    
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="subirArchivo">Subir archivo</button>
                </div>
            </div>
        </div>
    </div>
</template>