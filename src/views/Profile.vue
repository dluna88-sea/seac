<script setup>
import { ref } from 'vue';
import { useAuthUserStore } from '../stores/authUser';
import { auth } from '../firebase';

const authUser = useAuthUserStore();

let displayName = ref(authUser.nombre);
let userEmail = ref(authUser.email);
let messageType = "error";
let message = "";
let showMessage = false;
let dismiss = false;

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Perfil de usuario', href:'', class:'active' }
];


const updateName = async () => {
    let nombre = displayName.value.trim()
    if (nombre === '') {
        message = 'El nombre no puede estar vacío.';
        showMessage = true;
        dismiss = true;
        return;
    }

    await authUser.updateName(nombre);
    
    message = authUser.message.text;
    authUser.message.error ? messageType = "error" : messageType = "success";
    showMessage = true;
    dismiss = true;
    
};

const updateEmail = async () => {
    let correo = userEmail.value.trim()
    if (correo === '') {
        message = 'El nombre no puede estar vacío.';
        showMessage = true;
        dismiss = true;
        return;
    }

    await authUser.updateEmail(correo);
    
    message = authUser.message.text;
    authUser.message.error ? messageType = "error" : messageType = "success";
    showMessage = true;
    dismiss = true;
    
};
</script>

<template>
    <DefaultPage :nav="false">

        <Message v-if="showMessage" :dismiss="dismiss" :type="messageType">{{ message }}</Message>

        <PageTitle :bread="bread">
            <Icon name="person-fill" /> &nbsp;Perfil de usuario
        </PageTitle>

        <Loading v-if="authUser.loading" />
        <div v-else class="mb-5">
            

            <div class="row">
                

                <div class="col">
                    <form name="updateName" @submit.prevent="updateName" >

                        <label for="displayName">Nombre: <span style="color:red">*</span></label>
                        <div class="input-group mb-3">
                            <input type="text" name="displayName" required v-model="displayName" ref="displayNameInput" class="form-control" >
                            <button 
                                class="btn btn-outline-secondary" 
                                type="submit" id="updateName">
                                Actualizar
                            </button>
                        </div>
                        
                    </form>
                </div>

            </div>

            <hr>

            <div class="row">
                <div class="col-12 my-4">

                    <div class="card" style="border-radius: 6px; border:solid 1px #ccc; background-color: rgb(237 237 237);">
                        <div class="card-header">
                            Cambiar contraseña:
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <label for="new_password">Nueva contraseña:</label>
                                    <input type="password" required class="form-control my-2" name="new_password" id="new_password">
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="password_confirm">Confirmar contraseña:</label>
                                    <input type="password" required class="form-control my-2" name="password_confirm" id="password_confirm">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <label for="password">Nueva contraseña:</label>
                                    <input type="password" required class="form-control my-2" name="password" id="password">
                                </div>
                                <div class="col-12 col-md-6">
                                    <button class="btn btn-outline-secondary float-end">Actualizar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>

    </DefaultPage>
</template>