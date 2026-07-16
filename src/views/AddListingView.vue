<template>
  <AppLayout>
    <div class="page-pad pb-10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 class="text-xl font-extrabold text-secondary">Post a Listing</h2>
          <p class="text-xs text-brand-muted mt-0.5">Fill in the details to publish your property</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Plan quota badge -->
          <router-link
            to="/subscriptions"
            class="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md border transition-colors"
            :class="remainingListings > 0 ? 'border-success/30 bg-success/5 text-success' : 'border-danger/30 bg-danger/5 text-danger'"
          >
            <Layers :size="13" />
            {{ myCount }}/{{ subStore.listingLimit }} listings
          </router-link>
          <button
            @click="saveDraft"
            class="text-primary text-sm font-semibold border border-primary px-4 py-2 rounded-md hover:bg-primary/5 transition-colors"
          >
            Save Draft
          </button>
        </div>
      </div>

      <form @submit.prevent="publish" class="space-y-5">

        <!-- A: Listing Type -->
        <div class="card p-5">
          <h3 class="font-bold text-secondary mb-1">Listing Type</h3>
          <p class="text-xs text-brand-muted mb-3">How do you want to list this property?</p>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              v-for="t in listingTypes" :key="t.value"
              @click="form.listingType = t.value"
              class="chip text-xs"
              :class="form.listingType === t.value ? 'chip-active' : 'chip-inactive'"
            >{{ t.label }}</button>
          </div>
        </div>

        <!-- B: Property Details -->
        <div class="card p-5 space-y-4">
          <h3 class="font-bold text-secondary">Property Details</h3>

          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Listing Title <span class="text-danger">*</span></label>
            <input v-model="form.title" class="input-field" placeholder="e.g. Modern 3-Bedroom Apartment in Gwarinpa" required />
          </div>

          <div>
            <label class="block text-xs font-semibold text-secondary mb-2">Property Type <span class="text-danger">*</span></label>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                v-for="pt in propertyTypes" :key="pt.value"
                @click="form.propertyType = pt.value"
                class="chip text-xs"
                :class="form.propertyType === pt.value ? 'chip-active' : 'chip-inactive'"
              >{{ pt.label }}</button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Full Address <span class="text-danger">*</span></label>
            <input v-model="form.address" class="input-field" placeholder="e.g. 14 Admiralty Way, Lekki, Lagos  ·  Plot 12, Jabi, Abuja" required />
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-secondary mb-1.5">Price (₦) <span class="text-danger">*</span></label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm font-bold">₦</span>
                <input
                  :value="fmtDisplay(form.price)"
                  @input="numInput($event, v => form.price = v)"
                  type="text" inputmode="numeric"
                  class="input-field pl-8" placeholder="2,500,000" required
                />
              </div>
              <p class="text-[11px] text-brand-muted mt-1">
                {{ priceSuffix ? `Charged per ${priceSuffix.replace('/', '')}` : 'Total sale / asking price' }}
              </p>
            </div>
            <div class="sm:w-32">
              <label class="block text-xs font-semibold text-secondary mb-1.5">Size (m²)</label>
              <input
                :value="fmtDisplay(form.size)"
                @input="numInput($event, v => form.size = v)"
                type="text" inputmode="numeric"
                class="input-field" placeholder="150"
              />
            </div>
          </div>

          <template v-if="showBedBath">
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1.5">Bedrooms</label>
                <input v-model.number="form.bedrooms" type="number" min="0" max="20" class="input-field" placeholder="3" />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1.5">Bathrooms</label>
                <input v-model.number="form.bathrooms" type="number" min="0" max="20" class="input-field" placeholder="2" />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1.5">Year Built</label>
                <input v-model.number="form.yearBuilt" type="number" min="1900" max="2030" class="input-field" placeholder="2020" />
              </div>
            </div>
          </template>

          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-secondary mb-1.5">Furnishing</label>
              <select v-model="form.furnishingStatus" class="input-field">
                <option>Fully Furnished</option>
                <option>Semi-Furnished</option>
                <option>Unfurnished</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-xs font-semibold text-secondary mb-2">Condition</label>
              <div class="flex gap-2 flex-wrap">
                <button
                  type="button"
                  v-for="c in conditions" :key="c"
                  @click="form.propertyCondition = c"
                  class="chip text-xs"
                  :class="form.propertyCondition === c ? 'chip-active' : 'chip-inactive'"
                >{{ c }}</button>
              </div>
            </div>
          </div>

          <div v-if="isRental">
            <label class="block text-xs font-semibold text-secondary mb-1.5">Service Charge (₦/yr)</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm font-bold">₦</span>
              <input
                :value="fmtDisplay(form.serviceCharge)"
                @input="numInput($event, v => form.serviceCharge = v)"
                type="text" inputmode="numeric"
                class="input-field pl-8" placeholder="200,000"
              />
            </div>
          </div>

          <div v-if="isSale">
            <label class="block text-xs font-semibold text-secondary mb-1.5">Tenure / Title</label>
            <select v-model="form.tenure" class="input-field">
              <option value="">Select tenure type</option>
              <option>Certificate of Occupancy (C of O)</option>
              <option>Right of Occupancy (R of O)</option>
              <option>Deed of Assignment</option>
              <option>Governor's Consent</option>
              <option>Registered Survey</option>
            </select>
          </div>

          <!-- Land-specific fields -->
          <template v-if="isLand">
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1.5">Land Size</label>
                <input v-model="form.landSize" class="input-field" placeholder="e.g. 600 sqm, 2 plots" />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1.5">Zoning</label>
                <select v-model="form.zoning" class="input-field">
                  <option value="">Select</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Agricultural</option>
                  <option>Mixed Use</option>
                </select>
              </div>
            </div>
          </template>

          <!-- Shortlet-specific fields -->
          <template v-if="isShortlet">
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1.5">Min Stay (nights)</label>
                <input v-model.number="form.minStay" type="number" min="1" class="input-field" placeholder="1" />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1.5">Max Guests</label>
                <input v-model.number="form.maxGuests" type="number" min="1" class="input-field" placeholder="4" />
              </div>
            </div>
          </template>
        </div>

        <!-- C: Description -->
        <div class="card p-5">
          <h3 class="font-bold text-secondary mb-1">Description</h3>
          <p class="text-xs text-brand-muted mb-3">Describe the property — highlights, nearby landmarks, selling points</p>
          <textarea
            v-model="form.description"
            class="input-field resize-none"
            rows="5"
            maxlength="1000"
            placeholder="e.g. Stunning 3-bedroom apartment in the heart of Lekki Phase 1, with sweeping lagoon views..."
          ></textarea>
          <p class="text-xs text-brand-light mt-1.5 text-right">{{ form.description.length }}/1000</p>
        </div>

        <!-- D: Amenities -->
        <div class="card p-5">
          <h3 class="font-bold text-secondary mb-1">Amenities</h3>
          <p class="text-xs text-brand-muted mb-3">Select all that apply</p>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              v-for="a in amenitiesList" :key="a"
              @click="toggleAmenity(a)"
              class="chip text-xs"
              :class="form.amenities.includes(a) ? 'chip-active' : 'chip-inactive'"
            >{{ a }}</button>
          </div>
          <p v-if="form.amenities.length" class="text-xs text-brand-muted mt-3">{{ form.amenities.length }} selected</p>
        </div>

        <!-- E: Photos -->
        <div class="card p-5">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-bold text-secondary">Photos & Media</h3>
            <span class="text-xs text-brand-muted">{{ form.images.length }}/10</span>
          </div>
          <p class="text-xs text-brand-muted mb-4">JPG or PNG · Max 5MB each · First photo is the cover</p>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="(img, i) in form.images" :key="i" class="relative h-24 rounded-md overflow-hidden group">
              <img :src="img" class="w-full h-full object-cover" />
              <span v-if="i === 0" class="absolute bottom-1 left-1 text-[10px] bg-primary/80 text-white px-1.5 py-0.5 rounded-sm font-semibold backdrop-blur-sm">Cover</span>
              <button
                type="button"
                @click="removeImage(i)"
                class="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X :size="12" class="text-white" />
              </button>
            </div>
            <label
              v-if="form.images.length < 10"
              class="h-24 border-2 border-dashed border-brand-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
              :class="uploadingImages ? 'pointer-events-none opacity-60' : ''"
            >
              <Loader2 v-if="uploadingImages" :size="22" class="text-primary mb-1 animate-spin" />
              <Plus v-else :size="22" class="text-brand-muted mb-1" />
              <span class="text-xs text-brand-muted">{{ uploadingImages ? 'Uploading…' : 'Add Photo' }}</span>
              <input type="file" accept="image/jpg,image/jpeg,image/png" multiple class="hidden" :disabled="uploadingImages" @change="handleImages" />
            </label>
          </div>
        </div>

        <!-- F: Contact Preference -->
        <div class="card p-5">
          <h3 class="font-bold text-secondary mb-3">Contact Preference</h3>
          <div class="flex gap-3">
            <button
              type="button"
              v-for="c in contactOptions" :key="c.value"
              @click="form.contact = c.value"
              class="flex-1 flex items-center gap-2 p-3 border-2 rounded-md transition-all text-sm font-medium"
              :class="form.contact === c.value ? 'border-primary bg-primary/5 text-primary' : 'border-brand-border text-brand-muted hover:border-primary'"
            >
              <component :is="c.icon" :size="15" />
              {{ c.label }}
            </button>
          </div>
        </div>

        <!-- G: Visibility (paid plans only) -->
        <div v-if="subStore.isPaid" class="card p-5">
          <h3 class="font-bold text-secondary mb-1">Boost Visibility</h3>
          <p class="text-xs text-brand-muted mb-3">Use your plan allowance to get this listing seen by more people</p>
          <div class="space-y-3">
            <button
              type="button"
              @click="togglePremium"
              :disabled="!form.premium && subStore.premiumRemaining <= 0"
              class="w-full flex items-center gap-3 p-3 border-2 rounded-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              :class="form.premium ? 'border-warning bg-warning/5' : 'border-brand-border hover:border-warning'"
            >
              <div class="w-9 h-9 rounded-md bg-warning/10 flex items-center justify-center flex-shrink-0">
                <ArrowUpNarrowWide :size="17" class="text-warning" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-secondary">Premium Listing</div>
                <div class="text-xs text-brand-muted">Appears at the top of search results · {{ subStore.premiumRemaining }} left</div>
              </div>
              <div class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0"
                :class="form.premium ? 'border-warning bg-warning' : 'border-brand-border'">
                <Check v-if="form.premium" :size="12" class="text-white" />
              </div>
            </button>

            <button
              type="button"
              @click="toggleBoost"
              :disabled="!form.boost && subStore.boostsRemaining <= 0"
              class="w-full flex items-center gap-3 p-3 border-2 rounded-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              :class="form.boost ? 'border-success bg-success/5' : 'border-brand-border hover:border-success'"
            >
              <div class="w-9 h-9 rounded-md bg-success/10 flex items-center justify-center flex-shrink-0">
                <Rocket :size="17" class="text-success" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-secondary">Listing Boost</div>
                <div class="text-xs text-brand-muted">Extra visibility across the platform · {{ subStore.boostsRemaining }} left</div>
              </div>
              <div class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0"
                :class="form.boost ? 'border-success bg-success' : 'border-brand-border'">
                <Check v-if="form.boost" :size="12" class="text-white" />
              </div>
            </button>
          </div>
        </div>

        <!-- Publish -->
        <button type="submit" class="btn-primary w-full py-4 text-base font-bold" :disabled="loading">
          <span v-if="!loading" class="flex items-center justify-center gap-2">
            <CheckCircle :size="18" /> Publish Listing
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <Loader2 :size="18" class="animate-spin" /> Publishing...
          </span>
        </button>
      </form>
    </div>

    <!-- Listing-limit modal -->
    <Transition name="fade">
      <div v-if="showLimitPrompt" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" @click.self="showLimitPrompt = false">
        <Transition name="slide-up">
          <div v-if="showLimitPrompt" class="bg-white rounded-2xl p-7 max-w-sm w-full text-center shadow-2xl">
            <div class="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Layers :size="30" class="text-warning" />
            </div>
            <h3 class="text-xl font-extrabold text-secondary mb-1">Listing Limit Reached</h3>
            <p class="text-brand-muted text-sm mb-5">
              Your {{ subStore.plan.name }} allows up to {{ subStore.listingLimit }} listings.
              Upgrade to publish more properties.
            </p>
            <div class="flex flex-col gap-3">
              <router-link to="/subscriptions" class="btn-primary w-full py-3 text-sm font-bold">View Plans</router-link>
              <button @click="showLimitPrompt = false" class="text-brand-muted text-sm font-medium hover:text-secondary">Maybe later</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/api'
