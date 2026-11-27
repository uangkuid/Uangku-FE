import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      // A sheet over the home page. Move it over Transactions once that screen exists.
      path: '/transactions/new',
      name: 'transaction-new',
      components: {
        default: () => import('../views/HomeView.vue'),
        sheet: () => import('../views/NewTransactionView.vue'),
      },
      meta: { sheet: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/design-system',
      name: 'design-system',
      component: () => import('../views/DesignSystemView.vue'),
    },
  ],
})

export default router
