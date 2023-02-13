import { createRouter, createWebHistory } from 'vue-router';
import { useDataUserStore } from './stores/dataUser';

const isAuth = async(to, from, next) => {
    const dataUser = useDataUserStore();
    const user = await dataUser.isAuth();
    if(user){
        next();
    }else{
        next('/login');
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path:'/', name: 'Dashboard', component: () => import('./views/Dashboard.vue'), beforeEnter: isAuth},
        { path:'/login', name: 'Login', component: () => import('./views/Login.vue')},
        { path:'/logout', name: 'Logout', component: () => import('./views/Logout.vue')},
        { path:'/transparencia', name: 'Transparencia', component: () => import('./views/transparencia/Listado.vue'), beforeEnter:isAuth },
        { path:'/transparencia/:id', name: 'Modulo', component: () => import('./views/transparencia/Modulo.vue'), beforeEnter:isAuth },
        { path:'/perfil/', name: 'Perfil', component: () => import('./views/Profile.vue'), beforeEnter:isAuth },
        { path:'/ayuda', name: 'Ayuda', component: () => import('./views/Ayuda.vue'), beforeEnter:isAuth },
        { path:'/usuarios', name: 'Usuarios', component: () => import('./views/usuarios/Listado.vue'), beforeEnter:isAuth },
        { path:'/usuario:id', name: 'DetalleUsuario', component: () => import('./views/usuarios/Detalle.vue'), beforeEnter:isAuth },
        
        //Error 404
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('./views/404.vue'),
        }
    ]
});

export default router;