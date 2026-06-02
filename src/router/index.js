import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/',             component: () => import('@/views/LandingView.vue'),        meta: { public: true } },
  { path: '/login',        component: () => import('@/views/LoginView.vue'),           meta: { public: true } },
  { path: '/register',     component: () => import('@/views/RegisterView.vue'),        meta: { public: true } },
  { path: '/forgot-password', component: () => import('@/views/ForgotPasswordView.vue'), meta: { public: true } },

  { path: '/dashboard',        component: () => import('@/views/DashboardView.vue') },
  { path: '/properties',       component: () => import('@/views/PropertiesView.vue') },
  { path: '/property/:id',     component: () => import('@/views/PropertyDetailView.vue') },
  { path: '/add-listing',      component: () => import('@/views/AddListingView.vue') },
  { path: '/my-listings',      component: () => import('@/views/MyListingsView.vue') },
  { path: '/buy-posts',        redirect: '/subscriptions' },
  { path: '/payments',         component: () => import('@/views/PaymentsView.vue') },
  { path: '/forum',            component: () => import('@/views/ForumView.vue') },
  { path: '/subscriptions',    component: () => import('@/views/SubscriptionsView.vue') },
  { path: '/notifications',    component: () => import('@/views/NotificationsView.vue') },
  { path: '/analytics',        component: () => import('@/views/AnalyticsView.vue') },
  { path: '/profile',          component: () => import('@/views/ProfileView.vue') },
  { path: '/profile/edit',     component: () => import('@/views/EditProfileView.vue') },
  { path: '/profile/privacy',  component: () => import('@/views/PrivacyView.vue') },
  { path: '/profile/payments', component: () => import('@/views/PaymentMethodsView.vue') },
  { path: '/profile/saved',    component: () => import('@/views/SavedPropertiesView.vue') },
  { path: '/admin',            component: () => import('@/views/AdminView.vue') },
  { path: '/book-viewing',     component: () => import('@/views/BookViewingView.vue') },
  { path: '/generic/:title',   component: () => import('@/views/GenericContentView.vue') },
  { path: '/:pathMatch(.*)*',  redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const token = localStorage.getItem('user_token')

  // Private routes require auth
  if (!to.meta.public && !token) return '/login'

  // Authenticated users skip public pages (except landing — let them revisit)
  if (to.meta.public && token && to.path !== '/') return '/dashboard'
})

export default router
