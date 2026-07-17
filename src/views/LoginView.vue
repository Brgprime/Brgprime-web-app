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
            <svg class="w-4 h-4" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg> Google
          </button>
          <button class="btn-secondary flex-1 py-2.5 text-sm gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook
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
