import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router configuration

createApp(App)
  .use(router) // Register the router
  .mount('#app');
