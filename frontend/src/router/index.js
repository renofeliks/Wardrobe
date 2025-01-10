import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage, // Display this component at the root URL
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
