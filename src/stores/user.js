import { defineStore } from 'pinia'
import api, { setToken, getToken } from '@/lib/api'

const ls = (k, d = '') => localStorage.getItem(k) || d

export const useUserStore = defineStore('user', {
  state: () => ({
    id:              ls('user_id') || null,
    name:            ls('user_name'),
    email:           ls('user_email'),
    phone:           ls('user_phone'),
    bio:             ls('user_bio'),
    profileImageUrl: ls('user_avatar', 'https://i.pravatar.cc/150?u=brgprime'),
    role:            ls('user_role', 'user'),
    token:           getToken(),
    joinDate:        ls('user_joinDate') || new Date().toISOString(),
    subscription:    JSON.parse(ls('user_subscription', 'null')),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin:    (state) => state.role === 'admin',
    initials:   (state) =>
      (state.name || '')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
  },

  actions: {
    // ── Auth ────────────────────────────────────────────────────────────
    async login({ email, password }) {
      const { data } = await api.post('/auth/login', { email, password })
      this._setSession(data.token, data.user)
      return data.user
    },

    // Returns { requiresVerification, devOtp? } — no token until OTP verified.
    async register(payload) {
      const { data } = await api.post('/auth/register', payload)
      return data
    },

    async verifyOtp({ email, code }) {
      const { data } = await api.post('/auth/verify-otp', { email, code })
      this._setSession(data.token, data.user)
      return data.user
    },

    async resendOtp(email) {
      const { data } = await api.post('/auth/resend-otp', { email })
      return data
    },

    // Refresh the current user from the server (call on app boot if a token exists).
    async fetchMe() {
      if (!this.token) return null
      try {
        const { data } = await api.get('/auth/me')
        this._apply(data.user)
        this._persist()
        return data.user
      } catch (e) {
        if (e.status === 401) this.logout()
        return null
      }
    },

    async updateProfile(data) {
      const res = await api.patch('/users/me', data)
      this._apply(res.data.user)
      this._persist()
      return res.data.user
    },

    logout() {
      this.token = null
      setToken(null)
      ;['user_id', 'user_name', 'user_email', 'user_phone', 'user_bio',
        'user_avatar', 'user_role', 'user_subscription'].forEach((k) =>
        localStorage.removeItem(k)
      )
    },

    // ── Internals ───────────────────────────────────────────────────────
    _setSession(token, user) {
      this.token = token
      setToken(token)
      this._apply(user)
      this._persist()
    },

    _apply(user) {
      if (!user) return
      this.id = user.id ?? this.id
      this.name = user.name ?? this.name
      this.email = user.email ?? this.email
      this.phone = user.phone ?? this.phone
      this.bio = user.bio ?? this.bio
      this.profileImageUrl = user.profileImageUrl || user.avatarUrl || this.profileImageUrl
      this.role = user.role ?? this.role
      this.joinDate = user.joinDate || this.joinDate
      if (user.subscription) this.subscription = user.subscription
    },

    _persist() {
      localStorage.setItem('user_id', this.id || '')
      localStorage.setItem('user_name', this.name || '')
      localStorage.setItem('user_email', this.email || '')
      localStorage.setItem('user_phone', this.phone || '')
      localStorage.setItem('user_bio', this.bio || '')
      localStorage.setItem('user_avatar', this.profileImageUrl || '')
      localStorage.setItem('user_role', this.role || 'user')
      localStorage.setItem('user_joinDate', this.joinDate || '')
      if (this.subscription) {
        localStorage.setItem('user_subscription', JSON.stringify(this.subscription))
      }
    },
  },
})
