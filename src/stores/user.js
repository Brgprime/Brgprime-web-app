import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name:            localStorage.getItem('user_name')   || 'Tunde Adeyemi',
    email:           localStorage.getItem('user_email')  || 'tunde@example.com',
    phone:           localStorage.getItem('user_phone')  || '08012345678',
    bio:             localStorage.getItem('user_bio')    || 'Real estate enthusiast based in Nigeria.',
    profileImageUrl: localStorage.getItem('user_avatar') || 'https://i.pravatar.cc/150?u=brgprime',
    token:           localStorage.getItem('user_token')  || null,
    joinDate:        localStorage.getItem('user_joinDate') || new Date().toISOString(),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    initials:   (state) => state.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
  },
  actions: {
    login(userData) {
      this.name  = userData.name  || this.name
      this.email = userData.email || this.email
      this.phone = userData.phone || this.phone
      this.token = userData.token || 'mock_token_' + Date.now()
      if (!localStorage.getItem('user_joinDate')) {
        this.joinDate = new Date().toISOString()
      }
      this._persist()
    },
    logout() {
      this.token = null
      ;['user_token', 'user_name', 'user_email', 'user_phone', 'user_bio', 'user_avatar'].forEach(k => localStorage.removeItem(k))
    },
    updateProfile(data) {
      Object.assign(this, data)
      this._persist()
    },
    _persist() {
      localStorage.setItem('user_token',    this.token || '')
      localStorage.setItem('user_name',     this.name)
      localStorage.setItem('user_email',    this.email)
      localStorage.setItem('user_phone',    this.phone)
      localStorage.setItem('user_bio',      this.bio)
      localStorage.setItem('user_avatar',   this.profileImageUrl)
      localStorage.setItem('user_joinDate', this.joinDate)
    },
  },
})
