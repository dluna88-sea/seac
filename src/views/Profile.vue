<script setup>
import { useDataUserStore } from '../stores/dataUser';

const dataUser = useDataUserStore();
async function getDatos(){
    if(dataUser.datos.length == 0){ 
        await dataUser.getData();
    }
    if(dataUser.modulos.length == 0){
        await dataUser.getModulos();
    }
}
getDatos();

const updateNombre = async () => {
    const name = document.forms['updateNombre']['nombre'].value.trim();
    if(name != dataUser.datos.nombre){
        await dataUser.update({nombre:name})
    }
}

const updateCargo = async () => {
    const cargo = document.forms['updateCargo']['cargo'].value.trim();
    if(cargo != dataUser.datos.cargo){
        await dataUser.update({cargo:cargo})
    }
}

const updateEmail = async () => {
    const mail = document.forms['updateEmail']['email'].value.trim();
    if(mail != dataUser.datos.email){
        await dataUser.updateEmail({email:mail})
    }
}

const updatePwd = async () => {
    const pwd = document.forms['updatePwd']['password'].value.trim();
    const pwdConfirm = document.forms['updatePwd']['password2'].value.trim();
    
    await dataUser.updatePwd(pwd, pwdConfirm)
    document.forms['updatePwd']['password'].value = "";
    document.forms['updatePwd']['password2'].value = "";
}

</script>

<template>
    <DefaultPage>

        <div class="row"><Error v-if="dataUser.isError">{{ dataUser.error }}</Error></div>
        <div class="row"><Success v-if="dataUser.success">{{ dataUser.successMsg }}</Success></div>

        <PageTitle>
            <Icon name="person-fill" /> &nbsp;Perfil de usuario
        </PageTitle>

        <Loading v-if="dataUser.loading" />
        <div v-else class="mb-5">
            
            <div class="row">
                <div class="col px-lg-5">
                    <BigCard>
                        <p>ID Único: {{ dataUser.datos.uid }}</p>
                        <p>Módulos asignados:</p>
                        <Info v-if="dataUser.modulos.length == 0">
                            No tienes módulos de transparencia asignados
                        </Info>
                        <div v-else class="continer">
                            <ul class="list-group">
                                <li class="list-group-item" v-for="mod in dataUser.modulos">
                                    {{ mod.titulo }}
                                </li>
                            </ul>
                        </div>
                    </BigCard>
                </div>
            </div>
            <hr/>
            <div class="row">
                <div class="col text-center py-4">
                    <h3>Actualizar datos personales</h3>
                </div>
            </div>
            <div class="row">

                <div class="col-md-6 mt-3 px-lg-5">
                    <form @submit.prevent="updateNombre()" name="updateNombre" class="form-floating">
                        <input type="text" class="form-control shadow-sm" name="nombre" id="nombre" placeholder="Escribe tu nombre completo" :value="dataUser.datos.nombre">
                        <label for="nombre">Nombre</label>
                        <div class="d-grid mt-2">
                            <button class="btn btn-secondary block">Actualizar</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-6 mt-3 px-lg-5">
                    <form @submit.prevent="updateEmail()" name="updateEmail" class="form-floating">
                        <input name="email" type="email" class="form-control shadow-sm" id="email" placeholder="Escribe tu dirección correo electrónico" :value="dataUser.datos.email">
                        <label for="email">Correo electrónico</label>
                        <div class="d-grid mt-2">
                            <button class="btn btn-secondary block">Actualizar</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-6 mt-3 px-lg-5">
                    <form @submit.prevent="updateCargo()" name="updateCargo" class="form-floating">
                        <input type="text" class="form-control shadow-sm" name="cargo" id="cargo" placeholder="Escribe el nombre del cargo" :value="dataUser.datos.cargo">
                        <label for="cargo">Cargo</label>
                        <div class="d-grid mt-2">
                            <button class="btn btn-secondary block">Actualizar</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-12 mt-3 px-lg-5 mb-5">
                    <Card>
                        <CardHeader>Actualizar contraseña</CardHeader>
                        <CardBody>
                            <Error v-if="dataUser.passwordError">{{ dataUser.passwordErrMsg }}</Error>
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

        </div>

    </DefaultPage>
</template>