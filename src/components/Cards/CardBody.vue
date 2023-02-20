<script setup>

const props = defineProps({
    Class:{
        type:String,
        required:false
    }
});

</script>

<template>
    <div :class="`card-body ${Class}`"><slot></slot></div>
</template>