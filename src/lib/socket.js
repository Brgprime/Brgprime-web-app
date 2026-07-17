import { io } from 'socket.io-client'
import { getToken } from './api'

// Socket base = API base without the trailing /api.
const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api')
  .replace(/\/api\/?$/, '')

// Create a fresh authenticated socket connection (caller disconnects on unmount).
export function createSocket() {
  return io(SOCKET_URL, {
    auth: { token: getToken() },
    transports: ['websocket', 'polling'],
  })
}
