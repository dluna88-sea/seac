<script setup>
import { useAutoresStore } from '../../stores/autores';
import { useRoute } from 'vue-router';
let route = useRoute();
let autores = useAutoresStore();

async function datosActuales(){
    await autores.get(route.params.id)
    let divPrevisualizacion = document.querySelector(".profile-pic");
    divPrevisualizacion.style.backgroundImage = `url(${autores.autor.profilepic})`;
    
}

datosActuales();

let editarDatos = async () => {

    let imagen = document.querySelector("#profilepic").files[0];
    if(imagen == undefined){ imagen = autores.autor.profilepic; }
    let links = {};

    let email = document.querySelector("#email").value.trim();
    let fb = document.querySelector("#facebook").value.trim();
    let tw = document.querySelector("#twitter").value.trim();
    let yt = document.querySelector("#youtube").value.trim();
    let gh = document.querySelector("#github").value.trim();
    let ig = document.querySelector("#instagram").value.trim();

    if(email != ""){ 
        links = {
            ...links, 
            "email":{ 
                "icon":"envelope", 
                "link":"mailto:"+email, 
                "username":email 
            } 
        } 
    }
    if(fb != ""){ 
        let fbuser = fb.split("/")[fb.split("/").length -1]
        if(fbuser == ""){ fbuser = fb.split("/")[fb.split("/").length -2] }
        links = {
            ...links, 
            "facebook":{ 
                "icon":"facebook", 
                "link":fb,
                "username":fbuser
            } 
        } 
    }
    if(tw != ""){ 
        let twuser = tw.split("/")[tw.split("/").length -1]
        if(twuser == ""){ twuser = tw.split("/")[tw.split("/").length -2] }
        links = {
            ...links, 
            "twitter":{ 
                "icon":"twitter", 
                "link":tw,
                "username":"@" + twuser 
            } 
        } 
    }
    if(yt != ""){ 
        let ytuser = yt.split("/")[yt.split("/").length -1]
        if(ytuser == ""){ ytuser = yt.split("/")[yt.split("/").length -2] }
        links = {
            ...links, 
            "youtube":{ 
                "icon":"youtube", 
                "link":yt,
                "username":ytuser
            } 
        } 
    }
    if(ig != ""){ 
        let iguser = ig.split("/")[ig.split("/").length -1]
        if(iguser == ""){ iguser = ig.split("/")[ig.split("/").length -2] }
        links = {
            ...links, 
            "instagram":{ 
                "icon":"instagram", 
                "link":ig,
                "username":"@" + iguser 
            } 
        } 
    }
    if(gh != ""){ 
        let ghuser = gh.split("/")[gh.split("/").length -1]
        if(ghuser == ""){ ghuser = gh.split("/")[gh.split("/").length -2] }
        links = {
            ...links, 
            "github":{ 
                "icon":"github", 
                "link":gh,
                "username":ghuser
            } 
        } 
    }

    let datos = {
        nombre: document.querySelector("#nombre").value,
        biografia: document.querySelector("#biografia").value,
        imagen:imagen,
        links:links
    }

    await autores.update(route.params.id, datos)
}

function selectImage(){
    let fileInput = document.querySelector("#profilepic");
    fileInput.click()
}

function updatePreview(){
    let imagen = document.querySelector("#profilepic").files[0];
    if (imagen) {
        let divPrevisualizacion = document.querySelector(".profile-pic");
        divPrevisualizacion.style.backgroundImage = `url(${URL.createObjectURL(imagen)})`;
    }
}

let bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Publicaciones', href:'/publicaciones', class:'' },
    { text:'Autores', href:'/publicaciones/autores', class:'' },
]
</script>

