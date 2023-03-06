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
        
        //Error 404
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('./views/404.vue'),
        }
    ]
});

export default router;