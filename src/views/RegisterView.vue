<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-lg">

      <div class="card p-8">

        <!-- Logo + Heading -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Home :size="24" class="text-white" />
          </div>
          <h1 class="text-2xl font-extrabold text-secondary">
            <span v-if="step === 1">Create account</span>
            <span v-else-if="step === 2">Verify email</span>
            <span v-else>You're all set!</span>
          </h1>
          <p class="text-brand-muted text-sm mt-1">
            <span v-if="step < 3">Step {{ step }} of 2</span>
            <span v-else>Welcome to BRG Prime</span>
          </p>
          <div v-if="step < 3" class="mt-3 bg-brand-border rounded-full h-1 max-w-[200px] mx-auto overflow-hidden">
            <div
              class="h-1 primary-gradient rounded-full transition-all duration-500"
              :style="`width: ${(step / 2) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Step 1: Account Details -->
        <div v-if="step === 1">
          <form @submit.prevent="handleStep1" class="space-y-3">
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1">First Name</label>
                <input v-model="form.firstName" class="input-field" placeholder="Tunde" required />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1">Last Name</label>
                <input v-model="form.lastName" class="input-field" placeholder="Adeyemi" required />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Email</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="14" />
                <input v-model="form.email" type="email" class="input-field pl-8" placeholder="you@example.com" autocomplete="email" required />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Phone Number</label>
              <div class="flex gap-2">
                <span class="input-field w-16 text-center text-sm font-medium bg-brand-bg flex items-center justify-center">+234</span>
                <input v-model="form.phone" class="input-field flex-1" placeholder="8012345678" maxlength="10" required />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Password</label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="14" />
                <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="input-field pl-8 pr-9" placeholder="Min 8 characters" autocomplete="new-password" required minlength="8" />
                <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
                  <component :is="showPw ? EyeOff : Eye" :size="14" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Confirm Password</label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="14" />
                <input v-model="form.confirmPassword" :type="showPw ? 'text' : 'password'" class="input-field pl-8" placeholder="Repeat password" autocomplete="new-password" required />
              </div>
            </div>

            <label class="flex items-start gap-2 cursor-pointer pt-1">
              <input type="checkbox" v-model="form.agreed" class="mt-0.5 accent-primary" required />
              <span class="text-xs text-brand-muted leading-relaxed">
                I agree to the
                <router-link to="/generic/Terms%20%26%20Conditions" class="text-primary hover:underline">Terms & Conditions</router-link>
                and
                <router-link to="/generic/Privacy%20Policy" class="text-primary hover:underline">Privacy Policy</router-link>
              </span>
            </label>

            <p v-if="formError" class="text-danger text-xs bg-danger/10 border border-danger/20 px-3 py-2 rounded-md">{{ formError }}</p>

            <button type="submit" class="btn-primary w-full py-3 text-sm font-bold" :disabled="loading">
              <span v-if="!loading">Create Account</span>
              <span v-else class="flex items-center justify-center gap-2">
                <Loader2 :size="15" class="animate-spin" /> Creating account...
              </span>
            </button>

            <div class="flex items-center gap-3 my-1">
              <div class="flex-1 h-px bg-brand-border"></div>
              <span class="text-brand-light text-xs">or sign up with</span>
              <div class="flex-1 h-px bg-brand-border"></div>
            </div>
            <div class="flex gap-3">
              <button type="button" class="btn-secondary flex-1 py-2.5 text-xs gap-2">
                <svg class="w-4 h-4" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg> Google
              </button>
              <button type="button" class="btn-secondary flex-1 py-2.5 text-xs gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: OTP -->
        <div v-else-if="step === 2" class="text-center">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck :size="26" class="text-primary" />
          </div>
          <p class="text-sm text-brand-muted mb-6">
            Enter the 6-digit code sent to <strong class="text-secondary">{{ form.email }}</strong>
          </p>
          <div class="flex gap-1.5 sm:gap-2 justify-center mb-6">
            <input
              v-for="(_, i) in otp" :key="i"
              :ref="el => otpInputs[i] = el"
              v-model="otp[i]"
              @input="handleOtpInput(i)"
              @keydown.backspace="handleOtpBack(i)"
              type="text" inputmode="numeric" maxlength="1"
              class="w-10 h-11 sm:w-11 sm:h-12 text-center text-lg font-bold border-2 rounded-md outline-none transition-all duration-150"
              :class="otp[i] ? 'border-primary bg-primary/5 text-primary' : 'border-brand-border text-secondary focus:border-primary'"
            />
          </div>
          <p v-if="otpError" class="text-danger text-xs bg-danger/10 border border-danger/20 px-3 py-2 rounded-md mb-3">{{ otpError }}</p>
          <p class="text-brand-muted text-xs mb-4">
            Didn't get it? <button @click="resendOtp" class="text-primary font-semibold hover:underline">Resend code</button>
          </p>
          <button @click="verifyOtp" class="btn-primary w-full py-3 text-sm font-bold" :disabled="verifying">
            <span v-if="!verifying">Verify & Continue</span>
            <span v-else class="flex items-center justify-center gap-2">
              <Loader2 :size="15" class="animate-spin" /> Verifying...
            </span>
          </button>
        </div>

        <!-- Step 3: Success -->
        <div v-else class="text-center py-4">
          <div class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 :size="36" class="text-success" />
          </div>
          <h3 class="text-xl font-extrabold text-secondary mb-1">Account created!</h3>
          <p class="text-brand-muted text-sm mb-1">Welcome to BRG Prime, {{ form.firstName }}!</p>
          <p class="text-brand-light text-xs">Redirecting to dashboard...</p>
          <div class="mt-4 h-1 bg-brand-border rounded-full overflow-hidden max-w-[120px] mx-auto">
            <div class="h-1 bg-success rounded-full animate-pulse w-full"></div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-6 text-sm text-brand-muted">
          <span v-if="step === 1">Already have an account? <router-link to="/login" class="text-primary font-semibold hover:underline">Sign In</router-link></span>
          <button v-else-if="step === 2" @click="step--" class="text-brand-muted hover:text-secondary font-medium transition-colors">← Go back</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Home, Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-vue-next'

