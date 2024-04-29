<script setup>
    const props = defineProps({
        type:{
            type:String,
            required:false,
            default:"error"
        },
        dismiss:{
            type:Boolean,
            required:false,
            default:false
        },
        icon:{
            type:Boolean,
            required:false,
            default:false
        },
        iconName:{
            type:String,
            required:false,
            default:""
        }
    })
</script>
<template>

    <div v-if="props.type == 'error'" style="border-radius: 0;" class="alert alert-danger alert-dismissible fade show my-2" role="alert">
        <Icon v-if="props.icon" :name="props.iconName"></Icon> &nbsp;<slot></slot>
        <button v-if="props.dismiss" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="close"></button>
    </div>

    <div v-if="props.type == 'success'" style="border-radius: 0;" class="alert alert-success alert-dismissible fade show my-2" role="alert">
        <Icon v-if="props.icon" :name="props.iconName"></Icon> &nbsp;<slot></slot>
        <button v-if="props.dismiss" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="close"></button>
    </div>

    <div v-if="props.type == 'info'" style="border-radius: 0;" class="alert alert-info alert-dismissible fade show my-2" role="alert">
        <Icon v-if="props.icon" :name="props.iconName"></Icon> &nbsp;<slot></slot>
        <button v-if="props.dismiss" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="close"></button>
    </div>
</template>