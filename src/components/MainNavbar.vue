<script setup>
import router from '../router';
import { useAuthUserStore } from '../stores/authUser';
const authUser = useAuthUserStore();

const checkData = async () => { 
    await authUser.datos();
}
checkData();

</script>

<template>
    <Loading v-if="authUser.loading"></Loading>
    <nav v-else class="navbar navbar-expand-lg bg-body-tertiary mb-3 shadow-sm">
        <div class="container">
            <RouterLink class="navbar-brand" to="/" >
                <img src="/seac-icon.png" alt="SEAC" width="25" height="25" class="d-inline-block align-text-top">
                SEAC
            </RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <!-- <li class="nav-item">
                        <RouterLink class="nav-link" to="/transparencia">Transparencia</RouterLink>
                    </li>
                    <li v-if="currentUser.rol == 'admin'" class="nav-item">
                        <RouterLink class="nav-link" to="/publicaciones">Publicaciones</RouterLink>
                    </li>
                    <li v-if="currentUser.rol=='admin'" class="nav-item">
                        <RouterLink class="nav-link" to="/usuarios">Usuarios</RouterLink>
                    </li> -->
                </ul>
                <ul class="navbar-nav flex-wrap ms-md-auto">
                    <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <Icon name="person-circle" /> &nbsp;{{ authUser.nombre }}
                            </a>
                            <ul class="dropdown-menu">
                                <li><RouterLink class="dropdown-item" to="/perfil">Perfil de usuario</RouterLink></li>
                                <!-- <li><RouterLink class="dropdown-item" to="/ayuda">Ayuda</RouterLink></li> -->
                            </ul>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/logout">Cerrar Sesión</RouterLink>
                        </li>
                </ul>
            </div>
        </div>
    </nav>

</template>

<style scoped>
@media only screen and (min-width: 992px) {
  .navbar .navbar-nav .nav-item .nav-link {
    padding: 0 0.5em;
  }
  .navbar .navbar-nav .nav-item:not(:last-child) .nav-link {
    border-right: 1px solid #0000006e;
  }
}
</style>