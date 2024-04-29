<script setup>
    const props = defineProps({
        nav:{
            type:Boolean,
            required:false,
            default:true
        },
    })
</script>
<template>
<MainNavbar v-if="nav" ></MainNavbar>
<div class="container">

    <slot></slot>

</div>
</template>