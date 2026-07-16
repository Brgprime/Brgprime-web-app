import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/style.css'
import { useUserStore } from './stores/user'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// Refresh the session from the server on boot (clears an expired token).
const userStore = useUserStore()
if (userStore.token) {
  userStore.fetchMe()
}
