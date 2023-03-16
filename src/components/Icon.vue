<script setup>
    const props = defineProps({
        name:{
            type:String,
            required:true,
            default:'code'
        },
        Class:{
            type:String,
            required:false,
            default:''
        }
    })
</script>

<template>
    <i :class="`bi bi-${name} ${Class}`"></i>
</template>