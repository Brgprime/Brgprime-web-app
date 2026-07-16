import { defineStore } from 'pinia'
import api from '@/lib/api'

const DEFAULT_FILTERS = {
  minPrice: 100000,
  maxPrice: 50000000,
  propertyType: 'All',
  bedrooms: 'Any',
  bathrooms: 'Any',
  verifiedOnly: false,
}

export const usePropertyStore = defineStore('property', {
  state: () => ({
    listings: [],       // public browse set (server-provided)
    myItems: [],        // the current user's own listings (owner-scoped)
    loading: false,
    loaded: false,
    // Filter UI state (client-side filtering over `listings`, unchanged behaviour)
    searchQuery: '',
    selectedLocation: 'All Locations',
    selectedTab: 'All',
    filterOptions: { ...DEFAULT_FILTERS },
  }),

  getters: {
    filteredListings: (state) => {
      const matched = state.listings.filter((p) => {
        const q = state.searchQuery.toLowerCase()
        const matchSearch = !q || p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
        const matchLocation = state.selectedLocation === 'All Locations' || p.address.includes(state.selectedLocation)
        const matchTab = state.selectedTab === 'All' || tabMatchesType(state.selectedTab, p.listingType)
        const matchPrice = p.price >= state.filterOptions.minPrice && p.price <= state.filterOptions.maxPrice
        const matchType = state.filterOptions.propertyType === 'All' || p.propertyType === state.filterOptions.propertyType.toLowerCase()
        const matchBeds = state.filterOptions.bedrooms === 'Any' || p.bedrooms >= parseInt(state.filterOptions.bedrooms)
        const matchBaths = state.filterOptions.bathrooms === 'Any' || p.bathrooms >= parseInt(state.filterOptions.bathrooms)
        const matchVerified = !state.filterOptions.verifiedOnly || p.isVerified
        return matchSearch && matchLocation && matchTab && matchPrice && matchType && matchBeds && matchBaths && matchVerified
      })
      return matched.sort((a, b) => visibilityRank(b) - visibilityRank(a))
    },
    featuredListings: (state) => state.listings.filter((p) => p.isVerified).slice(0, 6),
    recentListings: (state) => state.listings.filter((p) => p.isRecentlyPosted).slice(0, 4),
    myListings: (state) => state.myItems,
    getById: (state) => (id) =>
      state.listings.find((p) => p.id === id) || state.myItems.find((p) => p.id === id),
  },

  actions: {
    // Load the browse set once (call from AppLayout on mount).
    async ensureLoaded() {
      if (this.loaded || this.loading) return
      await this.fetchListings()
    },

    async fetchListings() {
      this.loading = true
      try {
        const { data } = await api.get('/properties', { limit: 100 })
        this.listings = data
        this.loaded = true
      } finally {
        this.loading = false
      }
    },

    async fetchMine() {
      const { data } = await api.get('/properties/mine')
      this.myItems = data
      return data
    },

    // Fetch a single property (robust on refresh / deep link).
    async fetchById(id) {
      const { data } = await api.get(`/properties/${id}`)
      // Keep the cache warm so getById works too.
      const idx = this.listings.findIndex((p) => p.id === id)
      if (idx >= 0) this.listings[idx] = data
      return data
    },

    // Create a listing. Throws ApiError (e.g. quota reached) for the caller to handle.
    async createListing(payload) {
      const { data } = await api.post('/properties', payload)
      this.listings.unshift(data)
      this.myItems.unshift(data)
      return data
    },

    resetFilters() {
      this.filterOptions = { ...DEFAULT_FILTERS }
    },
  },
})

function visibilityRank(p) {
  return (p.isPremium ? 2 : 0) + (p.isBoosted ? 1 : 0)
}

function tabMatchesType(tab, type) {
  const map = {
    Buy: 'sale',
    Sell: 'sale',
    Rent: 'rent',
    Lease: 'lease',
    Shortlet: 'shortlet',
    Commercial: 'commercialRent',
    Land: 'land',
    'New Dev': 'sale',
  }
  return type === map[tab]
}
