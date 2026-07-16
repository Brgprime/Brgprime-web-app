<template>
  <div class="min-h-screen bg-brand-bg">
    <!-- Sidebar -->
    <NavSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Overlay (mobile) -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-secondary/60 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Main content -->
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <TopNav @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavSidebar from './NavSidebar.vue'
import TopNav from './TopNav.vue'
import { usePropertyStore } from '@/stores/property'
import { useFavoritesStore } from '@/stores/favorites'
import { useSubscriptionStore } from '@/stores/subscription'
import { useNotificationsStore } from '@/stores/notifications'

const sidebarOpen = ref(false)
const propStore = usePropertyStore()
const favStore = useFavoritesStore()
const subStore = useSubscriptionStore()
const notifStore = useNotificationsStore()

// Load shared data for the authenticated app (guarded against redundant fetches).
onMounted(() => {
  propStore.ensureLoaded()
  propStore.fetchMine().catch(() => {})
  favStore.fetch()
  subStore.fetch()
  notifStore.fetch()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