const router    = useRouter()
const userStore = useUserStore()

const step      = ref(1)
const showPw    = ref(false)
const formError = ref('')
const otpError  = ref('')
const loading   = ref(false)
const verifying = ref(false)
const otp       = ref(['', '', '', '', '', ''])
const otpInputs = ref([])

const form = reactive({
  firstName: '', lastName: '', email: '', phone: '',
  password: '', confirmPassword: '', agreed: false,
})

const prefillOtp = (code) => {
  if (typeof code === 'string' && code.length === 6) {
    otp.value = code.split('')
  }
}

const handleStep1 = async () => {
  formError.value = ''
  if (form.password !== form.confirmPassword) { formError.value = 'Passwords do not match.'; return }
  if (form.password.length < 8) { formError.value = 'Password must be at least 8 characters.'; return }
  loading.value = true
  try {
    const data = await userStore.register({
      firstName: form.firstName,
      lastName:  form.lastName,
      email:     form.email,
      phone:     `0${form.phone}`,
      password:  form.password,
    })
    prefillOtp(data.devOtp) // dev convenience when no email provider is set
    step.value = 2
    otpError.value = ''
  } catch (e) {
    formError.value = e.message || 'Could not create your account.'
  } finally {
    loading.value = false
  }
}

const handleOtpInput = (i) => {
  if (otp.value[i] && i < 5) otpInputs.value[i + 1]?.focus()
  if (otp.value.every(v => v)) verifyOtp()
}

const handleOtpBack = (i) => {
  if (!otp.value[i] && i > 0) otpInputs.value[i - 1]?.focus()
}

const resendOtp = async () => {
  otpError.value = ''
  otp.value = ['', '', '', '', '', '']
  otpInputs.value[0]?.focus()
  try {
    const data = await userStore.resendOtp(form.email)
    prefillOtp(data.devOtp)
  } catch (e) {
    otpError.value = e.message
  }
}

const verifyOtp = async () => {
  if (verifying.value) return
  otpError.value = ''
  verifying.value = true
  try {
    await userStore.verifyOtp({ email: form.email, code: otp.value.join('') })
    step.value = 3
    await new Promise(r => setTimeout(r, 1500))
    router.push('/dashboard')
  } catch (e) {
    otpError.value = e.message || 'Invalid or expired code.'
    otp.value = ['', '', '', '', '', '']
    otpInputs.value[0]?.focus()
  } finally {
    verifying.value = false
  }
}
</script>
