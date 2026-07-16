<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-lg">

      <!-- Card (header inside) -->
      <div class="card p-8 shadow-card">

        <!-- Logo + Heading -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Home :size="26" class="text-white" />
          </div>
          <h1 class="text-2xl font-extrabold text-secondary">Welcome back</h1>
          <p class="text-brand-muted text-sm mt-1">Sign in to your BRG Prime account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Email Address</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="15" />
              <input v-model="form.email" type="email" class="input-field pl-9" placeholder="you@example.com" autocomplete="email" required />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-semibold text-secondary">Password</label>
              <router-link to="/forgot-password" class="text-primary text-xs font-medium hover:underline">Forgot password?</router-link>
            </div>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="15" />
              <input
                v-model="form.password"
                :type="showPw ? 'text' : 'password'"
                class="input-field pl-9 pr-10"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-secondary transition-colors">
                <component :is="showPw ? EyeOff : Eye" :size="15" />
              </button>
            </div>
          </div>

          <p v-if="error" class="text-danger text-xs bg-danger/10 border border-danger/20 px-3 py-2.5 rounded-md">{{ error }}</p>

          <button type="submit" class="btn-primary w-full py-3 text-sm font-bold" :disabled="loading">
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center justify-center gap-2">
              <Loader2 :size="15" class="animate-spin" /> Signing in...
            </span>
          </button>
        </form>

        <div class="flex items-center gap-3 my-5">
          <div class="flex-1 h-px bg-brand-border"></div>
          <span class="text-brand-light text-xs">or continue with</span>
          <div class="flex-1 h-px bg-brand-border"></div>
        </div>

        <div class="flex gap-3">
          <button class="btn-secondary flex-1 py-2.5 text-sm gap-2">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-4 h-4" /> Google
          </button>
          <button class="btn-secondary flex-1 py-2.5 text-sm gap-2">
            <img src="https://www.svgrepo.com/show/448234/facebook.svg" class="w-4 h-4" /> Facebook
          </button>
        </div>

        <p class="text-center text-brand-muted text-sm mt-6">
          Don't have an account?
          <router-link to="/register" class="text-primary font-semibold hover:underline">Sign Up</router-link>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Home, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const router    = useRouter()
const userStore = useUserStore()

const form    = reactive({ email: '', password: '' })
const showPw  = ref(false)
const loading = ref(false)
const error   = ref('')

const handleLogin = async () => {
  error.value = ''
  if (form.password.length < 8) { error.value = 'Password must be at least 8 characters.'; return }
  loading.value = true
  try {
    await userStore.login({ email: form.email, password: form.password })
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message || 'Sign in failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
