<template>
  <AppLayout>
    <div class="page-pad pb-10 space-y-5">
      <!-- Change Password -->
      <div class="card p-5">
        <h3 class="font-bold text-secondary mb-4">Change Password</h3>
        <form @submit.prevent="changePassword" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Current Password</label>
            <div class="relative">
              <Lock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" />
              <input v-model="pw.current" :type="showPw ? 'text' : 'password'" class="input-field pl-8 pr-9" placeholder="••••••••" />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
                <component :is="showPw ? EyeOff : Eye" :size="14" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">New Password</label>
            <div class="relative">
              <Lock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" />
              <input v-model="pw.new" :type="showPw ? 'text' : 'password'" class="input-field pl-8" placeholder="Min 8 characters" minlength="8" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1.5">Confirm New Password</label>
            <div class="relative">
              <Lock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" />
              <input v-model="pw.confirm" :type="showPw ? 'text' : 'password'" class="input-field pl-8" placeholder="Repeat new password" />
            </div>
          </div>
          <button type="submit" class="btn-primary w-full">Update Password</button>
        </form>
      </div>

      <!-- Privacy Toggles -->
      <div class="card overflow-hidden">
        <div class="px-5 py-3 border-b border-brand-border-light">
          <span class="text-xs font-bold text-brand-muted uppercase tracking-wider">Privacy Settings</span>
        </div>
        <div v-for="setting in settings" :key="setting.label" class="flex items-center justify-between px-5 py-4 border-b border-brand-border-light last:border-0">
          <div>
            <div class="text-sm font-semibold text-secondary">{{ setting.label }}</div>
            <div class="text-xs text-brand-muted">{{ setting.desc }}</div>
          </div>
          <button @click="setting.value = !setting.value" class="w-12 h-6 rounded-full transition-colors relative"
            :class="setting.value ? 'bg-primary' : 'bg-brand-border'">
            <span class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all" :class="setting.value ? 'left-7' : 'left-1'" />
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card p-5 border border-danger/30">
        <h3 class="font-bold text-danger mb-2">Danger Zone</h3>
        <p class="text-sm text-brand-muted mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button class="btn-outline-danger w-full">Delete Account</button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '@/lib/api'
import AppLayout from '@/components/AppLayout.vue'
import { useToastStore } from '@/stores/toast'
import { Lock, Eye, EyeOff } from 'lucide-vue-next'

const toast   = useToastStore()
const showPw = ref(false)
const pw     = reactive({ current: '', new: '', confirm: '' })

const settings = reactive([
  { label: 'Profile Visibility', desc: 'Allow others to find your profile', value: true },
  { label: 'Email Notifications', desc: 'Receive email alerts for inquiries', value: true },
  { label: 'SMS Notifications', desc: 'Receive SMS for important updates', value: false },
  { label: 'Two-Factor Authentication', desc: 'Add extra security to your account', value: false },
])

const changePassword = async () => {
  if (pw.new !== pw.confirm) { toast.error('New passwords do not match.'); return }
  if (pw.new.length < 8) { toast.error('Password must be at least 8 characters.'); return }
  try {
    await api.post('/users/me/change-password', {
      currentPassword: pw.current,
      newPassword: pw.new,
    })
    toast.success('Password updated successfully!')
    pw.current = ''; pw.new = ''; pw.confirm = ''
  } catch (e) {
    toast.error(e.message || 'Could not update password.')
  }
}
</script>
