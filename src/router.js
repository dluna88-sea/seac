import { createRouter, createWebHistory } from 'vue-router';
import { useDataUserStore } from './stores/dataUser';

const isAuth = async(to, from, next) => {
    const dataUser = useDataUserStore();
    if(dataUser.isAuth()){
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
        { path:'/transparencia', name: 'Transparencia', component: () => import('./views/transparencia/Listado.vue'), beforeEnter:isAuth },
        { path:'/transparencia/:id', name: 'Modulo', component: () => import('./views/transparencia/Modulo.vue'), beforeEnter:isAuth },
        { path:'/perfil/', name: 'Perfil', component: () => import('./views/Profile.vue'), beforeEnter:isAuth },
        
        //Error 404
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('./views/404.vue'),
        }
    ]
});

export default router;