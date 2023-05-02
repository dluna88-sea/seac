<script setup>
import { useAutoresStore } from '../../stores/autores';
const autores = useAutoresStore();
const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Boletines', href:'/boletines', class:'' },
    { text:'Autores', href:'', class:'active' }
]

async function cargarAutores(){
    await autores.getAll();
}

async function registrarAutor(){
    const nombre = document.forms['nuevoAutorForm']['nombre'].value.trim();
    const bio = document.forms['nuevoAutorForm']['bio'].value.trim();
    const mail = document.forms['nuevoAutorForm']['mail'].value.trim();
    const web = document.forms['nuevoAutorForm']['web'].value.trim();
    const tw = document.forms['nuevoAutorForm']['tw'].value.trim();
    const fb = document.forms['nuevoAutorForm']['fb'].value.trim();
    const gh = document.forms['nuevoAutorForm']['gh'].value.trim();
    const li = document.forms['nuevoAutorForm']['li'].value.trim();
    const ig = document.forms['nuevoAutorForm']['ig'].value.trim();
    const tt = document.forms['nuevoAutorForm']['tt'].value.trim();

    let links = [];

    if(mail != ""){ links.push({ nombre:"Email", url:"mailto:"+mail, icon:"envelope-fill" }) }
    if(web != ""){ links.push({ nombre:'website', url:web, icon:"globe" }) }
    if(tw != ""){ links.push({ nombre:'twitter', url:tw, icon:"twitter" }) }
    if(fb != ""){ links.push({ nombre:'facebook', url:fb, icon:"facebook" }) }
    if(gh != ""){ links.push({ nombre:'github', url:gh, icon:"github" }) }
    if(li != ""){ links.push({ nombre:'linkedin', url:li, icon:"linkedin" }) }
    if(ig != ""){ links.push({ nombre:'instagram', url:ig, icon:"instagram" }) }
    if(tt != ""){ links.push({ nombre:'tiktok', url:tt, icon:"tiktok" }) }

    let pic = document.forms['nuevoAutorForm']['pic'].files[0];
    if(!pic){ pic = '/default-profile.jpg'; }
    const datos = {
        nombre:nombre,
        biografia:bio,
        profilepic:pic,
        links:links
    }

    if(nombre == ""){ autores.setError("Especifique el nombre del autor") }
    else{
        await autores.nuevo(datos).then(async() => { autores.getAll() });
    }
}

function abrirUploader(){
    document.forms['nuevoAutorForm']['pic'].click();
}

function previewImage(){
    const maximumSize = 10 * 1024 * 1024;
    const file = document.forms['nuevoAutorForm']['pic'].files[0];

    if(file){
        if(file.size > maximumSize){
            autores.message.text = "Archivo demasiado grante. Elige una imagen menor a 10MB"
            autores.message.error = true;
            setTimeout(() => { autores.message.error = false; autores.message.text = ""; }, 6000);
            //autores.setError('Archivo demasiado grande. Elige una imagen menor a 10MB')
            clearProfilePic()    
        }else{
            document.getElementById('imagePreview').setAttribute('style','background-image:url('+URL.createObjectURL(file)+')');
        }
    }
}
function clearProfilePic(){
    document.forms['nuevoAutorForm']['pic'].value = "";
    document.getElementById('imagePreview').setAttribute('style',"background-image:url('/default-profile.jpg')");
}

cargarAutores()
</script>

<template>
    <DefaultPage>
        
        <PageTitle :bread="bread">
            <Icon name="people-fill" Class="mx-2" />Autores
        </PageTitle>
        
        <Loading v-if="autores.loading"></Loading>
        <div class="mb-5" v-else>
            <div class="row mb-5">
                <div class="col-md-7 mb-5">
                    <Info v-if="autores.listado.length == 0">No hay autores registrados</Info>
                    <div v-else class="list-group shadow-sm">
                        
                        <router-link v-for="autor in autores.listado" :to="`/boletines/autor/${autor.id}`" class="list-group-item">
                            {{ autor.nombre }} 
                        </router-link>
                        
                    </div>
                </div>
                <div class="col-md-5">
                    <h4>Registrar nuevo</h4><hr>
                    <Error v-if="autores.message.error">{{ autores.message.text }}</Error>
                    <Success v-if="autores.message.success">{{ autores.message.text }}</Success>
                    <form @submit.prevent="registrarAutor()" name="nuevoAutorForm">
                        
                        <div class="mt-2">
                            <label for="pic">Foto de perfil:</label>
                            <div class="text-center mt-3">
                                <div class="position-relative d-inline-flex">
                                    <div @click="abrirUploader()" id="imagePreview" class="profile-pic" >
                                    </div>
                                    <span @click="clearProfilePic()" class="position-absolute cursorHand top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        <Icon name="x"/> Eliminar
                                    </span>
                                </div>
                            </div>
                            <input @change="previewImage()" type="file" class="form-control mt-2 d-none" accept="image/*" name="pic" id="pic">
                        </div>
                        <div class="mt-2">
                            <label for="nombre"><span style="color:red">*</span> Nombre:</label>
                            <input required autocomplete="off" type="text" name="nombre" class="form-control mt-2">
                        </div>
                        <div class="mt-2">
                            <label for="bio">Resumen o biografía:</label>
                            <textarea autocomplete="off" name="bio" class="form-control mt-2"></textarea>
                        </div>
                        <hr>
                        <div class="mt-2">
                            <label>Enlaces:</label><br>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="envelope" />
                                </span>
                                <input type="text" class="form-control" name="mail" placeholder="Dirección de correo electrónico">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="globe" />
                                </span>
                                <input type="text" class="form-control" name="web" placeholder="Pega el enlace del sitio web">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="twitter" />
                                </span>
                                <input type="text" class="form-control" name="tw" placeholder="Pega el enlace de twitter">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="facebook" />
                                </span>
                                <input type="text" class="form-control" name="fb" placeholder="Pega el enlace de facebook">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="github" />
                                </span>
                                <input type="text" class="form-control" name="gh" placeholder="Pega el enlace de github">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="linkedin" />
                                </span>
                                <input type="text" class="form-control" name="li" placeholder="Pega el enlace de linkedin">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="instagram" />
                                </span>
                                <input type="text" class="form-control" name="ig" placeholder="Pega el enlace de instagram">
                            </div>
                            <div class="input-group mt-2">
                                <span class="input-group-text">
                                    <Icon name="tiktok" />
                                </span>
                                <input type="text" class="form-control" name="tt" placeholder="Pega el enlace de tiktok">
                            </div>
                        </div>
                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary mt-3">Registrar</button>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>

    </DefaultPage>
</template>