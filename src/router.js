import { createRouter, createWebHistory } from 'vue-router';
import { useAuthUserStore } from './stores/authUser';
import { auth, db } from './firebase'

const isAuth = async(to, from, next) => {
    const authUser = useAuthUserStore();
    await authUser.isAuth().then((user) => {
        if(user) next();
        else next('/login');
    })
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path:'/', name: 'Dashboard', component: () => import('./views/Dashboard.vue'), beforeEnter: isAuth },
        { path:'/login', name: 'Login', component: () => import('./views/Login.vue')},
        { path:'/logout', name: 'Logout', component: () => import('./views/Logout.vue'), beforeEnter: isAuth },
        { path:'/perfil', name: 'Profile', component: () => import('./views/Profile.vue'), beforeEnter: isAuth },

        //Error 404
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('./views/404.vue'),
        }
    ]
});

export default router;