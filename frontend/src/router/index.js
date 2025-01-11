import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import WardRobe from '../views/WardRobe.vue';

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/wardrobe',
    name: 'WardRobe',
    component: WardRobe,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
