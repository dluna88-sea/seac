import { createRouter, createWebHistory } from 'vue-router';
import { useCurrentUserStore } from './stores/currentUser';
import { auth, db } from './firebase'

const isAuth = async(to, from, next) => {
    const currentUser = useCurrentUserStore();
    await currentUser.isAuth().then((user) => {
        if(user) next();
        else next('/login');
    })
}

const isAdmin = async(to, from, next) => {
    const currentUser = useCurrentUserStore();
    await currentUser.isAuth().then(async() => {
        await currentUser.getRol(auth.currentUser.uid).then(() => {
            if(currentUser.rol == 'admin') next();
            else next('/');
        });
    });
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path:'/', name: 'Dashboard', component: () => import('./views/Dashboard.vue'), beforeEnter: isAuth},
        { path:'/login', name: 'Login', component: () => import('./views/Login.vue')},
        { path:'/logout', name: 'Logout', component: () => import('./views/Logout.vue')},
        { path:'/transparencia', name: 'Transparencia', component: () => import('./views/transparencia/Listado.vue'), beforeEnter:isAuth },
        { path:'/transparencia/:id', name: 'Modulo', component: () => import('./views/transparencia/Modulo.vue'), beforeEnter:isAuth },
        { path:'/transparencia/:modID/:secID', name: 'Seccion', component: () => import('./views/transparencia/Seccion.vue'), beforeEnter:isAuth },
        { path:'/perfil/', name: 'Perfil', component: () => import('./views/Profile.vue'), beforeEnter:isAuth },
        { path:'/ayuda', name: 'Ayuda', component: () => import('./views/Ayuda.vue'), beforeEnter:isAuth },
        { path:'/usuarios', name: 'Usuarios', component: () => import('./views/usuarios/Listado.vue'), beforeEnter:isAdmin },
        { path:'/usuario/:id', name: 'DetalleUsuario', component: () => import('./views/usuarios/Detalle.vue'), beforeEnter:isAdmin },
        { path:'/usuario/nuevo', name: 'NuevoUsuario', component: () => import('./views/usuarios/NuevoUsuario.vue'), beforeEnter:isAdmin },
        { path:'/publicaciones', name: 'publicaciones', component: () => import('./views/publicaciones/Listado.vue'), beforeEnter:isAdmin },
        { path:'/publicacion/:id', name: 'DetallePublicacion', component: () => import('./views/publicaciones/Detalle.vue'), beforeEnter:isAdmin },
        { path:'/publicacion/nueva', name: 'NuevoPublicacion', component: () => import('./views/publicaciones/Nuevo.vue'), beforeEnter:isAdmin },
        { path:'/publicacion/:id/editar', name: 'EditarPublicacion', component: () => import('./views/publicaciones/Editar.vue'), beforeEnter:isAdmin },
        { path:'/publicaciones/autores', name: 'ListadoAutores', component: () => import('./views/autores/listado.vue'), beforeEnter:isAdmin },
        { path:'/publicaciones/autores/nuevo', name: 'NuevoAutor', component: () => import('./views/autores/nuevo.vue'), beforeEnter:isAdmin },
        { path:'/publicaciones/autor/:id', name: 'DetalleAutor', component: () => import('./views/autores/detalle.vue'), beforeEnter:isAdmin },
        { path:'/publicaciones/autor/:id/editar', name: 'EditarAutor', component: () => import('./views/autores/editar.vue'), beforeEnter:isAdmin },

        
        //Error 404
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('./views/404.vue'),
        }
    ]
});

export default router;