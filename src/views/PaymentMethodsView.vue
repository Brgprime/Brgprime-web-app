<template>
  <AppLayout>
    <div class="page-pad pb-10 space-y-5">
      <!-- Saved Cards -->
      <div>
        <h3 class="section-title">Saved Payment Methods</h3>
        <div class="space-y-3">
          <div v-for="card in cards" :key="card.id" class="card p-4 flex items-center gap-4">
            <div class="w-12 h-8 rounded flex items-center justify-center" :class="card.type === 'visa' ? 'bg-blue-600' : 'bg-red-500'">
              <span class="text-white text-xs font-bold uppercase">{{ card.type }}</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-secondary text-sm">•••• •••• •••• {{ card.last4 }}</div>
              <div class="text-xs text-brand-muted">Expires {{ card.expiry }}</div>
            </div>
            <button @click="removeCard(card.id)" class="text-brand-muted hover:text-danger transition-colors">
              <Trash2 :size="16" />
            </button>
          </div>
          <div v-if="!cards.length" class="card p-8 text-center">
            <CreditCard :size="28" class="text-brand-light mx-auto mb-2" />
            <p class="text-brand-muted text-sm">No payment methods saved</p>
          </div>
        </div>
      </div>

      <!-- Add New Card -->
      <div class="card p-5">
        <h3 class="font-bold text-secondary mb-4">Add Payment Method</h3>
        <form @submit.prevent="addCard" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Card Number</label>
            <input v-model="newCard.number" class="input-field" placeholder="1234 5678 9012 3456" maxlength="19" @input="formatCardNum" />
          </div>
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-secondary mb-1.5">Expiry</label>
              <input v-model="newCard.expiry" class="input-field" placeholder="MM/YY" maxlength="5" />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-semibold text-secondary mb-1.5">CVV</label>
              <input v-model="newCard.cvv" class="input-field" placeholder="123" maxlength="3" type="password" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Cardholder Name</label>
            <input v-model="newCard.name" class="input-field" placeholder="Tunde Adeyemi" />
          </div>
          <button type="submit" class="btn-primary w-full">Add Card</button>
        </form>
      </div>

      <!-- Bank Transfer -->
      <div class="card p-5">
        <h3 class="font-bold text-secondary mb-3">Bank Transfer Details</h3>
        <div class="bg-brand-bg rounded-md p-4 space-y-2">
          <div class="flex items-center justify-between gap-2 text-sm">
            <span class="text-brand-muted flex-shrink-0">Bank</span>
            <span class="font-semibold text-secondary text-right">First Bank of Nigeria</span>
          </div>
          <div class="flex items-center justify-between gap-2 text-sm">
            <span class="text-brand-muted flex-shrink-0">Account Name</span>
            <span class="font-semibold text-secondary text-right">BRG Prime Ltd</span>
          </div>
          <div class="flex items-center justify-between gap-2 text-sm">
            <span class="text-brand-muted flex-shrink-0">Account No.</span>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-secondary">3012345678</span>
              <button class="text-primary hover:underline text-xs">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { CreditCard, Trash2 } from 'lucide-vue-next'

// Locally-added cards for this session (no card details are stored server-side).
const cards = ref([])

const newCard = reactive({ number: '', expiry: '', cvv: '', name: '' })

const formatCardNum = () => {
  newCard.number = newCard.number.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
}

const addCard = () => {
  if (!newCard.number || !newCard.expiry || !newCard.cvv) return
  cards.value.push({ id: Date.now(), type: 'visa', last4: newCard.number.replace(/\s/g, '').slice(-4), expiry: newCard.expiry })
  Object.assign(newCard, { number: '', expiry: '', cvv: '', name: '' })
}

const removeCard = (id) => cards.value = cards.value.filter(c => c.id !== id)
</script>
