<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4"
        @click.self="$emit('close')"
      >
        <Transition name="slide-up">
          <div v-if="show" class="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">

            <!-- Paystack Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md flex items-center justify-center" style="background:#00C3F7">
                  <span class="text-white font-extrabold text-xs">P</span>
                </div>
                <div>
                  <div class="text-sm font-bold text-gray-800">Paystack</div>
                  <div class="text-xs text-gray-400">Secure Payment</div>
                </div>
              </div>
              <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X :size="14" class="text-gray-500" />
              </button>
            </div>

            <!-- Amount Banner -->
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <p class="text-xs text-gray-500 mb-0.5">{{ bundle?.name }}</p>
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-extrabold text-gray-900">₦{{ formatPrice(bundle?.price) }}</span>
                <span v-if="descriptor" class="text-sm text-gray-400">· {{ descriptor }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">brgprime.com</p>
            </div>

            <div v-if="!paid" class="px-6 py-5 space-y-4">
              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  v-model="payForm.email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C3F7] focus:ring-2 focus:ring-[#00C3F7]/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <!-- Card Number -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1.5">Card Number</label>
                <div class="relative">
                  <input
                    v-model="payForm.card"
                    type="text"
                    inputmode="numeric"
                    maxlength="19"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C3F7] focus:ring-2 focus:ring-[#00C3F7]/20 transition-all pr-14"
                    placeholder="0000 0000 0000 0000"
                    @input="formatCard"
                  />
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <div class="w-6 h-4 bg-red-500 rounded-sm opacity-80"></div>
                    <div class="w-6 h-4 bg-yellow-400 rounded-sm opacity-80 -ml-3"></div>
                  </div>
                </div>
              </div>

              <!-- Expiry + CVV -->
              <div class="flex gap-3">
                <div class="flex-1">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Expiry Date</label>
                  <input
                    v-model="payForm.expiry"
                    type="text"
                    maxlength="5"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C3F7] focus:ring-2 focus:ring-[#00C3F7]/20 transition-all"
                    placeholder="MM/YY"
                    @input="formatExpiry"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">CVV</label>
                  <input
                    v-model="payForm.cvv"
                    type="text"
                    inputmode="numeric"
                    maxlength="3"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C3F7] focus:ring-2 focus:ring-[#00C3F7]/20 transition-all"
                    placeholder="123"
                  />
                </div>
              </div>

              <p v-if="payError" class="text-red-500 text-xs bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{{ payError }}</p>

              <!-- Pay Button -->
              <button
                @click="handlePay"
                class="w-full py-3.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style="background: linear-gradient(135deg, #00C3F7 0%, #0099CC 100%)"
                :disabled="paying"
              >
                <Loader2 v-if="paying" :size="16" class="animate-spin" />
                <Lock v-else :size="14" />
                {{ paying ? 'Processing...' : `Pay ₦${formatPrice(bundle?.price)}` }}
              </button>

              <div class="flex items-center justify-center gap-2 text-gray-400">
                <ShieldCheck :size="12" />
                <span class="text-[11px]">Secured by Paystack · SSL Encrypted</span>
              </div>
            </div>

            <!-- Success State -->
            <div v-else class="px-6 py-8 text-center">
              <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 :size="36" class="text-green-500" />
              </div>
              <h3 class="text-lg font-extrabold text-gray-900 mb-1">Payment Successful!</h3>
              <p class="text-gray-500 text-sm mb-1">{{ bundle?.successText || `${bundle?.name} activated.` }}</p>
              <p class="text-gray-400 text-xs">You're all set — enjoy your new plan.</p>
              <button
                @click="$emit('success', bundle)"
                class="mt-5 w-full py-3 rounded-lg text-white font-bold text-sm"
                style="background: linear-gradient(135deg, #00C3F7 0%, #0099CC 100%)"
              >
                Continue
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { X, Lock, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  show:   { type: Boolean, default: false },
  bundle: { type: Object, default: null },
})
const emit = defineEmits(['close', 'success'])

const userStore = useUserStore()

// Short line shown beside the amount — supports both subscriptions and any
// legacy "post credits" style bundle.
const descriptor = computed(() =>
  props.bundle?.descriptor || (props.bundle?.posts ? `${props.bundle.posts} post credits` : '')
)

const paying   = ref(false)
const paid     = ref(false)
const payError = ref('')

const payForm = reactive({
  email:  userStore.email || '',
  card:   '',
  expiry: '',
  cvv:    '',
})

watch(() => props.show, (val) => {
  if (!val) {
    paying.value   = false
    paid.value     = false
    payError.value = ''
    payForm.card   = ''
    payForm.expiry = ''
    payForm.cvv    = ''
  }
})

const formatPrice = (n) => n ? n.toLocaleString() : '0'

const formatCard = (e) => {
  let v = e.target.value.replace(/\D/g, '').substring(0, 16)
  payForm.card = v.replace(/(.{4})/g, '$1 ').trim()
}

const formatExpiry = (e) => {
  let v = e.target.value.replace(/\D/g, '').substring(0, 4)
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2)
  payForm.expiry = v
}

const handlePay = async () => {
  payError.value = ''
  if (!payForm.email) { payError.value = 'Email is required.'; return }
  if (payForm.card.replace(/\s/g, '').length < 16) { payError.value = 'Enter a valid 16-digit card number.'; return }
  if (payForm.expiry.length < 5) { payError.value = 'Enter a valid expiry date.'; return }
  if (payForm.cvv.length < 3)    { payError.value = 'Enter a valid CVV.'; return }

  paying.value = true
  await new Promise(r => setTimeout(r, 2200))
  paying.value = false
  paid.value   = true
}
</script>
