<template>
  <AppLayout>
    <div class="page-pad pb-10 space-y-4">

      <!-- Profile Hero Card -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4 min-w-0">
            <div class="relative flex-shrink-0">
              <img :src="userStore.profileImageUrl" class="w-20 h-20 rounded-2xl object-cover border-2 border-brand-border" />
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white"></div>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h2 class="font-extrabold text-secondary text-lg truncate">{{ userStore.name }}</h2>
                <BadgeCheck :size="17" class="text-primary" />
              </div>
              <p class="text-brand-muted text-xs mt-0.5">{{ userStore.email }}</p>
              <p class="text-brand-muted text-xs mt-0.5">{{ userStore.phone }}</p>
              <span class="mt-2 inline-flex badge bg-primary/10 text-primary">BRG Prime Member</span>
            </div>
          </div>
          <router-link to="/profile/edit" class="w-9 h-9 bg-brand-bg rounded-md flex items-center justify-center hover:bg-brand-border transition-colors">
            <Pencil :size="16" class="text-brand-muted" />
          </router-link>
        </div>

        <!-- Bio -->
        <p v-if="userStore.bio" class="text-sm text-brand-muted leading-relaxed border-t border-brand-border-light pt-4">
          {{ userStore.bio }}
        </p>

        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-brand-border-light">
          <router-link to="/my-listings" class="text-center hover:bg-brand-bg rounded-md p-2 transition-colors">
            <div class="text-xl font-extrabold text-secondary">{{ myListingsCount }}</div>
            <div class="text-xs text-brand-muted mt-0.5">My Listings</div>
          </router-link>
          <router-link to="/profile/saved" class="text-center hover:bg-brand-bg rounded-md p-2 transition-colors">
            <div class="text-xl font-extrabold text-secondary">{{ favStore.count }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Saved</div>
          </router-link>
          <div class="text-center p-2">
            <div class="text-xl font-extrabold text-secondary">{{ memberSince }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Member Since</div>
          </div>
        </div>
      </div>

      <!-- Plan Card -->
      <router-link to="/subscriptions" class="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
        <div class="w-12 h-12 navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
          <Crown :size="22" class="text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-secondary">{{ subStore.plan.name }}</div>
          <div class="text-xs text-brand-muted mt-0.5">
            <span class="font-semibold text-secondary text-base">{{ myListingsCount }}</span>
            of {{ subStore.listingLimit }} listings used
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-xs font-semibold text-primary">{{ subStore.isPaid ? 'Manage' : 'Upgrade' }}</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </div>
      </router-link>

      <!-- Account -->
      <div class="card overflow-hidden">
        <SectionHeader label="Account" />
        <router-link to="/profile/edit" class="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg border-b border-brand-border-light">
          <UserRound :size="18" class="text-brand-muted flex-shrink-0" />
          <span class="text-sm text-secondary flex-1">Edit Profile</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </router-link>
        <router-link to="/profile/privacy" class="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg">
          <Shield :size="18" class="text-brand-muted flex-shrink-0" />
          <span class="text-sm text-secondary flex-1">Privacy & Security</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </router-link>
      </div>

      <!-- Subscription -->
      <div class="card overflow-hidden">
        <SectionHeader label="Subscription" />
        <router-link to="/subscriptions" class="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg">
          <Zap :size="18" class="text-brand-muted flex-shrink-0" />
          <span class="text-sm text-secondary flex-1">My Plan</span>
          <span class="badge mr-1" :class="subStore.isPaid ? 'bg-primary/10 text-primary' : 'bg-brand-bg text-brand-muted border border-brand-border'">{{ subStore.plan.name }}</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </router-link>
      </div>

      <!-- Support -->
      <div class="card overflow-hidden">
        <SectionHeader label="Support" />
        <a href="mailto:support@brgprime.ng" class="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg border-b border-brand-border-light">
          <HelpCircle :size="18" class="text-brand-muted flex-shrink-0" />
          <span class="text-sm text-secondary flex-1">Help Center</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </a>
        <a href="https://wa.me/2348012345678" target="_blank" class="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg border-b border-brand-border-light">
          <MessageCircle :size="18" class="text-brand-muted flex-shrink-0" />
          <span class="text-sm text-secondary flex-1">Contact Us (WhatsApp)</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </a>
        <router-link to="/generic/Terms%20%26%20Conditions" class="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg border-b border-brand-border-light">
          <FileText :size="18" class="text-brand-muted flex-shrink-0" />
          <span class="text-sm text-secondary flex-1">Terms & Conditions</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </router-link>
        <router-link to="/generic/Privacy%20Policy" class="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg border-b border-brand-border-light">
          <ShieldCheck :size="18" class="text-brand-muted flex-shrink-0" />
          <span class="text-sm text-secondary flex-1">Privacy Policy</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </router-link>
        <router-link to="/generic/About%20BRG%20Prime" class="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg">
          <Info :size="18" class="text-brand-muted flex-shrink-0" />
          <span class="text-sm text-secondary flex-1">About BRG Prime</span>
          <ChevronRight :size="16" class="text-brand-light" />
        </router-link>
      </div>

      <!-- Admin Panel -->
      <router-link
        to="/admin"
        class="flex items-center gap-4 p-4 rounded-md border-2 border-danger/20 bg-danger/5 hover:bg-danger/10 transition-colors"
      >
        <div class="w-10 h-10 bg-danger/10 rounded-md flex items-center justify-center flex-shrink-0">
          <ShieldAlert :size="19" class="text-danger" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-secondary text-sm">Admin Panel</div>
          <div class="text-xs text-brand-muted mt-0.5">Manage users, listings, revenue & reports</div>
        </div>
        <ChevronRight :size="16" class="text-danger/50" />
      </router-link>

      <!-- Logout -->
      <button @click="handleLogout" class="btn-outline-danger w-full">
        <LogOut :size="16" class="inline mr-2" />Sign Out
      </button>

      <p class="text-center text-brand-light text-xs">BRG Prime v1.0.0</p>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSubscriptionStore } from '@/stores/subscription'
import { useFavoritesStore } from '@/stores/favorites'
import { usePropertyStore } from '@/stores/property'
import { mockNotifications } from '@/data/mockData'
import AppLayout from '@/components/AppLayout.vue'
import {
  BadgeCheck, Pencil, HelpCircle, MessageCircle, FileText, Info, ShieldCheck,
  ChevronRight, LogOut, Bell, Shield, CreditCard, Star, UserRound, Zap,
  TrendingUp, Layers, Crown, BarChart2, MessageSquare, ClipboardList, Receipt, ShieldAlert,
} from 'lucide-vue-next'

const router       = useRouter()
const userStore    = useUserStore()
const subStore     = useSubscriptionStore()
const favStore     = useFavoritesStore()
const propStore    = usePropertyStore()

const unread         = computed(() => mockNotifications.filter(n => !n.read).length)
const myListingsCount = computed(() => propStore.myListings.length)
const memberSince    = computed(() => {
  const d = new Date(userStore.joinDate || Date.now())
  return d.toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })
})

