<template>
  <AppLayout>
    <div class="page-pad max-w-6xl mx-auto space-y-4">
      <!-- Search & Filter Row -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" :size="16" />
          <input v-model="propStore.searchQuery" class="input-field pl-9" placeholder="Search properties..." />
        </div>
        <div class="flex gap-3">
          <select v-model="propStore.selectedLocation" class="input-field flex-1 sm:w-40 sm:flex-none">
            <option>All Locations</option>
            <option v-for="loc in nigerianLocations" :key="loc">{{ loc }}</option>
          </select>
          <button @click="showFilter = true" class="btn-secondary px-4 flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <SlidersHorizontal :size="16" />
            Filter
          </button>
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="tab in tabs" :key="tab"
          @click="propStore.selectedTab = tab"
          class="chip flex-shrink-0"
          :class="propStore.selectedTab === tab ? 'chip-active' : 'chip-inactive'"
        >{{ tab }}</button>
      </div>

      <!-- Results count -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-brand-muted">
          <span class="font-semibold text-secondary">{{ propStore.filteredListings.length }}</span> properties found
        </p>
        <div class="flex gap-2">
          <button @click="viewMode = 'grid'" class="p-1.5 rounded-md" :class="viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-brand-muted'">
            <LayoutGrid :size="16" />
          </button>
          <button @click="viewMode = 'list'" class="p-1.5 rounded-md" :class="viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-brand-muted'">
            <List :size="16" />
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="propStore.loading && !propStore.listings.length" class="text-center py-16">
        <Loader2 :size="28" class="text-primary animate-spin mx-auto mb-3" />
        <p class="text-brand-muted text-sm">Loading properties…</p>
      </div>

      <!-- Grid -->
      <div v-else-if="propStore.filteredListings.length" :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'">
        <PropertyCard v-for="p in propStore.filteredListings" :key="p.id" :property="p" />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16">
        <div class="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX :size="28" class="text-brand-muted" />
        </div>
        <h3 class="font-bold text-secondary mb-1">No properties found</h3>
        <p class="text-brand-muted text-sm mb-4">Try adjusting your search or filters</p>
        <button @click="propStore.resetFilters(); propStore.searchQuery = ''" class="btn-primary mx-auto w-40">Clear Filters</button>
      </div>
    </div>

    <FilterModal v-model="showFilter" />
  </AppLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import PropertyCard from '@/components/PropertyCard.vue'
import FilterModal from '@/components/FilterModal.vue'
import { usePropertyStore } from '@/stores/property'
import { nigerianLocations } from '@/data/nigerianLocations'
import { Search, SlidersHorizontal, LayoutGrid, List, SearchX, Loader2 } from 'lucide-vue-next'

const propStore = usePropertyStore()
const route = useRoute()
const showFilter = ref(false)
const viewMode = ref('grid')
const tabs = ['All', 'Buy', 'Sell', 'Rent', 'Lease', 'Shortlet', 'Commercial', 'Land', 'New Dev']

// Apply a category passed from the sidebar (e.g. /properties?type=Rent)
watch(() => route.query.type, (t) => {
  if (t && tabs.includes(t)) propStore.selectedTab = t
}, { immediate: true })
</script>
