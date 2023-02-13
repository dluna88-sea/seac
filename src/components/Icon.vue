<script setup>
    const props = defineProps({
        name:{
            type:String,
            required:true,
            default:'code'
        }
    })
</script>

<template>
    <i :class="`bi bi-${name}`"></i>
</template>