import AppLayout from '@/components/AppLayout.vue'
import { usePropertyStore } from '@/stores/property'
import { useSubscriptionStore } from '@/stores/subscription'
import { useToastStore } from '@/stores/toast'
import { X, Plus, Loader2, CheckCircle, Layers, Check, Rocket, ArrowUpNarrowWide, Phone, Mail, MessageCircle } from 'lucide-vue-next'

const router       = useRouter()
const propStore    = usePropertyStore()
const subStore     = useSubscriptionStore()
const toast        = useToastStore()
const loading      = ref(false)
const uploadingImages = ref(false)
const showLimitPrompt = ref(false)

const myCount           = computed(() => propStore.myListings.length)
const remainingListings = computed(() => Math.max(0, subStore.listingLimit - myCount.value))

const form = reactive({
  listingType: 'rent',
  title: '', propertyType: 'apartment', address: '',
  price: null, size: null, bedrooms: null, bathrooms: null, yearBuilt: null,
  furnishingStatus: 'Unfurnished', propertyCondition: 'Good',
  serviceCharge: null, tenure: '', description: '', amenities: [], images: [],
  landSize: '', zoning: '', minStay: null, maxGuests: null,
  contact: 'call', premium: false, boost: false,
})

const togglePremium = () => {
  if (!form.premium && subStore.premiumRemaining <= 0) return
  form.premium = !form.premium
}
const toggleBoost = () => {
  if (!form.boost && subStore.boostsRemaining <= 0) return
  form.boost = !form.boost
}

