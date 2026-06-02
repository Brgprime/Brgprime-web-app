<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 w-64 navy-gradient flex flex-col transition-transform duration-300"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-white/10">
      <div class="w-9 h-9 primary-gradient rounded-md flex items-center justify-center shadow-md">
        <Home :size="18" class="text-white" />
      </div>
      <div>
        <div class="text-white font-extrabold text-base leading-tight tracking-tight">BRG Prime</div>
        <div class="text-white/40 text-[11px] tracking-wide">Buy · Sell · Rent · Lease</div>
      </div>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto space-y-0.5 scrollbar-none">
      <template v-for="(group, gi) in navGroups" :key="gi">
        <div v-if="group.label" class="px-3 pt-4 pb-1">
          <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">{{ group.label }}</span>
        </div>
        <router-link
          v-for="item in group.items"
          :key="item.label"
          :to="item.type ? { path: '/properties', query: { type: item.type } } : item.path"
          @click="$emit('close')"
          class="nav-link"
          :class="isItemActive(item) ? 'nav-link-active' : 'nav-link-inactive'"
        >
          <component :is="item.icon" :size="17" class="flex-shrink-0" />
          <span class="flex-1 truncate">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto bg-danger text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >{{ item.badge }}</span>
        </router-link>
      </template>
    </nav>

    <!-- Plan pill -->
    <div class="px-4 pb-2">
      <router-link
        to="/subscriptions"
        @click="$emit('close')"
        class="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-md px-3 py-2.5"
      >
        <div class="w-7 h-7 bg-warning/20 rounded-md flex items-center justify-center flex-shrink-0">
          <Crown :size="14" class="text-warning" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-white text-xs font-bold">{{ subStore.plan.name }}</div>
          <div class="text-white/50 text-[10px]">{{ myCount }}/{{ subStore.listingLimit }} listings used</div>
        </div>
        <ChevronRight :size="13" class="text-white/30" />
      </router-link>
    </div>

    <!-- User card + Logout -->
    <div class="px-4 py-4 border-t border-white/10 space-y-2">
      <router-link
        to="/profile"
        @click="$emit('close')"
        class="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors"
      >
        <div class="relative flex-shrink-0">
          <img :src="userStore.profileImageUrl" class="w-9 h-9 rounded-full object-cover ring-2 ring-white/20" />
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-secondary-variant"></span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-white text-sm font-semibold truncate leading-tight">{{ userStore.name }}</div>
          <div class="text-white/40 text-[11px] truncate">BRG Prime Member</div>
        </div>
      </router-link>
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-2 text-white/50 hover:text-danger text-sm px-3 py-1.5 rounded-md hover:bg-white/5 transition-all"
      >
        <LogOut :size="15" />
        Sign Out
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSubscriptionStore } from '@/stores/subscription'
import { usePropertyStore } from '@/stores/property'
import { useFavoritesStore } from '@/stores/favorites'
import { mockNotifications } from '@/data/mockData'
import {
  LayoutDashboard, Building2, MessageSquare, User, ClipboardList,
  LogOut, Home, Bell, Plus, Star, Crown, ChevronRight, BarChart2,
  Tag, Key, FileText, Moon, Landmark, HardHat,
} from 'lucide-vue-next'

defineProps({ open: Boolean })
defineEmits(['close'])

const route        = useRoute()
const router       = useRouter()
const userStore    = useUserStore()
const subStore     = useSubscriptionStore()
const propStore    = usePropertyStore()
const favStore     = useFavoritesStore()

const myCount      = computed(() => propStore.myListings.length)

const unreadCount = computed(() => mockNotifications.filter(n => !n.read).length)

const navGroups = computed(() => [
  {
    label: null,
    items: [
      { path: '/dashboard',   label: 'Home',       icon: LayoutDashboard },
      { path: '/properties',  label: 'Properties', icon: Building2 },
    ],
  },
  {
    label: 'Browse',
    items: [
      { label: 'Buy',        icon: Home,      type: 'Buy' },
      { label: 'Sell',       icon: Tag,       type: 'Sell' },
      { label: 'Rent',       icon: Key,       type: 'Rent' },
      { label: 'Lease',      icon: FileText,  type: 'Lease' },
      { label: 'Shortlet',   icon: Moon,      type: 'Shortlet' },
      { label: 'Commercial', icon: Building2, type: 'Commercial' },
      { label: 'Land',       icon: Landmark,  type: 'Land' },
      { label: 'New Dev',    icon: HardHat,   type: 'New Dev' },
    ],
  },
  {
    label: 'Listings',
    items: [
      { path: '/add-listing',  label: 'Post a Listing', icon: Plus },
      { path: '/my-listings',  label: 'My Listings',    icon: ClipboardList },
      { path: '/profile/saved',label: 'Saved',          icon: Star, badge: favStore.count || null },
    ],
  },
  {
    label: 'Insights',
    items: [
      { path: '/analytics', label: 'Analytics', icon: BarChart2 },
      { path: '/forum',     label: 'Forum',     icon: MessageSquare },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/subscriptions', label: 'Subscription',  icon: Crown },
      { path: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount.value || null },
      { path: '/profile',       label: 'Profile',       icon: User },
    ],
  },
])

const isActive = (path) =>
  route.path === path || (path.length > 1 && route.path.startsWith(path) && path !== '/dashboard')

const isItemActive = (item) =>
  item.type
    ? route.path === '/properties' && route.query.type === item.type
    : isActive(item.path)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