const SectionHeader = {
  props: ['label'],
  setup: (p) => () => h('div', { class: 'px-5 py-3 border-b border-brand-border-light' },
    [h('span', { class: 'text-xs font-bold text-brand-muted uppercase tracking-wider' }, p.label)]
  )
}

const iconMap = { Bell, Shield, CreditCard, Star, UserRound, Zap, TrendingUp, ChevronRight, Layers, BarChart2, MessageSquare, ClipboardList, Receipt }

const MenuItem = {
  props: { to: String, label: String, icon: String, badge: [String, Number] },
  slots: ['suffix'],
  setup(props, { slots }) {
    return () => h(
      props.to ? 'router-link' : 'div',
      { to: props.to, class: 'flex items-center gap-4 px-5 py-3.5 hover:bg-brand-bg border-b border-brand-border-light last:border-0 cursor-pointer' },
      [
        props.icon && h(iconMap[props.icon] || ChevronRight, { size: 18, class: 'text-brand-muted flex-shrink-0' }),
        h('span', { class: 'text-sm text-secondary flex-1' }, props.label),
        slots.suffix?.() || (props.badge ? h('span', { class: 'badge bg-danger text-white' }, props.badge) : null),
        h(ChevronRight, { size: 16, class: 'text-brand-light' }),
      ]
    )
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