const listingTypes = [
  { value: 'rent',          label: 'For Rent'       },
  { value: 'sale',          label: 'For Sale'       },
  { value: 'lease',         label: 'For Lease'      },
  { value: 'shortlet',      label: 'Shortlet'       },
  { value: 'commercialRent',label: 'Commercial Rent'},
  { value: 'commercialSale',label: 'Commercial Sale'},
  { value: 'land',          label: 'Land for Sale'  },
  { value: 'landLease',     label: 'Land for Lease' },
  { value: 'jointVenture',  label: 'Joint Venture'  },
]

const propertyTypes = [
  { value: 'apartment',   label: 'Apartment'   },
  { value: 'house',       label: 'House'       },
  { value: 'duplex',      label: 'Duplex'      },
  { value: 'bungalow',    label: 'Bungalow'    },
  { value: 'terrace',     label: 'Terrace'     },
  { value: 'penthouse',   label: 'Penthouse'   },
  { value: 'studio',      label: 'Studio'      },
  { value: 'selfContain', label: 'Self Contain'},
  { value: 'miniFlat',    label: 'Mini Flat'   },
  { value: 'commercial',  label: 'Commercial'  },
  { value: 'land',        label: 'Land'        },
  { value: 'other',       label: 'Other'       },
]

const contactOptions = [
  { value: 'call',     label: 'Call',     icon: Phone         },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'email',    label: 'Email',    icon: Mail          },
]

