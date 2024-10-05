import { createRouter, createWebHistory } from 'vue-router';
import IaView from '@/components/ChatBot.vue';
import SobreView from '@/components/SobreBot.vue';

const router = createRouter({
  history: createWebHistory('/'), // Define BASE_URL para a raiz do site
  routes: [
    {
      path: '/',
      name: 'home',
      component: IaView
    },
    {
      path: '/ia',
      name: 'ia',
      component: IaView
    },
    {
      path: '/sobre',
      name: 'sobre',
      component: SobreView
    }
  ]
});

export default router; // Exporta a variável router