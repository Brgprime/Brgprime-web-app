<template>
  <AppLayout>
    <div class="flex flex-col" style="height: calc(100vh - 4rem)">
      <!-- Chat Header -->
      <div class="px-4 sm:px-6 py-4 border-b border-brand-border bg-white flex items-center gap-3 flex-shrink-0">
        <div class="w-10 h-10 primary-gradient rounded-full flex items-center justify-center shadow-md">
          <Users :size="17" class="text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="font-bold text-secondary leading-tight">Forum Group</h2>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="w-2 h-2 bg-success rounded-full"></span>
            <p class="text-xs text-brand-muted">{{ messages.length }} messages · {{ membersOnline }} online</p>
          </div>
        </div>
        <button class="p-2 rounded-md text-brand-muted hover:bg-brand-bg transition-colors">
          <Info :size="17" />
        </button>
      </div>

      <!-- Messages -->
      <div
        ref="chatEl"
        class="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-brand-bg"
      >
        <!-- Date divider -->
        <div class="flex items-center gap-3 my-2">
          <div class="flex-1 h-px bg-brand-border"></div>
          <span class="text-[11px] text-brand-light font-medium px-2">Today</span>
          <div class="flex-1 h-px bg-brand-border"></div>
        </div>

        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex gap-2.5"
          :class="msg.isMe ? 'flex-row-reverse' : ''"
        >
          <img
            v-if="!msg.isMe"
            :src="msg.avatar"
            class="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 ring-2 ring-white"
          />
          <div :class="msg.isMe ? 'items-end' : 'items-start'" class="flex flex-col max-w-[75%]">
            <span v-if="!msg.isMe" class="text-[11px] text-brand-muted mb-1 font-semibold px-1">
              {{ msg.sender }}
            </span>
            <div
              class="px-4 py-2.5 text-sm leading-relaxed shadow-sm"
              :class="msg.isMe
                ? 'primary-gradient text-white rounded-2xl rounded-tr-md'
                : 'bg-white text-secondary rounded-2xl rounded-tl-md'"
            >
              {{ msg.text }}
            </div>
            <span class="text-[10px] text-brand-light mt-1 px-1">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="someoneTyping" class="flex gap-2.5 items-end">
          <div class="w-8 h-8 rounded-full bg-brand-border flex-shrink-0"></div>
          <div class="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm flex items-center gap-1">
            <span v-for="n in 3" :key="n"
              class="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce"
              :style="`animation-delay: ${(n - 1) * 0.15}s`"
            ></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="px-4 sm:px-5 py-3 bg-white border-t border-brand-border flex gap-3 items-end flex-shrink-0">
        <textarea
          ref="inputEl"
          v-model="newMessage"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.shift.enter="null"
          @input="onInput"
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          rows="1"
          class="input-field flex-1 resize-none leading-relaxed"
          style="max-height: 120px; overflow-y: auto;"
        ></textarea>
        <button
          @click="sendMessage"
          class="primary-gradient text-white w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0
          hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          :disabled="!newMessage.trim()"
        >
          <Send :size="16" />
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import api from '@/lib/api'
import { createSocket } from '@/lib/socket'
import { useUserStore } from '@/stores/user'
import AppLayout from '@/components/AppLayout.vue'
import { Users, Send, Info } from 'lucide-vue-next'

const userStore = useUserStore()

const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

// History (REST) already carries isMe; live (socket) carries senderId → compute isMe.
const mapMsg = (m) => ({
  ...m,
  isMe: m.isMe ?? (m.senderId != null && m.senderId === userStore.id),
  time: fmtTime(m.time || m.createdAt),
})

const messages = ref([])
const newMessage  = ref('')
const chatEl      = ref(null)
const inputEl     = ref(null)
const someoneTyping = ref(false)
const membersOnline = ref(1)

let socket = null
let typingTimer = null

const scrollToBottom = () =>
  nextTick(() => { if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight })

const autoResize = () => {
  if (!inputEl.value) return
  inputEl.value.style.height = 'auto'
  inputEl.value.style.height = Math.min(inputEl.value.scrollHeight, 120) + 'px'
}

// Send over the socket; the broadcast echoes it back (incl. to us), so we don't
// append optimistically — the incoming 'forum:message' handler adds it once.
const sendMessage = () => {
  const text = newMessage.value.trim()
  if (!text || !socket) return
  socket.emit('forum:send', { text })
  newMessage.value = ''
  nextTick(() => { if (inputEl.value) inputEl.value.style.height = 'auto' })
}

const onInput = () => {
  autoResize()
  socket?.emit('forum:typing')
}

onMounted(async () => {
  // 1) Load history via REST.
  try {
    const { data } = await api.get('/forum/messages')
    messages.value = data.map(mapMsg)
  } catch { /* ignore */ }
  scrollToBottom()

  // 2) Connect the realtime socket for live messages + presence.
  socket = createSocket()

  socket.on('forum:message', (m) => {
    if (messages.value.some((x) => x.id === m.id)) return // dedupe
    someoneTyping.value = false
    messages.value.push(mapMsg(m))
    scrollToBottom()
  })

  socket.on('forum:presence', ({ count }) => { membersOnline.value = count })

  socket.on('forum:typing', () => {
    someoneTyping.value = true
    scrollToBottom()
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => { someoneTyping.value = false }, 2500)
  })
})

onBeforeUnmount(() => {
  clearTimeout(typingTimer)
  socket?.disconnect()
  socket = null
})
</script>
