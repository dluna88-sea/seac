<script setup>

const props = defineProps({
    bread:{
        type:Array,
        required:false,
        default:[]
    },
    subtitulo:{
        type:String,
        required:false,
    },
    subtLink:{
        type:Boolean,
        required:false,
        default:false
    },
    link:{
        type:String,
        required:false,
        default:"#"
    }
})

</script>

<template>
    <div class="mb-4 pt-3">
        <div v-if="bread.length > 0" class="row">
            <div class="col">
                <nav aria-label="breadcrumb ">
                    <ol class="breadcrumb">
                        <li v-for="item in bread" :class="`breadcrumb-item ${item.class}`">
                            <a v-if="item.class != 'active'" :href="item.href">{{ item.text }}</a>
                            <span v-else>{{ item.text }}</span>
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
        <span v-if="subtLink">
            <a :href="link" target="_blank" class="text-muted" style="text-decoration:none;">
                <Icon name="eye-fill" />
                <span class="mx-2" style="text-transform: uppercase; font-size:16px;">{{ subtitulo }}</span>
            </a>
        </span>
        <span v-else style="text-transform: uppercase; font-size:16px;">{{ subtitulo }}</span>
        <h2 class="mt-2"><slot></slot></h2>
        <hr class="mt-4"/>
    </div>
    
</template>