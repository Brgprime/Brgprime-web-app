<template>
  <img :src="src" :alt="name || 'User avatar'" @error="failed = true" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { resolveAvatar, initialsAvatar } from '@/lib/avatar'

const props = defineProps({
  /** The user's uploaded picture, if they have one. */
  url:  { type: String, default: '' },
  /** Used to derive the initials and colour of the generated avatar. */
  name: { type: String, default: '' },
})

// A broken upload (deleted file, expired link) falls back to the initials
// avatar rather than a broken-image icon.
const failed = ref(false)
watch(() => props.url, () => { failed.value = false })

const src = computed(() =>
  failed.value ? initialsAvatar(props.name) : resolveAvatar(props.url, props.name),
)
</script>
