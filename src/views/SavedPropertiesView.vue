<template>
  <AppLayout>
    <div class="page-pad pb-10">
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-brand-muted">
          <span class="font-bold text-secondary">{{ savedProperties.length }}</span>
          saved {{ savedProperties.length === 1 ? 'property' : 'properties' }}
        </p>
        <router-link v-if="savedProperties.length" to="/properties" class="text-primary text-sm font-semibold hover:underline">
          Browse More
        </router-link>
      </div>

      <div v-if="savedProperties.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PropertyCard v-for="p in savedProperties" :key="p.id" :property="p" />
      </div>

      <div v-else class="text-center py-20">
        <div class="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Heart :size="32" class="text-danger/50" />
        </div>
        <h3 class="font-extrabold text-secondary text-lg mb-2">No saved properties yet</h3>
        <p class="text-brand-muted text-sm mb-6 max-w-xs mx-auto">
          Tap the heart icon on any listing to save it here for quick access later.
        </p>
        <router-link to="/properties" class="btn-primary px-8">Explore Properties</router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import AppLayout from '@/components/AppLayout.vue'
import PropertyCard from '@/components/PropertyCard.vue'
import { Heart } from 'lucide-vue-next'

// Load the full saved-property objects straight from the server.
const savedProperties = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/favorites')
    savedProperties.value = data
  } catch { /* ignore */ }
})
</script>