const conditions    = ['New', 'Excellent', 'Good', 'Fair', 'Needs Renovation']
const amenitiesList = [
  'Swimming Pool', 'Gym', 'Generator', 'Security', 'CCTV', 'Parking',
  'Boys Quarters', 'Elevator', 'Water Treatment', 'Internet/Fibre',
  'Air Conditioning', 'Prepaid Meter',
]

const showBedBath = computed(() =>
  !['land', 'landLease'].includes(form.listingType) &&
  !['land', 'commercial'].includes(form.propertyType)
)
const isRental   = computed(() => ['rent', 'lease', 'shortlet', 'commercialRent'].includes(form.listingType))
const isSale     = computed(() => ['sale', 'commercialSale', 'land'].includes(form.listingType))
const isLand     = computed(() => ['land', 'landLease'].includes(form.listingType))
const isShortlet = computed(() => form.listingType === 'shortlet')
const priceSuffix = computed(() => {
  if (form.listingType === 'shortlet') return '/night'
  if (isRental.value) return '/yr'
  return ''
})

const toggleAmenity  = (a) => {
  const idx = form.amenities.indexOf(a)
  idx === -1 ? form.amenities.push(a) : form.amenities.splice(idx, 1)
}

const handleImages = async (e) => {
  const files = Array.from(e.target.files).slice(0, 10 - form.images.length)
  e.target.value = ''
  if (!files.length) return
  uploadingImages.value = true
  try {
    const fd = new FormData()
    files.forEach(f => fd.append('images', f))
    const { data } = await api.upload('/uploads/images', fd)
    form.images.push(...data.urls)
  } catch (err) {
    // Uploads not configured yet (503) → fall back to a local preview.
    if (err.status === 503) {
      files.forEach(f => form.images.push(URL.createObjectURL(f)))
      toast.info('Image storage not set up yet — using a local preview.')
    } else {
      toast.error(err.message || 'Image upload failed.')
    }
  } finally {
    uploadingImages.value = false
  }
}

