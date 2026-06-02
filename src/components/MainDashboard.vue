<template>
  <div class="page-pad max-w-5xl mx-auto space-y-6 pb-24">

    <!-- Greeting -->
    <div>
      <p class="text-brand-muted text-sm">{{ greeting }},</p>
      <h2 class="text-xl font-extrabold text-secondary leading-tight">
        {{ userStore.name.split(' ')[0] }}
      </h2>
      <p class="text-xs text-brand-muted mt-0.5">What are you looking for today?</p>
    </div>

    <!-- Plan Banner -->
    <router-link
      to="/subscriptions"
      class="block navy-gradient rounded-lg p-4 relative overflow-hidden group"
    >
      <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full"></div>
      <div class="absolute right-8 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
      <div class="relative flex items-center justify-between">
        <div>
          <p class="text-white/60 text-xs font-medium uppercase tracking-wider mb-0.5">Current Plan</p>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-white">{{ subStore.plan.name }}</span>
          </div>
          <p class="text-white/50 text-xs mt-1">
            {{ myCount }} of {{ subStore.listingLimit }} listings used<template v-if="subStore.isPaid"> · {{ subStore.premiumRemaining }} premium · {{ subStore.boostsRemaining }} boosts left</template>
          </p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <div class="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center group-hover:bg-white/15 transition-colors">
            <Crown :size="22" class="text-white" />
          </div>
          <span class="text-white/70 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full group-hover:bg-white/15 transition-colors">
            {{ subStore.isPaid ? 'Manage Plan' : 'Upgrade' }}
          </span>
        </div>
      </div>
    </router-link>

    <!-- Browse By Category -->
    <div>
      <h3 class="section-title">Browse By</h3>
      <div class="grid grid-cols-4 gap-2">
        <router-link
          v-for="cat in categories"
          :key="cat.label"
          to="/properties"
          class="flex flex-col items-center gap-2 bg-white rounded-md px-1 py-3.5 shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div class="w-9 h-9 rounded-md flex items-center justify-center" :class="cat.bg">
            <component :is="cat.icon" :size="18" :class="cat.color" />
          </div>
          <span class="text-[11px] font-semibold text-secondary text-center leading-tight">{{ cat.label }}</span>
        </router-link>
      </div>
    </div>

    <!-- Featured Listings -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="section-title mb-0">Featured Listings</h3>
        <router-link to="/properties" class="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
          See All <ChevronRight :size="14" />
        </router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PropertyCard v-for="p in featured" :key="p.id" :property="p" />
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div v-for="stat in stats" :key="stat.label" class="card p-4 text-center">
        <div class="text-2xl font-extrabold text-secondary">{{ stat.value }}</div>
        <div class="text-xs text-brand-muted mt-0.5">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Popular Locations -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="section-title mb-0">Popular Locations</h3>
        <router-link to="/properties" class="text-primary text-sm font-semibold hover:underline">Explore</router-link>
      </div>
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <div
          v-for="loc in popularLocations"
          :key="loc.name"
          class="flex-shrink-0 relative rounded-md overflow-hidden cursor-pointer w-36 h-24 group"
          @click="$router.push('/properties')"
        >
          <img :src="loc.image" :alt="loc.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400" />
          <div class="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/20 to-transparent flex flex-col justify-end p-2.5">
            <span class="text-white text-xs font-bold leading-tight">{{ loc.name }}</span>
            <span class="text-white/60 text-[10px]">{{ loc.count }}+ listings</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- FAB: Post Listing -->
  <div class="fixed bottom-6 right-6 z-10">
    <router-link
      to="/add-listing"
      class="primary-gradient text-white font-bold px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-2
      hover:opacity-90 active:scale-95 transition-all"
    >
      <Plus :size="18" />
      Post a Listing
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSubscriptionStore } from '@/stores/subscription'
import { usePropertyStore } from '@/stores/property'
import { popularLocations } from '@/data/nigerianLocations'
import PropertyCard from '@/components/PropertyCard.vue'
import {
  ChevronRight, Plus, Crown,
  Home, Tag, Key, FileText, Moon, Building2, Landmark, HardHat,
} from 'lucide-vue-next'

const userStore    = useUserStore()
const subStore     = useSubscriptionStore()
const propStore    = usePropertyStore()

const myCount      = computed(() => propStore.myListings.length)

const hour     = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

const featured = computed(() => propStore.featuredListings)

const categories = [
  { icon: Home,      label: 'Buy',        color: 'text-primary',          bg: 'bg-primary/10'   },
  { icon: Tag,       label: 'Sell',       color: 'text-success',          bg: 'bg-success/10'   },
  { icon: Key,       label: 'Rent',       color: 'text-warning',          bg: 'bg-warning/10'   },
  { icon: FileText,  label: 'Lease',      color: 'text-secondary',        bg: 'bg-secondary/10' },
  { icon: Moon,      label: 'Shortlet',   color: 'text-secondary-variant',bg: 'bg-secondary/10' },
  { icon: Building2, label: 'Commercial', color: 'text-primary',          bg: 'bg-primary/10'   },
  { icon: Landmark,  label: 'Land',       color: 'text-success',          bg: 'bg-success/10'   },
  { icon: HardHat,   label: 'New Dev',    color: 'text-warning',          bg: 'bg-warning/10'   },
]

const stats = [
  { value: '12,400+', label: 'Active Listings'  },
  { value: '5,200+',  label: 'Happy Users'      },
  { value: '850+',    label: 'Agents & Sellers' },
  { value: '36',      label: 'Locations'        },
]
</script>
