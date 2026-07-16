<template>
  <AppLayout>
    <div class="page-pad pb-10">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-extrabold text-secondary mb-2">Choose Your Plan</h2>
        <p class="text-brand-muted text-sm mb-5">Scale your real estate business with the right tools</p>
        <!-- Billing toggle -->
        <div class="inline-flex items-center gap-2 bg-brand-bg border border-brand-border rounded-full p-1">
          <button
            @click="annual = false"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            :class="!annual ? 'bg-white text-secondary shadow-sm' : 'text-brand-muted'"
          >Monthly</button>
          <button
            @click="annual = true"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5"
            :class="annual ? 'bg-white text-secondary shadow-sm' : 'text-brand-muted'"
          >Annual <span class="badge bg-success text-white text-[10px]">Save 20%</span></button>
        </div>
      </div>

      <!-- Current plan usage -->
      <div class="card p-5 mb-6 navy-gradient relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Current Plan</p>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-extrabold text-white">{{ subStore.plan.name }}</span>
                <span v-if="subStore.isPaid" class="badge bg-white/15 text-white text-[10px]">Active</span>
              </div>
              <p v-if="subStore.renewsAt" class="text-white/40 text-xs mt-1">Renews {{ formatDate(subStore.renewsAt) }}</p>
            </div>
            <div class="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <component :is="iconFor(subStore.planId)" :size="26" class="text-white" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-white/10 rounded-lg p-3">
              <div class="text-white text-lg font-extrabold leading-none">{{ myCount }}<span class="text-white/40 text-sm font-semibold">/{{ subStore.listingLimit }}</span></div>
              <div class="text-white/50 text-[11px] mt-1">Listings used</div>
            </div>
            <div class="bg-white/10 rounded-lg p-3">
              <div class="text-white text-lg font-extrabold leading-none">{{ subStore.premiumRemaining }}<span class="text-white/40 text-sm font-semibold">/{{ subStore.premiumLimit }}</span></div>
              <div class="text-white/50 text-[11px] mt-1">Premium left</div>
            </div>
            <div class="bg-white/10 rounded-lg p-3">
              <div class="text-white text-lg font-extrabold leading-none">{{ subStore.boostsRemaining }}<span class="text-white/40 text-sm font-semibold">/{{ subStore.boostLimit }}</span></div>
              <div class="text-white/50 text-[11px] mt-1">Boosts left</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="plan in plans" :key="plan.id"
          class="card p-6 relative flex flex-col"
          :class="plan.popular ? 'border-2 border-primary ring-2 ring-primary/20' : ''"
        >
          <div class="mb-5">
            <div class="w-12 h-12 rounded-md flex items-center justify-center mb-3" :class="plan.iconBg">
              <component :is="plan.icon" :size="22" :class="plan.iconColor" />
            </div>
            <h3 class="text-lg font-extrabold text-secondary">{{ plan.name }}</h3>
            <p class="text-xs text-brand-muted mt-0.5 mb-2 leading-snug">{{ plan.tagline }}</p>
            <div class="mt-1">
              <template v-if="plan.price > 0">
                <span class="text-2xl font-extrabold text-primary">₦{{ displayPrice(plan).toLocaleString() }}</span>
                <span class="text-brand-muted text-sm">/{{ annual ? 'mo, billed annually' : 'month' }}</span>
              </template>
              <template v-else>
                <span class="text-2xl font-extrabold text-primary">₦0</span>
                <span class="text-brand-muted text-sm">/month</span>
              </template>
            </div>
          </div>

          <ul class="space-y-2.5 flex-1 mb-6">
            <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-2 text-sm">
              <CheckCircle2 :size="15" class="text-success flex-shrink-0 mt-0.5" />
              <span class="text-brand-muted">{{ feat }}</span>
            </li>
          </ul>

          <button
            class="w-full"
            :class="plan.id === subStore.planId ? 'btn-secondary opacity-60 cursor-default' : (plan.popular ? 'btn-primary' : 'btn-secondary')"
            :disabled="plan.id === subStore.planId"
            @click="choose(plan)"
          >
            {{ ctaLabel(plan) }}
          </button>
        </div>
      </div>

      <!-- Cross-plan benefits -->
      <div class="card p-6 mt-6">
        <h3 class="font-bold text-secondary mb-4">What you get across all paid plans</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="b in crossBenefits" :key="b.title" class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0" :class="b.bg">
              <component :is="b.icon" :size="17" :class="b.color" />
            </div>
            <div>
              <div class="text-sm font-semibold text-secondary">{{ b.title }}</div>
              <div class="text-xs text-brand-muted mt-0.5">{{ b.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="mt-10">
        <h3 class="text-lg font-bold text-secondary mb-4">Frequently Asked Questions</h3>
        <div class="space-y-3">
          <div v-for="faq in faqs" :key="faq.q" class="card p-4">
            <button class="w-full flex items-center justify-between text-left" @click="faq.open = !faq.open">
              <span class="font-semibold text-secondary text-sm">{{ faq.q }}</span>
              <ChevronDown :size="16" class="text-brand-muted transition-transform" :class="faq.open ? 'rotate-180' : ''" />
            </button>
            <p v-if="faq.open" class="mt-2 text-brand-muted text-sm leading-relaxed">{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </div>

    <PaystackModal
      :show="showModal"
      :bundle="checkoutBundle"
      @close="showModal = false"
      @success="onPaymentSuccess"
    />
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import PaystackModal from '@/components/PaystackModal.vue'
import { useSubscriptionStore, PLANS } from '@/stores/subscription'
import { usePropertyStore } from '@/stores/property'
import { useToastStore } from '@/stores/toast'
import {
  CheckCircle2, ChevronDown, Sparkles, Star, Award, Crown,
  ArrowUpNarrowWide, Rocket, Inbox, Building2,
} from 'lucide-vue-next'

const subStore  = useSubscriptionStore()
const propStore = usePropertyStore()
const toast     = useToastStore()
const route     = useRoute()
const router    = useRouter()

const annual = ref(false)

const myCount = computed(() => propStore.myListings.length)

const iconMeta = {
  free:   { icon: Sparkles, iconBg: 'bg-brand-bg',     iconColor: 'text-brand-muted' },
  silver: { icon: Star,     iconBg: 'bg-primary/10',   iconColor: 'text-primary'     },
  bronze: { icon: Award,    iconBg: 'bg-warning/10',   iconColor: 'text-warning'     },
  gold:   { icon: Crown,    iconBg: 'bg-secondary/10', iconColor: 'text-secondary'   },
}

const iconFor = (id) => (iconMeta[id] || iconMeta.free).icon

const plans = PLANS.map(p => ({ ...p, ...iconMeta[p.id] }))

// Annual = 20% off the monthly rate (billed once a year).
const displayPrice = (plan) => annual.value ? Math.round(plan.price * 0.8) : plan.price

const planRank = (id) => PLANS.findIndex(p => p.id === id)

const ctaLabel = (plan) => {
  if (plan.id === subStore.planId) return 'Current Plan'
  if (plan.id === 'free')          return 'Downgrade'
  return planRank(plan.id) > planRank(subStore.planId) ? 'Upgrade' : 'Switch Plan'
}

const crossBenefits = [
  { title: 'Multiple property listings', desc: 'List dozens to hundreds of properties at once', icon: Building2, bg: 'bg-primary/10', color: 'text-primary' },
  { title: 'Premium listings',           desc: 'Appear at the top of search results',           icon: ArrowUpNarrowWide, bg: 'bg-warning/10', color: 'text-warning' },
  { title: 'Listing boosts',             desc: 'Extra visibility for your best properties',      icon: Rocket, bg: 'bg-success/10', color: 'text-success' },
  { title: 'Unlimited property requests',desc: 'Full access to buyer & tenant leads',            icon: Inbox, bg: 'bg-secondary/10', color: 'text-secondary' },
]

const showModal      = ref(false)
const checkoutBundle = ref(null)
const pendingPlan    = ref(null)

const choose = async (plan) => {
  if (plan.id === subStore.planId) return
  const billing = annual.value ? 'annual' : 'monthly'

  // Free plan needs no payment.
  if (plan.price === 0) {
    try {
      await subStore.subscribe('free')
      toast.success('You are now on the Free Plan.')
    } catch (e) { toast.error(e.message) }
    return
  }

  // Real Paystack available → redirect to secure checkout.
  if (subStore.paystackEnabled) {
    try {
      const { authorizationUrl } = await subStore.initializePaystack(plan.id, billing)
      window.location.href = authorizationUrl
    } catch (e) {
      toast.error(e.message || 'Could not start checkout.')
    }
    return
  }

  // Dev fallback (no Paystack keys) → simulated modal.
  pendingPlan.value = plan
  const price = displayPrice(plan) * (annual.value ? 12 : 1)
  checkoutBundle.value = {
    name:        `${plan.name}${annual.value ? ' (Annual)' : ''}`,
    price,
    descriptor:  annual.value ? '12 months' : 'Monthly subscription',
    successText: `${plan.name} activated.`,
  }
  showModal.value = true
}

const onPaymentSuccess = async () => {
  const plan = pendingPlan.value
  showModal.value = false
  try {
    await subStore.subscribe(plan.id, annual.value ? 'annual' : 'monthly')
    toast.success(`${plan?.name} activated — enjoy your new plan!`)
  } catch (e) {
    toast.error(e.message)
  }
  pendingPlan.value = null
}

// Load subscription + Paystack availability; handle return from Paystack checkout.
onMounted(async () => {
  subStore.fetch()
  subStore.fetchPaystackConfig()
  const ref = route.query.reference || route.query.trxref
  if (ref) {
    try {
      await subStore.verifyPaystack(ref)
      toast.success('Payment confirmed — your plan is now active!')
    } catch (e) {
      toast.error(e.message || 'Could not verify payment.')
    }
    router.replace({ query: {} })
  }
})

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const faqs = reactive([
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan at any time. Upgrades take effect immediately; downgrades take effect at the end of your billing cycle.', open: false },
  { q: 'What are premium listings and boosts?', a: 'Premium listings appear at the top of search results, while boosts give a property extra visibility across the platform. Each paid plan includes a monthly allowance of both.', open: false },
  { q: 'What happens if I reach my listing limit?', a: 'You can either remove an existing listing or upgrade to a higher plan with a larger listing allowance.', open: false },
  { q: 'How are payments processed?', a: 'We accept bank transfers, card payments via Paystack, and USSD. All payments are processed securely.', open: false },
])
</script>
