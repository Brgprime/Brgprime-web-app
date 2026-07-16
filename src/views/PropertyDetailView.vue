<template>
  <AppLayout>
    <div v-if="property" class="max-w-4xl mx-auto">
      <!-- Hero Image -->
      <div class="relative">
        <div class="h-72 sm:h-96 overflow-hidden sm:rounded-lg sm:mx-6">
          <img :src="property.images[activeImg]" class="w-full h-full object-cover" :alt="property.title" />
        </div>
        <!-- Back -->
        <button @click="$router.back()" class="absolute top-4 left-4 sm:left-8 w-9 h-9 bg-white rounded-md flex items-center justify-center shadow">
          <ArrowLeft :size="18" class="text-secondary" />
        </button>
        <!-- Favorite -->
        <button
          @click="favStore.toggle(property.id)"
          class="absolute top-4 right-16 w-9 h-9 bg-white rounded-md flex items-center justify-center shadow"
        >
          <Heart :size="18" :class="favStore.isSaved(property.id) ? 'fill-danger text-danger' : 'text-brand-muted'" />
        </button>
        <!-- Share -->
        <button class="absolute top-4 right-4 w-9 h-9 bg-white rounded-md flex items-center justify-center shadow">
          <Share2 :size="18" class="text-brand-muted" />
        </button>
        <!-- Listing type badge -->
        <span class="absolute bottom-4 left-4 sm:left-8 badge bg-primary text-white px-3 py-1">{{ formatType(property.listingType) }}</span>
        <!-- Thumbnail strip -->
        <div v-if="property.images.length > 1" class="absolute bottom-4 right-4 flex gap-2">
          <div
            v-for="(img, i) in property.images.slice(0, 4)" :key="i"
            @click="activeImg = i"
            class="w-10 h-10 rounded-md overflow-hidden cursor-pointer border-2 transition-all"
            :class="activeImg === i ? 'border-primary' : 'border-white'"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div class="page-pad space-y-5 mt-5 pb-24">
        <!-- Header -->
        <div>
          <div class="flex items-start justify-between gap-3">
            <h1 class="text-xl font-extrabold text-secondary">{{ property.title }}</h1>
            <div v-if="property.isVerified" class="flex-shrink-0 badge bg-success/10 text-success flex items-center gap-1">
              <BadgeCheck :size="12" /> Verified
            </div>
          </div>
          <div class="flex items-center gap-1 text-brand-muted text-sm mt-1">
            <MapPin :size="14" />{{ property.address }}
          </div>
          <div class="flex items-center gap-1 mt-2">
            <Star :size="14" class="fill-warning text-warning" />
            <span class="text-sm font-semibold text-secondary">{{ property.rating }}</span>
            <span class="text-brand-muted text-sm">({{ property.reviewCount }} reviews)</span>
          </div>
        </div>

        <!-- Features -->
        <div v-if="property.bedrooms" class="flex gap-4 bg-brand-bg rounded-md p-4">
          <div class="flex-1 text-center">
            <BedDouble :size="20" class="text-primary mx-auto mb-1" />
            <div class="font-bold text-secondary">{{ property.bedrooms }}</div>
            <div class="text-xs text-brand-muted">Bedrooms</div>
          </div>
          <div class="w-px bg-brand-border"></div>
          <div class="flex-1 text-center">
            <Bath :size="20" class="text-primary mx-auto mb-1" />
            <div class="font-bold text-secondary">{{ property.bathrooms }}</div>
            <div class="text-xs text-brand-muted">Bathrooms</div>
          </div>
          <div v-if="property.size" class="w-px bg-brand-border"></div>
          <div v-if="property.size" class="flex-1 text-center">
            <Maximize2 :size="20" class="text-primary mx-auto mb-1" />
            <div class="font-bold text-secondary">{{ property.size }}</div>
            <div class="text-xs text-brand-muted">sqm</div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3 class="section-title">Description</h3>
          <p class="text-brand-muted text-sm leading-relaxed">{{ property.description }}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <span class="badge bg-brand-bg text-brand-muted border border-brand-border">{{ property.furnishingStatus }}</span>
            <span class="badge bg-brand-bg text-brand-muted border border-brand-border">{{ property.propertyCondition }} Condition</span>
            <span v-if="property.yearBuilt" class="badge bg-brand-bg text-brand-muted border border-brand-border">Built {{ property.yearBuilt }}</span>
          </div>
        </div>

        <!-- Amenities -->
        <div v-if="property.amenities.length">
          <h3 class="section-title">Amenities</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="a in property.amenities" :key="a" class="badge bg-primary/10 text-primary border border-primary/20 py-1 px-3">{{ a }}</span>
          </div>
        </div>

        <!-- Agent Card -->
        <div class="card p-4">
          <h3 class="font-bold text-secondary mb-3">Listed By</h3>
          <div class="flex items-center gap-3">
            <img :src="property.agentAvatar" class="w-12 h-12 rounded-full object-cover" />
            <div class="flex-1">
              <div class="font-bold text-secondary">{{ property.agentName }}</div>
              <div class="text-xs text-brand-muted">Real Estate Agent</div>
            </div>
          </div>
          <div class="flex gap-3 mt-4">
            <button class="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
              <MessageSquare :size="15" /> Message
            </button>
            <a href="tel:+2348012345678" class="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
              <Phone :size="15" /> Call
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-brand-border p-4 flex items-center justify-between gap-3">
        <div class="flex-1 min-w-0">
          <div class="text-primary text-xl font-extrabold">{{ formatPrice(property.price) }}<span class="text-brand-light text-sm font-normal">{{ priceSuffix }}</span></div>
          <div class="text-brand-muted text-xs truncate">{{ property.address }}</div>
        </div>
        <router-link :to="`/book-viewing?id=${property.id}`" class="btn-primary px-4 sm:px-8 py-3 text-sm flex-shrink-0">Book Viewing</router-link>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center py-16 page-pad">
      <h3 class="font-bold text-secondary mb-2">Property not found</h3>
      <router-link to="/properties" class="btn-primary block w-40 mx-auto">Browse Properties</router-link>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { usePropertyStore } from '@/stores/property'
import { useFavoritesStore } from '@/stores/favorites'
import { ArrowLeft, Heart, Share2, MapPin, Star, BedDouble, Bath, Maximize2, MessageSquare, Phone, BadgeCheck } from 'lucide-vue-next'

const route = useRoute()
const propStore = usePropertyStore()
const favStore = useFavoritesStore()

const fetched = ref(null)
const property = computed(() => fetched.value || propStore.getById(route.params.id))
const activeImg = ref(0)

onMounted(async () => {
  try {
    fetched.value = await propStore.fetchById(route.params.id)
  } catch { /* not-found handled by the template fallback */ }
})

const formatType = (type) => {
  const m = { rent: 'For Rent', sale: 'For Sale', lease: 'For Lease', shortlet: 'Shortlet', commercialRent: 'Commercial', land: 'Land', landLease: 'Land Lease' }
  return m[type] || type
}
const priceSuffix = computed(() => {
  const t = property.value?.listingType
  if (t === 'rent' || t === 'lease' || t === 'commercialRent') return '/yr'
  if (t === 'shortlet') return '/night'
  return ''
})
const formatPrice = (p) => {
  if (p >= 1e9) return `₦${(p/1e9).toFixed(1)}B`
  if (p >= 1e6) return `₦${(p/1e6).toFixed(1)}M`
  if (p >= 1e3) return `₦${(p/1e3).toFixed(0)}k`
  return `₦${p.toLocaleString()}`
}
</script>
