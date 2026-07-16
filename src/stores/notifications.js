import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [],
    unread: 0,
    loaded: false,
  }),
  actions: {
    async fetch() {
      try {
        const res = await api.get('/notifications')
        this.items = res.data
        this.unread = res.meta?.unread ?? this.items.filter((n) => !n.read).length
        this.loaded = true
      } catch { /* not logged in */ }
    },
    async markRead(id) {
      const n = this.items.find((x) => x.id === id)
      if (!n || n.read) return
      n.read = true
      this.unread = Math.max(0, this.unread - 1)
      try { await api.patch(`/notifications/${id}/read`) } catch { /* keep optimistic */ }
    },
    async markAllRead() {
      this.items.forEach((n) => { n.read = true })
      this.unread = 0
      try { await api.post('/notifications/read-all') } catch { /* keep optimistic */ }
    },
  },
})
