import { defineStore } from 'pinia'
import { mockProperties } from '@/data/mockData'

export const usePropertyStore = defineStore('property', {
  state: () => ({
    listings: [...mockProperties],
    searchQuery: '',
    selectedLocation: 'All Locations',
    selectedTab: 'All',
    filterOptions: {
      minPrice: 100000,
      maxPrice: 50000000,
      propertyType: 'All',
      bedrooms: 'Any',
      bathrooms: 'Any',
      verifiedOnly: false,
    },
  }),
  getters: {
    filteredListings: (state) => {
      const matched = state.listings.filter(p => {
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
      // Premium listings surface at the top of results, boosted next.
      return matched.sort((a, b) => visibilityRank(b) - visibilityRank(a))
    },
    featuredListings: (state) => state.listings.filter(p => p.isVerified).slice(0, 6),
    recentListings: (state) => state.listings.filter(p => p.isRecentlyPosted).slice(0, 4),
    myListings: (state) => state.listings.filter(p => p.agentName === 'You'),
    getById: (state) => (id) => state.listings.find(p => p.id === id),
  },
  actions: {
    addListing(listing) {
      const newListing = {
        ...listing,
        id: String(Date.now()),
        createdAt: new Date().toISOString().split('T')[0],
        isRecentlyPosted: true,
        isVerified: false,
        isPremium: !!listing.isPremium,
        isBoosted: !!listing.isBoosted,
        agentName: 'You',
        agentAvatar: 'https://i.pravatar.cc/150?u=agent',
        rating: 0,
        reviewCount: 0,
      }
      this.listings.unshift(newListing)
    },
    resetFilters() {
      this.filterOptions = {
        minPrice: 100000,
        maxPrice: 50000000,
        propertyType: 'All',
        bedrooms: 'Any',
        bathrooms: 'Any',
        verifiedOnly: false,
      }
    },
  },
})

function visibilityRank(p) {
  return (p.isPremium ? 2 : 0) + (p.isBoosted ? 1 : 0)
}

function tabMatchesType(tab, type) {
  const map = {
    'Buy': 'sale',
    'Sell': 'sale',
    'Rent': 'rent',
    'Lease': 'lease',
    'Shortlet': 'shortlet',
    'Commercial': 'commercialRent',
    'Land': 'land',
    'New Dev': 'sale',
  }
  return type === map[tab]
}
