<script setup>

    import { useUsuariosStore } from '../../stores/usuarios';
    const usuarios = useUsuariosStore();

    const registrarUsuario = async () => {

        const datos = {
            nombre: document.forms['nuevoUsuarioForm']['nombre'].value.trim(),
            cargo: document.forms['nuevoUsuarioForm']['cargo'].value.trim(),
            email: document.forms['nuevoUsuarioForm']['email'].value.trim(),
            rol: document.forms['nuevoUsuarioForm']['rol'].value.trim(),
            modulos:[],
        }

        const pwd = document.forms['nuevoUsuarioForm']['password'].value.trim();
        const pwd2 = document.forms['nuevoUsuarioForm']['password_confirm'].value.trim();

        if(pwd != '' && pwd == pwd2){
            
            await usuarios.registrar(datos, pwd).then(() => { 
                //setTimeout(() => {location.href = '/usuarios'; },2000);
            }).catch((e) => { console.log(e.message) })

        }else{
            usuarios.setError('Las contraseñas no coinciden');
        }
        
    }
</script>

<template>
    <DefaultPage>

        <PageTitle>
            <Icon name="person-plus-fill" /> &nbsp;Registrar Usuario
        </PageTitle>

        <Loading v-if="usuarios.loading"></Loading>
        <div v-else class="container">
            <div class="row">
                <div class="col-12 bg-light shadow p-4">
                    
                    <form @submit.prevent="registrarUsuario" name="nuevoUsuarioForm">
                        <div class="row">
                            <div class="col-md-6 my-2">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input required type="text" class="form-control" placeholder="Indica el nombre del usuario" name="nombre">
                            </div>
                            <div class="col-md-6 my-2">
                                <label for="cargo" class="form-label">Cargo:</label>
                                <input required type="text" class="form-control" placeholder="Indica el cargo" name="cargo">
                            </div>
                            <div class="col-md-8 my-2">
                                <label for="email" class="form-label">Correo Electrónico:</label>
                                <input required type="email" class="form-control" placeholder="Dirección de correo electrónico" name="email">
                            </div>
                            <div class="col-md-4 my-2">
                                <label for="rol" class="form-label">Tipo de usuario:</label>
                                <select name="rol" class="form-control" id="rol">
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div class="col-md-6 my-2">
                                <label for="password" class="form-label">Contraseña:</label>
                                <input required type="password" class="form-control" placeholder="Indica una contraseña" name="password">
                            </div>
                            <div class="col-md-6 my-2">
                                <label for="password_confirm" class="form-label">Contraseña:</label>
                                <input required type="password" class="form-control" placeholder="Escribe nuevamente la contraseña" name="password_confirm">
                            </div>


                            <!-- <div class="col-12 my-3">
                                <a class="btn btn-primary" data-bs-toggle="collapse" href="#asignarModulos" role="button" aria-expanded="false" aria-controls="collapseExample">
                                    Link with href
                                </a>
                                <div class="collapse" id="asignarModulos">
                                    <div class="card card-body">
                                        Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
                                    </div>
                                </div>
                            </div> -->
                            
                            <div v-if="usuarios.message.error" class="col-12 my-4">
                                <Error>{{ usuarios.message.text }}</Error>
                            </div>

                            <div v-if="usuarios.message.success" class="col-12 my-4">
                                <Success>{{ usuarios.message.text }}</Success>
                            </div>

                            <div class="col-12 my-4">
                                <button type="submit" class="btn btn-secondary float-end">
                                    <Icon name="person-check-fill" /> &nbsp;Registrar
                                </button>
                            </div>
                        </div>
                    </form>
    
                </div>
            </div>
        </div>


    </DefaultPage>
</template>