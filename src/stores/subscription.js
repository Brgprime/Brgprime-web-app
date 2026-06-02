import { defineStore } from 'pinia'

// ── Plan catalogue ──────────────────────────────────────────────────────────
// Ordered by ascending monthly price, exactly as defined by BRG.
export const PLANS = [
  {
    id:       'free',
    name:     'Free Plan',
    price:    0,
    listings: 3,
    premium:  0,
    boosts:   0,
    leads:    false,
    tagline:  'Get started — list up to 3 properties',
    features: [
      'Up to 3 property listings',
      'Standard search placement',
      'In-app messaging',
      'Basic property search',
    ],
  },
  {
    id:       'silver',
    name:     'Silver Plan',
    price:    18000,
    listings: 55,
    premium:  10,
    boosts:   5,
    leads:    true,
    popular:  true,
    tagline:  'For active landlords and agents',
    features: [
      'Up to 55 listings',
      '10 premium listings',
      '5 listing boosts',
      'Unlimited property requests (leads)',
      'Priority support',
    ],
  },
  {
    id:       'bronze',
    name:     'Bronze Plan',
    price:    40000,
    listings: 260,
    premium:  50,
    boosts:   30,
    leads:    true,
    tagline:  'For growing real estate businesses',
    features: [
      'Up to 260 listings',
      '50 premium listings',
      '30 listing boosts',
      'Unlimited property requests (leads)',
      'Priority support',
    ],
  },
  {
    id:       'gold',
    name:     'Gold Plan',
    price:    64000,
    listings: 520,
    premium:  100,
    boosts:   55,
    leads:    true,
    tagline:  'For agencies operating at scale',
    features: [
      'Up to 520 listings',
      '100 premium listings',
      '55 listing boosts',
      'Unlimited property requests (leads)',
      'Dedicated account manager',
    ],
  },
]

export const getPlan = (id) => PLANS.find(p => p.id === id) || PLANS[0]

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    planId:      localStorage.getItem('sub_plan') || 'free',
    premiumUsed: parseInt(localStorage.getItem('sub_premium_used') || '0'),
    boostsUsed:  parseInt(localStorage.getItem('sub_boosts_used') || '0'),
    renewsAt:    localStorage.getItem('sub_renews_at') || null,
    history:     JSON.parse(localStorage.getItem('sub_history') || '[]'),
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
    // Switch to a plan (after successful payment for paid plans).
    subscribe(planId) {
      const plan = getPlan(planId)
      this.planId      = plan.id
      this.premiumUsed = 0
      this.boostsUsed  = 0
      this.renewsAt    = plan.price > 0
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null
      if (plan.price > 0) {
        this.history.unshift({
          plan:   plan.name,
          amount: plan.price,
          date:   new Date().toISOString(),
        })
      }
      this._persist()
    },
    // True if the user can still publish another listing on their plan.
    canPostListing(currentCount) {
      return currentCount < this.listingLimit
    },
    usePremium() {
      if (this.premiumRemaining <= 0) return false
      this.premiumUsed++
      this._persist()
      return true
    },
    useBoost() {
      if (this.boostsRemaining <= 0) return false
      this.boostsUsed++
      this._persist()
      return true
    },
    _persist() {
      localStorage.setItem('sub_plan', this.planId)
      localStorage.setItem('sub_premium_used', String(this.premiumUsed))
      localStorage.setItem('sub_boosts_used', String(this.boostsUsed))
      if (this.renewsAt) localStorage.setItem('sub_renews_at', this.renewsAt)
      else localStorage.removeItem('sub_renews_at')
      localStorage.setItem('sub_history', JSON.stringify(this.history.slice(0, 50)))
    },
  },
})
