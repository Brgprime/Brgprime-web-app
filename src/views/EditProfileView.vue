<template>
  <AppLayout>
    <div class="page-pad pb-10">
      <!-- Avatar Card -->
      <div class="card p-6 text-center mb-5">
        <div class="relative inline-block">
          <img
            :src="form.profileImageUrl || 'https://i.pravatar.cc/150?u=agent'"
            class="w-24 h-24 rounded-full object-cover mx-auto border-4 border-brand-border shadow-md"
          />
          <label
            class="absolute bottom-1 right-1 w-8 h-8 primary-gradient rounded-full flex items-center justify-center cursor-pointer shadow-md hover:opacity-90 transition-opacity"
          >
            <Camera :size="15" class="text-white" />
            <input type="file" accept="image/*" class="hidden" @change="handleAvatar" />
          </label>
        </div>
        <p class="text-xs text-brand-muted mt-3">
          Tap the camera icon to change your profile photo
        </p>
        <div class="mt-2 inline-flex items-center gap-1.5 text-xs text-brand-muted bg-brand-bg rounded-full px-3 py-1">
          <span class="font-semibold text-secondary">BRG Prime Member</span>
        </div>
      </div>

      <form @submit.prevent="save" class="card p-5 space-y-4">
        <!-- Name -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <label class="block text-xs font-semibold text-secondary mb-1.5">First Name</label>
            <input v-model="firstName" class="input-field" placeholder="First name" required />
          </div>
          <div class="flex-1">
            <label class="block text-xs font-semibold text-secondary mb-1.5">Last Name</label>
            <input v-model="lastName" class="input-field" placeholder="Last name" />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-xs font-semibold text-secondary mb-1.5">Email Address</label>
          <div class="relative">
            <Mail :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" />
            <input v-model="form.email" type="email" class="input-field pl-8" placeholder="you@example.com" />
          </div>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-xs font-semibold text-secondary mb-1.5">Phone Number</label>
          <div class="flex gap-2">
            <span class="input-field w-16 text-center bg-brand-bg text-sm font-medium">+234</span>
            <input v-model="form.phone" class="input-field flex-1" placeholder="8012345678" maxlength="10" />
          </div>
        </div>

        <!-- Bio -->
        <div>
          <label class="block text-xs font-semibold text-secondary mb-1.5">Bio</label>
          <textarea
            v-model="form.bio"
            class="input-field resize-none"
            rows="3"
            placeholder="Tell us a bit about yourself — your expertise, location, specialisations..."
          ></textarea>
          <p class="text-[11px] text-brand-light mt-1 text-right">{{ form.bio.length }}/200</p>
        </div>

        <button type="submit" class="btn-primary w-full py-3.5" :disabled="saving">
          <span v-if="!saving" class="flex items-center justify-center gap-2">
            <Save :size="16" /> Save Changes
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <Loader2 :size="16" class="animate-spin" /> Saving...
          </span>
        </button>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { Camera, Mail, Save, Loader2 } from 'lucide-vue-next'

const userStore = useUserStore()
const toast     = useToastStore()
const saving    = ref(false)

const nameParts = userStore.name.split(' ')
const firstName = ref(nameParts[0] || '')
const lastName  = ref(nameParts.slice(1).join(' ') || '')

const form = reactive({
  email:           userStore.email,
  phone:           userStore.phone.replace(/^0/, ''),
  bio:             userStore.bio,
  profileImageUrl: userStore.profileImageUrl,
})

const handleAvatar = (e) => {
  const file = e.target.files[0]
  if (file) form.profileImageUrl = URL.createObjectURL(file)
}

const save = async () => {
  saving.value = true
  try {
    await userStore.updateProfile({
      name:            `${firstName.value} ${lastName.value}`.trim(),
      phone:           form.phone.startsWith('0') ? form.phone : `0${form.phone}`,
      bio:             form.bio,
      profileImageUrl: form.profileImageUrl,
    })
    toast.success('Profile updated successfully!')
  } catch (e) {
    toast.error(e.message || 'Could not update profile.')
  } finally {
    saving.value = false
  }
}
</script>
