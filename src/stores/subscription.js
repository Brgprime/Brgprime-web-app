import { defineStore } from 'pinia'
import api from '@/lib/api'

// ── Plan catalogue ──────────────────────────────────────────────────────────
// Kept in sync with the backend (src/config/plans.js). Exported for the UI.
export const PLANS = [
  {
    id: 'free', name: 'Free Plan', price: 0, listings: 3, premium: 0, boosts: 0, leads: false,
    tagline: 'Get started — list up to 3 properties',
    features: ['Up to 3 property listings', 'Standard search placement', 'In-app messaging', 'Basic property search'],
  },
  {
    id: 'silver', name: 'Silver Plan', price: 18000, listings: 55, premium: 10, boosts: 5, leads: true, popular: true,
    tagline: 'For active landlords and agents',
    features: ['Up to 55 listings', '10 premium listings', '5 listing boosts', 'Unlimited property requests (leads)', 'Priority support'],
  },
  {
    id: 'bronze', name: 'Bronze Plan', price: 40000, listings: 260, premium: 50, boosts: 30, leads: true,
    tagline: 'For growing real estate businesses',
    features: ['Up to 260 listings', '50 premium listings', '30 listing boosts', 'Unlimited property requests (leads)', 'Priority support'],
  },
  {
    id: 'gold', name: 'Gold Plan', price: 64000, listings: 520, premium: 100, boosts: 55, leads: true,
    tagline: 'For agencies operating at scale',
    features: ['Up to 520 listings', '100 premium listings', '55 listing boosts', 'Unlimited property requests (leads)', 'Dedicated account manager'],
  },
]

export const getPlan = (id) => PLANS.find((p) => p.id === id) || PLANS[0]

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    planId: 'free',
    premiumUsed: 0,
    boostsUsed: 0,
    renewsAt: null,
    history: [],
    listingsUsed: 0,
    paystackEnabled: false,
    loaded: false,
  }),

  getters: {
    plan:             (s) => getPlan(s.planId),
    listingLimit:     (s) => getPlan(s.planId).listings,
    premiumLimit:     (s) => getPlan(s.planId).premium,
    boostLimit:       (s) => getPlan(s.planId).boosts,
    hasLeads:         (s) => getPlan(s.planId).leads,
    isPaid:           (s) => s.planId !== 'free',
    premiumRemaining: (s) => Math.max(0, getPlan(s.planId).premium - s.premiumUsed),
    boostsRemaining:  (s) => Math.max(0, getPlan(s.planId).boosts - s.boostsUsed),
  },

  actions: {
    async fetch() {
      try {
        const { data } = await api.get('/subscriptions/me')
        this._apply(data)
        this.loaded = true
      } catch { /* not logged in */ }
    },

    // Fetch whether real Paystack checkout is available (keys configured server-side).
    async fetchPaystackConfig() {
      try {
        const { data } = await api.get('/payments/paystack/config')
        this.paystackEnabled = !!data.enabled
      } catch { this.paystackEnabled = false }
    },

    // Free plan, or a paid plan in dev mode (no Paystack keys) — activate directly.
    async subscribe(planId, billing = 'monthly') {
      const { data } = await api.post('/subscriptions/subscribe', { planId, billing })
      this._apply(data)
      return data
    },

    // Real Paystack: start a checkout → returns { authorizationUrl, reference, ... }.
    async initializePaystack(planId, billing = 'monthly') {
      const { data } = await api.post('/payments/paystack/initialize', { planId, billing })
      return data
    },

    // Real Paystack: verify a completed payment and activate the plan.
    async verifyPaystack(reference) {
      const { data } = await api.get(`/payments/paystack/verify/${reference}`)
      this._apply(data)
      return data
    },

    canPostListing(currentCount) {
      return currentCount < this.listingLimit
    },

    _apply(s) {
      if (!s) return
      this.planId = s.planId ?? this.planId
      this.premiumUsed = s.premiumUsed ?? 0
      this.boostsUsed = s.boostsUsed ?? 0
      this.renewsAt = s.renewsAt ?? null
      if (Array.isArray(s.history)) this.history = s.history
      if (s.listingsUsed != null) this.listingsUsed = s.listingsUsed
    },
  },
})
