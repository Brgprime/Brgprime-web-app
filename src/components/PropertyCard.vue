<template>
  <div
    class="card overflow-hidden cursor-pointer group transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
    @click="$router.push(`/property/${property.id}`)"
  >
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="property.images[0]"
        :alt="property.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
      />

      <!-- Listing type badge -->
      <span class="absolute top-3 left-3 badge bg-secondary/80 text-white backdrop-blur-sm capitalize">
        {{ formatType(property.listingType) }}
      </span>

      <!-- New badge -->
      <span v-if="property.isRecentlyPosted" class="absolute top-3 left-3 mt-0" style="top: auto; bottom: 3.25rem; left: 0.75rem; position: absolute;" hidden></span>

      <!-- Premium / Boosted badge -->
      <span
        v-if="property.isPremium"
        class="absolute bottom-3 right-3 badge bg-warning text-white flex items-center gap-1 backdrop-blur-sm text-[10px]"
      >
        <ArrowUpNarrowWide :size="11" /> Premium
      </span>
      <span
        v-else-if="property.isBoosted"
        class="absolute bottom-3 right-3 badge bg-success text-white flex items-center gap-1 backdrop-blur-sm text-[10px]"
      >
        <Rocket :size="11" /> Boosted
      </span>

      <!-- Verified badge -->
      <span
        v-if="property.isVerified"
        class="absolute top-3 right-12 badge bg-success text-white flex items-center gap-1 backdrop-blur-sm"
      >
        <BadgeCheck :size="11" /> Verified
      </span>

      <!-- New pill -->
      <span
        v-if="property.isRecentlyPosted"
        class="absolute bottom-3 left-3 badge bg-warning text-white text-[10px]"
      >New</span>

      <!-- Favorite -->
      <button
        class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow transition-all hover:scale-110 active:scale-95"
        @click.stop="favStore.toggle(property.id)"
        :title="favStore.isSaved(property.id) ? 'Remove from saved' : 'Save property'"
      >
        <Heart
          :size="16"
          :class="favStore.isSaved(property.id) ? 'fill-danger text-danger' : 'text-brand-muted'"
        />
      </button>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="mb-1">
        <h3 class="font-bold text-secondary text-sm leading-snug line-clamp-1">{{ property.title }}</h3>
      </div>
      <div class="flex items-center gap-1 text-brand-muted text-xs mb-3">
        <MapPin :size="11" class="flex-shrink-0" />
        <span class="truncate">{{ property.address }}</span>
      </div>

      <!-- Features row -->
      <div
        v-if="property.bedrooms"
        class="flex items-center gap-3 text-xs text-brand-muted mb-3 border-t border-brand-border-light pt-3"
      >
        <span class="flex items-center gap-1"><BedDouble :size="12" /> {{ property.bedrooms }} Beds</span>
        <span class="flex items-center gap-1"><Bath :size="12" /> {{ property.bathrooms }} Baths</span>
        <span v-if="property.size" class="flex items-center gap-1 ml-auto"><Maximize2 :size="12" /> {{ property.size }}m²</span>
      </div>

      <!-- Price row -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-primary font-extrabold text-base">{{ formatPrice(property.price) }}</span>
          <span class="text-brand-light text-xs font-normal">{{ priceSuffix }}</span>
        </div>
        <div class="flex items-center gap-1 text-xs text-brand-muted">
          <Star :size="12" class="fill-warning text-warning" />
          <span class="font-semibold text-secondary">{{ property.rating }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { Heart, MapPin, BedDouble, Bath, Maximize2, Star, BadgeCheck, ArrowUpNarrowWide, Rocket } from 'lucide-vue-next'

const props = defineProps({
  property: { type: Object, required: true },
})

const favStore = useFavoritesStore()

const formatType = (type) => {
  const map = {
    rent: 'For Rent', sale: 'For Sale', lease: 'For Lease',
    shortlet: 'Shortlet', commercialRent: 'Commercial', commercialSale: 'Commercial Sale',
    land: 'Land', landLease: 'Land Lease', jointVenture: 'Joint Venture',
  }
  return map[type] || type
}

const priceSuffix = computed(() => {
  const t = props.property.listingType
  if (t === 'rent' || t === 'lease' || t === 'commercialRent') return '/yr'
  if (t === 'shortlet') return '/night'
  return ''
})

const formatPrice = (price) => {
  if (price >= 1_000_000_000) return `₦${(price / 1_000_000_000).toFixed(1)}B`
  if (price >= 1_000_000)     return `₦${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000)         return `₦${(price / 1_000).toFixed(0)}k`
  return `₦${price.toLocaleString()}`
}
</script>
