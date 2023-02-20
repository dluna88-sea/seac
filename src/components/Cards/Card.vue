<script setup>

const props = defineProps({
    Class:{
        type:String,
        required:false
    }
});

</script>

<template>
    <div style="border-radius:0;" :class="`card shadow-sm ${Class}`"><slot></slot></div>
</template>