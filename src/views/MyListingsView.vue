<template>
  <AppLayout>
    <div class="page-pad pb-10">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-extrabold text-secondary">My Listings</h2>
          <p class="text-xs text-brand-muted mt-0.5">{{ listings.length }} propert{{ listings.length === 1 ? 'y' : 'ies' }} posted</p>
        </div>
        <router-link to="/add-listing" class="btn-primary py-2.5 px-4 text-sm gap-2">
          <Plus :size="15" /> Post New
        </router-link>
      </div>

      <!-- Filter tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-5">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="chip flex-shrink-0"
          :class="activeTab === tab ? 'chip-active' : 'chip-inactive'"
        >{{ tab }}</button>
      </div>

      <!-- Listings -->
      <div v-if="filtered.length" class="space-y-4">
        <div
          v-for="p in filtered"
          :key="p.id"
          class="card overflow-hidden hover:shadow-card-hover transition-shadow"
        >
          <div class="flex gap-0">
            <img
              :src="p.images?.[0] || p.image"
              class="w-28 sm:w-36 h-28 object-cover flex-shrink-0"
            />
            <div class="flex-1 p-4 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <span class="inline-flex flex-wrap items-center gap-1 mb-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block"
                      :class="statusClass(p.status)">
                      {{ p.status || 'Active' }}
                    </span>
                    <span v-if="p.isPremium" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 bg-warning/10 text-warning">
                      <ArrowUpNarrowWide :size="10" /> Premium
                    </span>
                    <span v-if="p.isBoosted" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 bg-success/10 text-success">
                      <Rocket :size="10" /> Boosted
                    </span>
                  </span>
                  <h3 class="font-bold text-secondary text-sm leading-tight truncate mt-1">{{ p.title }}</h3>
                  <p class="text-brand-muted text-xs mt-0.5 truncate">{{ p.address || p.location }}</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <div class="font-extrabold text-secondary text-sm">₦{{ formatPrice(p.price) }}</div>
                  <div v-if="p.listingType && p.listingType !== 'sale'" class="text-[10px] text-brand-muted">/yr</div>
                </div>
              </div>

              <div class="flex items-center justify-between mt-3 pt-2 border-t border-brand-border-light">
                <div class="flex items-center gap-3 text-xs text-brand-muted">
                  <span class="flex items-center gap-1"><Eye :size="11" /> {{ p.views ?? 0 }}</span>
                  <span class="flex items-center gap-1"><Heart :size="11" /> {{ p.saves ?? 0 }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <router-link :to="`/property/${p.id}`" class="text-primary text-xs font-semibold hover:underline">View</router-link>
                  <span class="text-brand-border">·</span>
                  <router-link to="/add-listing" class="text-brand-muted text-xs hover:text-secondary">Edit</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-20">
        <div class="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ClipboardList :size="28" class="text-brand-light" />
        </div>
        <h3 class="font-bold text-secondary mb-1">No listings yet</h3>
        <p class="text-brand-muted text-sm mb-5">Properties you post will appear here</p>
        <router-link to="/add-listing" class="btn-primary py-3 px-6 text-sm">Post Your First Listing</router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { usePropertyStore } from '@/stores/property'
import { Plus, Eye, Heart, ClipboardList, ArrowUpNarrowWide, Rocket } from 'lucide-vue-next'

const propStore  = usePropertyStore()
const activeTab  = ref('All')
const tabs       = ['All', 'Active', 'Pending', 'Sold']

const listings   = computed(() => propStore.myListings)
const filtered   = computed(() =>
  activeTab.value === 'All' ? listings.value : listings.value.filter(p => (p.status || 'Active') === activeTab.value)
)

const formatPrice = (n) => (n || 0).toLocaleString()
const statusClass = (s) => ({
  'Active':  'bg-success/10 text-success',
  'Pending': 'bg-warning/10 text-warning',
  'Sold':    'bg-secondary/10 text-secondary',
}[s || 'Active'] || 'bg-success/10 text-success')
</script>
