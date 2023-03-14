<script setup>
import { useCurrentUserStore } from '../stores/currentUser';

const currentUser = useCurrentUserStore();

async function getDatos(){
    if(currentUser.id == null){ await currentUser.getDatos(); }
    if(currentUser.modulos.length == 0){ await currentUser.getModulos(); }
}
getDatos();

const updateNombre = async () => {
    currentUser.message.place = 'nombre';
    const name = document.forms['updateNombre']['nombre'].value.trim();
    if(name != currentUser.nombre){
        await currentUser.update({nombre:name})
        location.reload()
    }
}

const updateCargo = async () => {
    currentUser.message.place = 'cargo'
    const cargo = document.forms['updateCargo']['cargo'].value.trim();
    if(cargo != currentUser.cargo){
        await currentUser.update({cargo:cargo})
        location.reload()
    }
}

const updateEmail = async () => {
    currentUser.message.place = 'email'
    const mail = document.forms['updateEmail']['email'].value.trim();
    if(mail != currentUser.email){
        await currentUser.updateEmail({email:mail})
        location.reload()
    }
}

const updatePwd = async () => {
    currentUser.message.place = 'password'

    const pwd = document.forms['updatePwd']['password'].value.trim();
    const pwdConfirm = document.forms['updatePwd']['password2'].value.trim();
    
    await currentUser.updatePwd(pwd, pwdConfirm)
    document.forms['updatePwd']['password'].value = "";
    document.forms['updatePwd']['password2'].value = "";
    location.reload()
}

</script>

<template>
    <DefaultPage>

        <div class="row">
            <Error v-if="currentUser.message.error && currentUser.message.place == null">
                {{ currentUser.message.text }}
            </Error>
        </div>
        <div class="row">
            <Success v-if="currentUser.message.success && currentUser.message.place == null">
                {{ currentUser.message.text }}
            </Success>
        </div>

        <PageTitle>
            <Icon name="person-fill" /> &nbsp;Perfil de usuario
        </PageTitle>

        <Loading v-if="currentUser.loading" />
        <div v-else class="mb-5">
            
            <div class="row">
                <div class="col text-center py-4">
                    <h3>Actualizar datos personales</h3>
                </div>
            </div>
            <div class="row">

                <div class="col-md-6 mt-3 px-lg-5">
                    <div class="my-3">
                        <Error v-if="currentUser.message.error && currentUser.message.place == 'nombre'">
                            {{ currentUser.message.text }}
                        </Error>

                        <Success v-if="currentUser.message.success && currentUser.message.place == 'nombre'">
                            {{ currentUser.message.text }}
                        </Success>
                    </div>
                    <form @submit.prevent="updateNombre()" name="updateNombre" class="form-floating">

                        <input type="text" class="form-control shadow-sm" name="nombre" id="nombre" placeholder="Escribe tu nombre completo" :value="currentUser.nombre">
                        <label for="nombre">Nombre</label>
                        <div class="d-grid mt-2">
                            <button class="btn btn-secondary block">Actualizar</button>
                        </div>

                    </form>
                </div>
                <div class="col-md-6 mt-3 px-lg-5">
                    <div class="my-3">
                        <Error v-if="currentUser.message.error && currentUser.message.place == 'email'">
                            {{ currentUser.message.text }}
                        </Error>

                        <Success v-if="currentUser.message.success && currentUser.message.place == 'email'">
                            {{ currentUser.message.text }}
                        </Success>
                    </div>
                    <form @submit.prevent="updateEmail()" name="updateEmail" class="form-floating">


                        <input name="email" type="email" class="form-control shadow-sm" id="email" placeholder="Escribe tu dirección correo electrónico" :value="currentUser.email">
                        <label for="email">Correo electrónico</label>
                        <div class="d-grid mt-2">
                            <button class="btn btn-secondary block">Actualizar</button>
                        </div>
                    </form>
                </div>
                
                <div class="col-md-12 mt-5 px-lg-5 mb-5">
                    <Card>
                        <CardHeader>Actualizar contraseña</CardHeader>
                        <CardBody>
                            
                            <div class="my-3">
                                <Error v-if="currentUser.message.error && currentUser.message.place == 'password'">
                                    {{ currentUser.message.text }}
                                </Error>

                                <Success v-if="currentUser.message.success && currentUser.message.place == 'password'">
                                    {{ currentUser.message.text }}
                                </Success>
                            </div>
                            
                            <ul>
                                <li>La contraseña debe tener mínimo 6 caractéres y máximo 8</li>
                            </ul>
                            <form @submit.prevent="updatePwd()" name="updatePwd" class="my-3">
                                
                                <div class="form-floating mb-3">
                                    <input required type="password" class="form-control" id="password" name="password" placeholder="Escribe una contraseña">
                                    <label for="password">Contraseña</label>
                                </div>
                                <div class="form-floating">
                                    <input required type="password" class="form-control" id="password2" name="password2" placeholder="Confirma la contraseña">
                                    <label for="password2">Confirmación de contraseña</label>
                                </div>

                                <div class="d-grid mt-2">
                                    <button class="btn btn-secondary block">Actualizar</button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>

            </div>
            
            
            
            <div class="row">
                <div class="col text-center py-4">
                    <h3>Módulos de transparencia asignados:</h3>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col px-lg-5">
                    <BigCard>
                        <p>ID Único: {{ currentUser.uid }}</p>
                        <p>Módulos asignados:</p>
                        <Info v-if="currentUser.modulos.length == 0">
                            No tienes módulos de transparencia asignados
                        </Info>
                        <div v-else class="continer">
                            <ul class="list-group">
                                <li class="list-group-item" v-for="mod in currentUser.modulos">
                                    {{ mod.titulo }}
                                </li>
                            </ul>
                        </div>
                    </BigCard>
                </div>
            </div>

        </div>

    </DefaultPage>
</template>