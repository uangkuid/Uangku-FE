import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useOverlayStore } from '@/stores/overlays'

/** The navigation rail item a screen belongs to. */
export type NavSection = 'home' | 'transactions' | 'wallets' | 'report' | 'family'

declare module 'vue-router' {
  interface RouteMeta {
    section?: NavSection
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { section: 'home' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/register/verify-email',
    name: 'verify-email',
    component: () => import('../views/VerifyEmailView.vue'),
  },
  {
    path: '/register/secret-key',
    name: 'secret-key',
    component: () => import('../views/SecretKeyView.vue'),
  },
  {
    path: '/register/emergency-kit',
    name: 'emergency-kit',
    component: () => import('../views/EmergencyKitView.vue'),
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../views/TransactionsView.vue'),
    meta: { section: 'transactions' },
  },
  {
    path: '/wallets',
    name: 'wallets',
    component: () => import('../views/WalletsView.vue'),
    meta: { section: 'wallets' },
  },
  {
    path: '/wallets/:id',
    name: 'wallet',
    component: () => import('../views/WalletDetailView.vue'),
    props: (route) => ({ id: route.params.id, initialTab: route.query.tab }),
    meta: { section: 'wallets' },
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('../views/ReportView.vue'),
    meta: { section: 'report' },
  },
  {
    path: '/family',
    name: 'family',
    component: () => import('../views/FamilyView.vue'),
    meta: { section: 'family' },
  },
  {
    path: '/family/start',
    name: 'family-start',
    component: () => import('../views/FamilyOnboardingView.vue'),
    meta: { section: 'family' },
  },
  {
    path: '/family/create',
    name: 'family-create',
    component: () => import('../views/FamilyCreateView.vue'),
    meta: { section: 'family' },
  },
  {
    path: '/family/create/kit',
    name: 'family-kit',
    component: () => import('../views/FamilyKitView.vue'),
    meta: { section: 'family' },
  },
  {
    path: '/family/join',
    name: 'family-join',
    component: () => import('../views/FamilyJoinView.vue'),
    meta: { section: 'family' },
  },
  {
    path: '/family/join/invitation',
    name: 'family-invitation',
    component: () => import('../views/FamilyInvitationView.vue'),
    meta: { section: 'family' },
  },
  {
    path: '/family/join/kit',
    name: 'family-join-kit',
    component: () => import('../views/FamilyJoinKitView.vue'),
    meta: { section: 'family' },
  },
  {
    path: '/design-system',
    name: 'design-system',
    component: () => import('../views/DesignSystemView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

// While an overlay is open, Back only closes the one on top: the navigation is cancelled, and the
// router restores the history entry.
router.beforeEach(() => {
  const overlays = useOverlayStore()
  if (!overlays.isOpen) return true
  overlays.closeTop()
  return false
})

export default router
