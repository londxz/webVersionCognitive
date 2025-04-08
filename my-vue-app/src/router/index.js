import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Auth/Login.vue';
import Register from '../components/Auth/Register.vue';
import Results from '../components/Results.vue';
import store from '../store';
import App1 from '../components/Tests/App1.vue';
import TestsList from '../components/TestsList.vue';
//import App from '@/App.vue';



const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/', component: App1, meta: { requiresAuth: true } },
  { path: '/results', component: Results, meta: { requiresAuth: true } },
  { 
    path: '/tests', 
    component: TestsList, 
    meta: { requiresAuth: true } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.token !== null;
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/register' });
  } else {
    next();
  }
});

export default router;