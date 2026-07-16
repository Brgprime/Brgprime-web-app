<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-lg">

      <div class="card p-8">

        <!-- Logo + heading -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound :size="24" class="text-primary" />
          </div>
          <h1 class="text-2xl font-extrabold text-secondary">Reset password</h1>
          <p class="text-brand-muted text-sm mt-1">
            {{ step === 'request'
              ? "Enter your email and we'll send a 6-digit code"
              : step === 'reset'
                ? 'Enter the code we emailed you and your new password'
                : 'All done' }}
          </p>
        </div>

        <!-- Step 1: request code -->
        <form v-if="step === 'request'" @submit.prevent="requestCode" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Email Address</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="15" />
              <input
                v-model="email"
                type="email"
                class="input-field pl-9"
                placeholder="you@example.com"
                autocomplete="email"
                required
              />
            </div>
          </div>
          <p v-if="error" class="text-danger text-xs">{{ error }}</p>
          <button type="submit" class="btn-primary w-full py-3 text-sm font-bold" :disabled="loading">
            <span v-if="!loading">Send Code</span>
            <span v-else class="flex items-center justify-center gap-2">
              <Loader2 :size="15" class="animate-spin" /> Sending...
            </span>
          </button>
        </form>

        <!-- Step 2: enter code + new password -->
        <form v-else-if="step === 'reset'" @submit.prevent="resetPassword" class="space-y-4">
          <p class="text-brand-muted text-sm text-center">
            We sent a code to <strong class="text-secondary">{{ email }}</strong>
          </p>
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">6-Digit Code</label>
            <input
              v-model="code"
              inputmode="numeric"
              maxlength="6"
              class="input-field tracking-[0.5em] text-center text-lg font-bold"
              placeholder="000000"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">New Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="15" />
              <input
                v-model="newPassword"
                :type="showPw ? 'text' : 'password'"
                class="input-field pl-9 pr-9"
                placeholder="At least 8 characters"
                autocomplete="new-password"
                required
              />
              <button type="button" @click="showPw = !showPw"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light">
                <component :is="showPw ? EyeOff : Eye" :size="15" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Confirm Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="15" />
              <input
                v-model="confirmPassword"
                :type="showPw ? 'text' : 'password'"
                class="input-field pl-9"
                placeholder="Re-enter password"
                autocomplete="new-password"
                required
              />
            </div>
          </div>
          <p v-if="error" class="text-danger text-xs">{{ error }}</p>
          <button type="submit" class="btn-primary w-full py-3 text-sm font-bold" :disabled="loading">
            <span v-if="!loading">Reset Password</span>
            <span v-else class="flex items-center justify-center gap-2">
              <Loader2 :size="15" class="animate-spin" /> Resetting...
            </span>
          </button>
          <button type="button" @click="requestCode" class="text-primary text-xs font-semibold hover:underline w-full text-center" :disabled="loading">
            Didn't get it? Resend code
          </button>
        </form>

        <!-- Step 3: success -->
        <div v-else class="text-center py-4">
          <div class="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 :size="28" class="text-success" />
          </div>
          <h3 class="font-bold text-secondary mb-1">Password reset!</h3>
          <p class="text-brand-muted text-sm mb-4">
            You can now sign in with your new password.
          </p>
          <router-link to="/login" class="btn-primary w-full py-2.5 text-sm">Back to Sign In</router-link>
        </div>

        <!-- Footer -->
        <p v-if="step !== 'done'" class="text-center text-brand-muted text-sm mt-6">
          Remembered it?
          <router-link to="/login" class="text-primary font-semibold hover:underline">Sign In</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { KeyRound, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-vue-next'

// API base — configurable via VITE_API_URL, defaults to the local backend.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const step            = ref('request')   // 'request' | 'reset' | 'done'
const email           = ref('')
const code            = ref('')
const newPassword     = ref('')
const confirmPassword = ref('')
const showPw          = ref(false)
const loading         = ref(false)
const error           = ref('')

const requestCode = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message || 'Could not send code.')
    // Dev convenience: if the backend returns the code (no email provider), prefill it.
    if (json?.data?.devOtp) code.value = json.data.devOtp
    step.value = 'reset'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  error.value = ''
  if (newPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, code: code.value, newPassword: newPassword.value }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message || 'Could not reset password.')
    step.value = 'done'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
