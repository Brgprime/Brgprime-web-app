<template>
  <div class="min-h-screen bg-white flex flex-col overflow-hidden">
    <!-- Slides -->
    <div class="relative flex-1 overflow-hidden">
      <div
        class="flex transition-transform duration-500 ease-in-out h-full"
        :style="`transform: translateX(-${current * 100}%)`"
      >
        <div v-for="(slide, i) in slides" :key="i" class="w-full flex-shrink-0 h-full flex flex-col">
          <!-- Navy gradient top half -->
          <div class="navy-gradient h-[55%] relative flex flex-col items-center justify-center px-8 text-center" style="border-radius: 0 0 40px 40px">
            <!-- Logo -->
            <div class="absolute top-12 left-6">
              <BrandLogo class="h-8" />
            </div>
            <!-- Skip -->
            <button v-if="current < slides.length - 1" @click="finish" class="absolute top-12 right-6 text-white/70 text-sm font-medium hover:text-white">
              Skip
            </button>
            <!-- Icon -->
            <div class="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center mb-6 mt-6">
              <component :is="slide.icon" :size="40" class="text-white" />
            </div>
            <img :src="slide.image" class="w-full max-w-xs h-40 object-cover rounded-xl opacity-80" :alt="slide.title" />
          </div>

          <!-- White bottom half -->
          <div class="flex-1 flex flex-col items-center justify-center px-8 text-center py-6">
            <h2 class="text-2xl font-extrabold text-secondary mb-3">{{ slide.title }}</h2>
            <p class="text-brand-muted text-sm leading-relaxed max-w-xs">{{ slide.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom controls -->
    <div class="px-8 pb-10 bg-white">
      <!-- Page dots -->
      <div class="flex justify-center gap-2 mb-6">
        <button
          v-for="(_, i) in slides" :key="i"
          @click="current = i"
          class="h-2 rounded-full transition-all duration-300"
          :class="current === i ? 'w-8 bg-primary' : 'w-2 bg-brand-border'"
        />
      </div>

      <div class="flex gap-3 max-w-sm mx-auto">
        <button v-if="current > 0" @click="current--" class="btn-secondary flex-1">Back</button>
        <button v-if="current < slides.length - 1" @click="current++" class="btn-primary flex-1">Next</button>
        <button v-else @click="finish" class="btn-primary flex-1">Get Started</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import BrandLogo from '@/components/BrandLogo.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Home, Building2, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const current = ref(0)

const slides = [
  {
    title: 'Your Complete Property Marketplace',
    desc: 'Buy, sell, rent, and lease properties across Nigeria\'s top cities — all in one place.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  },
  {
    title: 'List in Minutes, Reach Thousands',
    desc: 'Create a listing in under 5 minutes and connect with thousands of serious buyers and renters instantly.',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80',
  },
  {
    title: 'Verified. Trusted. Secure.',
    desc: 'All agents and listings go through our verification process so you can transact with complete confidence.',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
  },
]

const finish = () => {
  localStorage.setItem('onboarding_completed', 'true')
  router.push('/login')
}
</script>
