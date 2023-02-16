<script setup>
    const props = defineProps({
        archivo:{
            type:Object,
            required:true
        },
        id:{
            type:String,
            required:true
        }
    });

    const eliminarArchivo = () => {
        console.log(props.archivo.documento)
    }
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="my-5 py-5">
                        ¿Estás seguro que deseas eliminar el archivo {{ archivo.nombre }}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click="eliminarArchivo" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>