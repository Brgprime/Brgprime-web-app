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
import { usePropertyStore } from '@/stores/property'
import { popularLocations } from '@/data/nigerianLocations'
import PropertyCard from '@/components/PropertyCard.vue'
import { ChevronRight, Plus } from 'lucide-vue-next'

const userStore    = useUserStore()
const propStore    = usePropertyStore()

const hour     = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

const featured = computed(() => propStore.featuredListings)

const stats = [
  { value: '12,400+', label: 'Active Listings'  },
  { value: '5,200+',  label: 'Happy Users'      },
  { value: '850+',    label: 'Agents & Sellers' },
  { value: '36',      label: 'Locations'        },
]
</script>