<template>
    <DefaultPage>
        <PageTitle :bread="bread">
            <Icon name="person-bounding-box" /> Editar Autor
        </PageTitle>
        <div class="container" v-if="autores.message.success">
            <div class="row">
                <div class="col">
                    <Success>{{ autores.message.text }}</Success>
                </div>
            </div>
        </div>
        <Loading v-if="autores.loading"></Loading>
        <form v-else @submit.prevent="editarDatos()">
            <div class="container mb-5">
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <label>Imagen de perfil:</label>
                        <div @click="selectImage()" class="profile-pic my-3 mx-auto d-block shadow"></div>
                        <input type="file" @change="updatePreview()" name="profilepic" id="profilepic" class="d-none">
                        <label>Nombre:</label>
                        <input required autocomplete="off" :value="autores.autor.nombre" id="nombre" name="nombre" type="text" class="form-control mb-2" />
                        <label>Biografía:</label>
                        <textarea class="form-control mb-2" id="biografia" name="biografia">{{ autores.autor.biografia }}</textarea>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <label>Enlaces:</label>
                        <div class="input-group mb-3 mt-2">
                            <span class="input-group-text">
                                <Icon name="envelope-fill" />
                            </span>
                            <input v-if="autores.autor.links.email != undefined" :value="autores.autor.links.email.username" type="text" name="email" id="email" class="form-control" placeholder="Dirección de Correo Electrónico">
                            <input v-else type="text" name="email" id="email" class="form-control" placeholder="Dirección de Correo Electrónico">
                        </div>
                        <div class="input-group mb-3 mt-2">
                            <span class="input-group-text">
                                <Icon name="facebook" />
                            </span>
                            <input v-if="autores.autor.links.facebook != undefined" :value="autores.autor.links.facebook.link" type="text" name="facebook" id="facebook" class="form-control" placeholder="Enlace de Facebook">
                            <input v-else type="text" name="facebook" id="facebook" class="form-control" placeholder="Enlace de Facebook">
                        </div>
                        <div class="input-group mb-3 mt-2">
                            <span class="input-group-text">
                                <Icon name="twitter" />
                            </span>
                            <input v-if="autores.autor.links.twitter != undefined" :value="autores.autor.links.twitter.link" type="text" name="twitter" id="twitter" class="form-control" placeholder="Enlace de Twitter">
                            <input v-else type="text" name="twitter" id="twitter" class="form-control" placeholder="Enlace de Twitter">
                        </div>
                        <div class="input-group mb-3 mt-2">
                            <span class="input-group-text">
                                <Icon name="youtube" />
                            </span>
                            <input v-if="autores.autor.links.youtube != undefined" :value="autores.autor.links.youtube.link" type="text" name="youtube" id="youtube" class="form-control" placeholder="Enlace de YouTube">
                            <input v-else type="text" name="youtube" id="youtube" class="form-control" placeholder="Enlace de YouTube">
                        </div>
                        <div class="input-group mb-3 mt-2">
                            <span class="input-group-text">
                                <Icon name="instagram" />
                            </span>
                            <input v-if="autores.autor.links.instagram != undefined" :value="autores.autor.links.instagram.link" type="text" name="instagram" id="instagram" class="form-control" placeholder="Enlace de Instagram">
                            <input v-else type="text" name="instagram" id="instagram" class="form-control" placeholder="Enlace de Instagram">
                        </div>
                        <div class="input-group mb-3 mt-2">
                            <span class="input-group-text">
                                <Icon name="github" />
                            </span>
                            <input v-if="autores.autor.links.github != undefined" :value="autores.autor.links.github.link" type="text" name="github" id="github" class="form-control" placeholder="Enlace de GitHub">
                            <input v-else type="text" name="github" id="github" class="form-control" placeholder="Enlace de GitHub">
                        </div>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col">
                        <button class="btn btn-secondary mt-3">Actualizar datos</button>
                    </div>
                </div>
            </div>
        </form>
    </DefaultPage>
</template>

<style scoped>
.profile-pic{
    background-image: url('https://firebasestorage.googleapis.com/v0/b/transparenciaseac.appspot.com/o/publicaciones%2Fstatic%2Fdefault_profile.jpg?alt=media&token=86c69bc1-25a3-4486-bc3b-643a62034a38&_gl=1*10j1qoz*_ga*MTE3MjQ1NzAyOC4xNjg1OTgxNDcw*_ga_CW55HF8NVT*MTY4NjY3MTAwNi4yMC4xLjE2ODY2NzIwODQuMC4wLjA.');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border:solid 4px #fff;
    border-radius: 10px;
    width: 150px;
    height: 150px;
    cursor: pointer;
}
</style>