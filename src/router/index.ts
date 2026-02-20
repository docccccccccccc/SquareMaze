import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { component: () => import('@/views/MainMenu.vue'), path: '/' },
    { component: () => import('@/views/GameSettings.vue'), path: '/settings' },
    { component: () => import('@/views/SelectLevel.vue'), path: '/select' },
    { component: () => import('@/views/AboutView.vue'), path: '/about' },
    { component: () => import('@/views/GameView.vue'), path: '/play' },
    { component: () => import('@/views/HelpView.vue'), path: '/help' },
    { component: () => import('@/views/customLevel/CreateLevel.vue'), path: '/custom/create' },
    { component: () => import('@/views/customLevel/PlayLevel.vue'), path: '/custom/play' },
  ],
});

export default router;
