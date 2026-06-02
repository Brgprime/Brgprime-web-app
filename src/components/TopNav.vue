<template>
  <header class="sticky top-0 z-30 bg-white border-b border-brand-border h-16 flex items-center px-4 sm:px-6 gap-4 shadow-sm">
    <!-- Hamburger (mobile) -->
    <button
      @click="$emit('toggle-sidebar')"
      class="lg:hidden p-2 rounded-md text-brand-muted hover:bg-brand-bg transition-colors"
    >
      <Menu :size="22" />
    </button>

    <!-- Page title + breadcrumb -->
    <div class="flex-1 min-w-0">
      <h1 class="text-sm font-bold text-secondary truncate">{{ pageTitle }}</h1>
      <p v-if="breadcrumb" class="text-[11px] text-brand-light leading-none mt-0.5">{{ breadcrumb }}</p>
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-1.5">
      <!-- Search shortcut (desktop) -->
      <router-link
        to="/properties"
        class="hidden sm:flex items-center gap-2 bg-brand-bg hover:bg-brand-border/50 border border-brand-border text-brand-muted
        text-xs px-3 py-1.5 rounded-md transition-colors mr-1"
      >
        <Search :size="13" />
        <span>Search</span>
        <kbd class="text-[10px] bg-white border border-brand-border rounded px-1 py-0.5 font-mono text-brand-light">/</kbd>
      </router-link>

      <!-- Notifications -->
      <router-link
        to="/notifications"
        class="relative p-2 rounded-md text-brand-muted hover:bg-brand-bg transition-colors"
      >
        <Bell :size="19" />
        <span
          v-if="unreadCount"
          class="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full ring-2 ring-white"
        ></span>
      </router-link>

      <!-- Avatar -->
      <router-link to="/profile" class="ml-1">
        <img
          :src="userStore.profileImageUrl"
          class="w-8 h-8 rounded-full object-cover border-2 border-brand-border hover:border-primary transition-colors"
        />
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { mockNotifications } from '@/data/mockData'
import { Menu, Bell, Search } from 'lucide-vue-next'

defineEmits(['toggle-sidebar'])

const route  = useRoute()
const userStore = useUserStore()

const unreadCount = computed(() => mockNotifications.filter(n => !n.read).length)

const titleMap = {
  '/admin':           ['Admin Panel',       'Platform Control Center'],
  '/dashboard':       ['Home',             null],
  '/properties':      ['Properties',       'Browse all listings'],
  '/add-listing':     ['Post a Listing',   'Listings'],
  '/my-listings':     ['My Listings',      'Listings · Your Posts'],
  '/buy-posts':       ['Subscription Plans', 'Plans & Pricing'],
  '/analytics':       ['Analytics',        'Insights & Performance'],
  '/forum':           ['Forum',            'Community · Group Chat'],
  '/subscriptions':   ['Subscriptions',    'Plans & Pricing'],
  '/notifications':   ['Notifications',    null],
  '/profile':         ['Profile',          null],
  '/profile/edit':    ['Edit Profile',     'Profile · Settings'],
  '/profile/privacy': ['Privacy & Security','Profile · Settings'],
  '/profile/payments':['Payment Methods',  'Profile · Settings'],
  '/profile/saved':   ['Saved Properties', 'Profile · Activity'],
  '/payments':        ['Payments',         'Finance'],
  '/book-viewing':    ['Book a Viewing',   null],
}

const pageTitle = computed(() => {
  if (route.path.startsWith('/property/')) return 'Property Details'
  if (route.path.startsWith('/generic/'))  return decodeURIComponent(route.params.title)
  return titleMap[route.path]?.[0] || 'BRG Prime'
})

const breadcrumb = computed(() => {
  if (route.path.startsWith('/property/')) return 'Properties · Detail'
  return titleMap[route.path]?.[1] || null
})
</script>
