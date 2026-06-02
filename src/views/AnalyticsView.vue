<template>
  <AppLayout>
    <div class="page-pad pb-10 space-y-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label" class="card p-4 text-center">
          <div class="text-2xl font-extrabold" :class="stat.color">{{ stat.value }}</div>
          <div class="text-xs text-brand-muted mt-1">{{ stat.label }}</div>
          <div class="text-xs font-semibold mt-1" :class="stat.upDown > 0 ? 'text-success' : 'text-danger'">
            {{ stat.upDown > 0 ? '↑' : '↓' }} {{ Math.abs(stat.upDown) }}% vs last month
          </div>
        </div>
      </div>

      <!-- Views Chart -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-secondary">Monthly Views</h3>
          <div class="flex gap-2">
            <button v-for="p in ['3M','6M','1Y']" :key="p" @click="period = p"
              class="text-xs px-3 py-1 rounded-full transition-colors"
              :class="period === p ? 'bg-primary text-white' : 'bg-brand-bg text-brand-muted'">{{ p }}</button>
          </div>
        </div>
        <div class="flex items-end gap-2 h-40 mt-4">
          <div v-for="(bar, i) in chartData" :key="i" class="flex-1 flex flex-col items-center gap-1 group">
            <div class="text-xs text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">{{ bar.value }}</div>
            <div
              class="w-full rounded-t-md transition-all duration-500"
              :class="i === chartData.length - 1 ? 'bg-primary' : 'bg-primary/30'"
              :style="`height: ${(bar.value / maxVal) * 100}%`"
            ></div>
            <span class="text-xs text-brand-light">{{ bar.month }}</span>
          </div>
        </div>
      </div>

      <!-- Listing Performance -->
      <div class="card p-5">
        <h3 class="font-bold text-secondary mb-4">Listing Performance</h3>
        <div class="space-y-3">
          <div v-for="listing in listingPerf" :key="listing.title" class="flex items-center gap-4">
            <img :src="listing.img" class="w-12 h-10 rounded-md object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-secondary truncate">{{ listing.title }}</div>
              <div class="text-xs text-brand-muted">{{ listing.views }} views · {{ listing.inquiries }} inquiries</div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-sm font-bold text-primary">{{ listing.price }}</div>
              <span class="badge text-xs" :class="listing.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{ listing.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lead Sources -->
      <div class="card p-5">
        <h3 class="font-bold text-secondary mb-4">Lead Sources</h3>
        <div class="space-y-3">
          <div v-for="source in leadSources" :key="source.label" class="flex items-center gap-3">
            <span class="text-sm text-secondary w-28 flex-shrink-0">{{ source.label }}</span>
            <div class="flex-1 bg-brand-bg rounded-full h-2">
              <div class="h-2 rounded-full transition-all duration-700" :class="source.color" :style="`width: ${source.pct}%`"></div>
            </div>
            <span class="text-sm font-semibold text-secondary w-10 text-right">{{ source.pct }}%</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'

const period = ref('6M')

const stats = [
  { label: 'Active Listings', value: '12', color: 'text-primary', upDown: 8 },
  { label: 'Total Views', value: '4,291', color: 'text-warning', upDown: 22 },
  { label: 'Inquiries', value: '145', color: 'text-secondary', upDown: 15 },
  { label: 'Conversion Rate', value: '3.4%', color: 'text-success', upDown: -2 },
]

const allData = {
  '3M': [{ month: 'Apr', value: 320 }, { month: 'May', value: 480 }, { month: 'Jun', value: 610 }],
  '6M': [
    { month: 'Jan', value: 210 }, { month: 'Feb', value: 340 }, { month: 'Mar', value: 290 },
    { month: 'Apr', value: 320 }, { month: 'May', value: 480 }, { month: 'Jun', value: 610 },
  ],
  '1Y': [
    { month: 'J', value: 150 }, { month: 'F', value: 200 }, { month: 'M', value: 180 },
    { month: 'A', value: 220 }, { month: 'M', value: 310 }, { month: 'J', value: 290 },
    { month: 'J', value: 340 }, { month: 'A', value: 380 }, { month: 'S', value: 420 },
    { month: 'O', value: 390 }, { month: 'N', value: 450 }, { month: 'D', value: 610 },
  ],
}

const chartData = computed(() => allData[period.value])
const maxVal = computed(() => Math.max(...chartData.value.map(d => d.value)))

const listingPerf = [
  { title: 'Modern Luxury Apartment, Lekki', views: 342, inquiries: 18, price: '₦2.5M/yr', status: 'Active', img: '/properties/p01.jpeg' },
  { title: '4-Bedroom House, Maitama', views: 218, inquiries: 9, price: '₦85M', status: 'Active', img: '/properties/p33.jpeg' },
  { title: 'Penthouse Suite, Ikoyi', views: 189, inquiries: 5, price: '₦250M', status: 'Active', img: '/properties/p30.jpeg' },
]

const leadSources = [
  { label: 'Direct Search', pct: 45, color: 'bg-primary' },
  { label: 'Recommendations', pct: 28, color: 'bg-success' },
  { label: 'Forum', pct: 15, color: 'bg-warning' },
  { label: 'Social Media', pct: 12, color: 'bg-secondary-variant' },
]
</script>
