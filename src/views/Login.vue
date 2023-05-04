<script setup>
import { ref } from 'vue';
import router from '../router';
import { useCurrentUserStore } from '../stores/currentUser';

const currentUser = useCurrentUserStore();

if(currentUser.isAuth()){
    router.push('/')
}

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
    try {
        currentUser.message.place = 'login';
        await currentUser.login(email.value, password.value);
        router.push('/')

    } catch (error) {
        console.log(error);
    }    
}

</script>
<template>

    <Loading v-if="currentUser.loading"></Loading>
    <div v-else class="container text-center mainwrapper">
        <main class="form-signin w-100 m-auto">
            <form @submit.prevent="handleSubmit" autocomplete="off">
                <img class="mb-4" src="/seac.png" width="180" height="180" alt="SEAC">
                <h1 class="h3 mb-3">Iniciar Sesión</h1>

                <div class="form-floating">
                <input v-model="email" type="email" class="form-control" id="floatingInput" placeholder="Escriba su dirección de correo electrónico">
                <label for="floatingInput"><i class="bi bi-envelope-fill"></i> &nbsp; Correo Electrónico</label>
                </div>
                <div class="form-floating">
                <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Escriba su contraseña">
                <label for="floatingPassword"><Icon name="key-fill" /> &nbsp; Contraseña</label>
                </div>

                <button class="w-100 btn btn-lg btn-primary mb-3"  type="submit">
                    <Icon name="unlock-fill"/> Acceder
                </button>

                <Loading v-if="currentUser.loading" />

                <Error v-if="currentUser.message.error && currentUser.message.place == 'login'" >{{  currentUser.message.text }}</Error>

            </form>
        </main>
    </div>


</template>

<style scoped>
.mainwrapper{
    height: calc(100vh - 60px);
    display: flex;
    font-size:14px;
}
.form-signin {
  max-width: 330px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

</style>