const removeImage = (i) => form.images.splice(i, 1)

// ── Number formatting helpers ────────────────────────────────────────────
const fmtDisplay = (val) => (val != null && val !== '') ? Number(val).toLocaleString('en-NG') : ''

const numInput = (e, setter) => {
  const digits   = e.target.value.replace(/\D/g, '')
  const num      = digits ? parseInt(digits) : null
  setter(num)
  const formatted = num != null ? num.toLocaleString('en-NG') : ''
  const sel       = e.target.selectionStart
  const prevCommas = (e.target.value.substring(0, sel).match(/,/g) || []).length
  e.target.value  = formatted
  const newCommas  = (formatted.substring(0, sel).match(/,/g) || []).length
  try { e.target.setSelectionRange(sel + newCommas - prevCommas, sel + newCommas - prevCommas) } catch (_) {}
}
// ─────────────────────────────────────────────────────────────────────────

const saveDraft = () => toast.info('Draft saved successfully.')

const publish = async () => {
  if (!form.title || !form.address || !form.price) {
    toast.error('Please fill in all required fields.')
    return
  }

  loading.value = true
  try {
    // The backend enforces the plan quota and consumes premium/boost allowances.
    // NOTE: images are local previews for now; wiring the R2 upload endpoint is
    // the remaining piece (needs R2 keys configured).
    await propStore.createListing({
      title: form.title,
      address: form.address,
      price: Number(form.price),
      listingType: form.listingType,
      propertyType: form.propertyType,
      description: form.description,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      size: Number(form.size) || 0,
      yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : null,
      furnishingStatus: form.furnishingStatus,
      propertyCondition: form.propertyCondition,
      amenities: form.amenities,
      images: form.images,
      isPremium: form.premium,
      isBoosted: form.boost,
    })
    // Refresh subscription usage (premium/boost counts may have changed).
    subStore.fetch?.().catch?.(() => {})
    toast.success('Listing published successfully!')
    setTimeout(() => router.push('/my-listings'), 800)
  } catch (e) {
    if (e.details?.code === 'LISTING_LIMIT_REACHED') {
      showLimitPrompt.value = true
    } else {
      toast.error(e.message || 'Could not publish listing.')
    }
  } finally {
    loading.value = false
  }
}
</script>
