import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    savedIds: new Set(),
    loaded: false,
  }),
  getters: {
    count: (state) => state.savedIds.size,
    isSaved: (state) => (id) => state.savedIds.has(id),
  },
  actions: {
    async fetch() {
      try {
        const { data } = await api.get('/favorites/ids')
        this.savedIds = new Set(data.ids)
        this.loaded = true
      } catch {
        /* not logged in yet, ignore */
      }
    },

    // Optimistic toggle; reconciles with the server response.
    async toggle(id) {
      const was = this.savedIds.has(id)
      if (was) this.savedIds.delete(id)
      else this.savedIds.add(id)
      try {
        const { data } = await api.post(`/favorites/${id}/toggle`)
        if (data.saved) this.savedIds.add(id)
        else this.savedIds.delete(id)
      } catch {
        // revert on failure
        if (was) this.savedIds.add(id)
        else this.savedIds.delete(id)
      }
    },
  },
})
