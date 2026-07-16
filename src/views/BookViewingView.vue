<template>
  <AppLayout>
    <div class="page-pad max-w-lg mx-auto pb-10">
      <div class="card p-6">

        <!-- Property Preview -->
        <div v-if="property" class="flex gap-4 mb-6 p-3.5 bg-brand-bg rounded-md border border-brand-border-light">
          <img
            :src="property.images[0]"
            class="w-18 h-14 rounded-md object-cover flex-shrink-0 shadow-sm"
            style="width: 4.5rem"
          />
          <div class="min-w-0 flex-1">
            <div class="font-bold text-secondary text-sm leading-snug truncate">{{ property.title }}</div>
            <div class="text-xs text-brand-muted flex items-center gap-1 mt-0.5">
              <MapPin :size="11" /> {{ property.address }}
            </div>
            <div class="text-primary font-extrabold text-sm mt-1.5">
              {{ formatPrice(property.price) }}<span v-if="priceSuffix" class="text-brand-light font-normal text-xs">{{ priceSuffix }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 mb-6">
          <div class="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
            <CalendarCheck :size="16" class="text-primary" />
          </div>
          <div>
            <h3 class="font-bold text-secondary leading-tight">Schedule a Viewing</h3>
            <p class="text-xs text-brand-muted">Select your preferred date and time</p>
          </div>
        </div>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Your Full Name <span class="text-danger">*</span></label>
            <input v-model="form.name" class="input-field" placeholder="Adebayo Okafor" required />
          </div>

          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Phone Number <span class="text-danger">*</span></label>
            <div class="flex gap-2">
              <span class="input-field w-16 text-center bg-brand-bg text-sm font-medium">+234</span>
              <input v-model="form.phone" class="input-field flex-1" placeholder="8012345678" required />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Email Address</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="you@example.com" />
          </div>

          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-secondary mb-1.5">Preferred Date <span class="text-danger">*</span></label>
              <input v-model="form.date" type="date" class="input-field" :min="minDate" required />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-semibold text-secondary mb-1.5">Preferred Time <span class="text-danger">*</span></label>
              <select v-model="form.time" class="input-field" required>
                <option value="">Select a time</option>
                <option v-for="t in timeSlots" :key="t">{{ t }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Message <span class="text-brand-light font-normal">(optional)</span></label>
            <textarea
              v-model="form.message"
              class="input-field resize-none"
              rows="3"
              placeholder="Any specific questions or requirements..."
            ></textarea>
          </div>

          <!-- Confirmation notice -->
          <div v-if="submitted" class="bg-success/10 border border-success/20 rounded-md p-4 flex items-start gap-3">
            <CheckCircle2 :size="20" class="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-success font-semibold text-sm">Viewing Booked!</p>
              <p class="text-success/80 text-xs mt-0.5">
                Scheduled for <strong>{{ form.date }}</strong> at <strong>{{ form.time }}</strong>.
                The agent will confirm your booking shortly.
              </p>
            </div>
          </div>

          <button
            type="submit"
            class="btn-primary w-full py-4 text-base font-bold"
            :disabled="loading || submitted"
          >
            <span v-if="!loading && !submitted" class="flex items-center justify-center gap-2">
              <CalendarCheck :size="17" /> Confirm Booking
            </span>
            <span v-else-if="loading" class="flex items-center justify-center gap-2">
              <Loader2 :size="16" class="animate-spin" /> Booking...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <CheckCircle2 :size="17" /> Booked!
            </span>
          </button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/lib/api'
import AppLayout from '@/components/AppLayout.vue'
import { usePropertyStore } from '@/stores/property'
import { useToastStore } from '@/stores/toast'
import { MapPin, CheckCircle2, Loader2, CalendarCheck } from 'lucide-vue-next'

const route     = useRoute()
const propStore = usePropertyStore()
const toast     = useToastStore()

const fetched   = ref(null)
const property  = computed(() => fetched.value || propStore.getById(route.query.id))
const loading   = ref(false)
const submitted = ref(false)

const form = reactive({ name: '', phone: '', email: '', date: '', time: '', message: '' })
const minDate   = new Date().toISOString().split('T')[0]
const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

onMounted(async () => {
  if (route.query.id) {
    try { fetched.value = await propStore.fetchById(route.query.id) } catch { /* fallback below */ }
  }
})

const submit = async () => {
  loading.value = true
  try {
    await api.post('/viewings', {
      propertyId: route.query.id,
      fullName: form.name,
      phone: form.phone.startsWith('0') ? form.phone : `0${form.phone}`,
      email: form.email,
      date: form.date,
      time: form.time,
      message: form.message,
    })
    submitted.value = true
    toast.success(`Viewing confirmed for ${form.date} at ${form.time}!`)
  } catch (e) {
    toast.error(e.message || 'Could not book the viewing.')
  } finally {
    loading.value = false
  }
}

const priceSuffix = computed(() => {
  const t = property.value?.listingType
  if (t === 'rent' || t === 'lease' || t === 'commercialRent') return '/yr'
  if (t === 'shortlet') return '/night'
  return ''
})

const formatPrice = (p) => {
  if (!p) return ''
  if (p >= 1e9) return `₦${(p / 1e9).toFixed(1)}B`
  if (p >= 1e6) return `₦${(p / 1e6).toFixed(1)}M`
  if (p >= 1e3) return `₦${(p / 1e3).toFixed(0)}k`
  return `₦${p.toLocaleString()}`
}
</script>
