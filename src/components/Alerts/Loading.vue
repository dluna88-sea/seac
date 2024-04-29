<script setup>
    const props = defineProps({
        text:{
            type:String,
            required:false,
            default:'Cargando...'
        }
    })
</script>
<template>
    <div class="text-center py-3 my-2">
        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        {{ props.text }}
    </div>
</template>