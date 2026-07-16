<template>
  <AppLayout>
    <div class="page-pad pb-10">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div v-for="s in summary" :key="s.label" class="card p-4 text-center">
          <div class="text-lg font-extrabold" :class="s.color">{{ s.value }}</div>
          <div class="text-xs text-brand-muted mt-1">{{ s.label }}</div>
        </div>
      </div>

      <!-- Payments Table / List -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="section-title mb-0">Payment History</h3>
        <button @click="showRecord = true" class="btn-primary px-4 py-2 text-sm">+ Record Payment</button>
      </div>

      <div v-if="payments.length" class="card overflow-hidden">
        <div class="divide-y divide-brand-border-light">
          <div v-for="p in payments" :key="p.id" class="flex items-center gap-4 px-5 py-4 hover:bg-brand-bg transition-colors">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="statusBg(p.status)">
              <component :is="statusIcon(p.status)" :size="16" :class="statusColor(p.status)" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-secondary text-sm">{{ p.name }}</div>
              <div class="text-xs text-brand-muted">{{ p.property }} · {{ p.date }}</div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="font-bold text-secondary">{{ p.amount }}</div>
              <span class="badge text-xs" :class="statusBadge(p.status)">{{ p.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <div class="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard :size="32" class="text-brand-light" />
        </div>
        <h3 class="font-bold text-secondary text-lg mb-2">No Payments Yet</h3>
        <p class="text-brand-muted text-sm mb-6">Record a payment to track your transactions here.</p>
        <button @click="showRecord = true" class="btn-primary inline-block px-8">Record Payment</button>
      </div>
    </div>

    <!-- Record Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showRecord" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-secondary/60" @click.self="showRecord = false">
          <div class="bg-white rounded-lg w-full max-w-md p-6">
            <h3 class="font-bold text-secondary mb-4">Record Payment</h3>
            <form @submit.prevent="addPayment" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-secondary mb-1.5">Tenant Name</label>
                <input v-model="newPay.name" class="input-field" placeholder="Adebayo Okafor" required />
              </div>
              <div>
                <label class="block text-xs font-semibold text-secondary mb-1.5">Property</label>
                <input v-model="newPay.property" class="input-field" placeholder="Modern Apartment, Lekki" required />
              </div>
              <div class="flex gap-3">
                <div class="flex-1">
                  <label class="block text-xs font-semibold text-secondary mb-1.5">Amount (₦)</label>
                  <input
                    :value="newPay.amount ? Number(newPay.amount).toLocaleString('en-NG') : ''"
                    @input="e => { const d = e.target.value.replace(/\D/g,''); newPay.amount = d; e.target.value = d ? parseInt(d).toLocaleString('en-NG') : '' }"
                    type="text" inputmode="numeric"
                    class="input-field" placeholder="2,500,000" required
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-xs font-semibold text-secondary mb-1.5">Status</label>
                  <select v-model="newPay.status" class="input-field">
                    <option>Paid</option><option>Pending</option><option>Overdue</option><option>Partial</option>
                  </select>
                </div>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showRecord = false" class="btn-secondary flex-1">Cancel</button>
                <button type="submit" class="btn-primary flex-1">Save</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/lib/api'
import AppLayout from '@/components/AppLayout.vue'
import { useToastStore } from '@/stores/toast'
import { CreditCard, CheckCircle2, Clock, AlertCircle, MinusCircle } from 'lucide-vue-next'

const toast = useToastStore()
const showRecord = ref(false)
const newPay = reactive({ name: '', property: '', amount: '', status: 'Paid' })

const payments = ref([])
const totals = ref({ received: 0, pending: 0, overdue: 0, thisMonth: 0 })

const fmtMoney = (n) => {
  if (n >= 1e9) return `₦${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `₦${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `₦${(n / 1e3).toFixed(0)}k`
  return `₦${Number(n || 0).toLocaleString('en-NG')}`
}
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const mapRow = (p) => ({
  id: p.id,
  name: p.tenantName,
  property: p.property,
  date: fmtDate(p.date),
  amount: `₦${Number(p.amount).toLocaleString('en-NG')}`,
  status: p.status,
})

const summary = computed(() => [
  { label: 'Total Received', value: fmtMoney(totals.value.received), color: 'text-success' },
  { label: 'Pending', value: fmtMoney(totals.value.pending), color: 'text-warning' },
  { label: 'Overdue', value: fmtMoney(totals.value.overdue), color: 'text-danger' },
  { label: 'This Month', value: fmtMoney(totals.value.thisMonth), color: 'text-primary' },
])

const load = async () => {
  const res = await api.get('/payments')
  payments.value = res.data.map(mapRow)
  totals.value = res.meta?.summary ?? totals.value
}

onMounted(() => { load().catch(() => {}) })

const addPayment = async () => {
  try {
    await api.post('/payments', {
      tenantName: newPay.name,
      property: newPay.property,
      amount: Number(newPay.amount),
      status: newPay.status,
    })
    Object.assign(newPay, { name: '', property: '', amount: '', status: 'Paid' })
    showRecord.value = false
    await load()
    toast.success('Payment recorded.')
  } catch (e) {
    toast.error(e.message || 'Could not record payment.')
  }
}

const statusIcon = (s) => ({ Paid: CheckCircle2, Pending: Clock, Overdue: AlertCircle, Partial: MinusCircle }[s] || Clock)
const statusColor = (s) => ({ Paid: 'text-success', Pending: 'text-warning', Overdue: 'text-danger', Partial: 'text-primary' }[s])
const statusBg = (s) => ({ Paid: 'bg-success/10', Pending: 'bg-warning/10', Overdue: 'bg-danger/10', Partial: 'bg-primary/10' }[s])
const statusBadge = (s) => ({ Paid: 'bg-success/10 text-success', Pending: 'bg-warning/10 text-warning', Overdue: 'bg-danger/10 text-danger', Partial: 'bg-primary/10 text-primary' }[s])
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
