// Central API client for the BRG Prime backend.
// Wraps fetch, attaches the JWT, unwraps the { success, data, meta } envelope,
// and throws a typed ApiError on failure.

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '')

const TOKEN_KEY = 'user_token' // shared with the router guard + user store

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export function getToken() {
  const t = localStorage.getItem(TOKEN_KEY)
  return t && t !== 'null' && t !== '' ? t : null
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

function buildQuery(params) {
  if (!params) return ''
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, v)
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}

async function request(method, path, { body, params, headers, isForm } = {}) {
  const token = getToken()
  const opts = {
    method,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }
  if (body !== undefined) opts.body = isForm ? body : JSON.stringify(body)

  let res
  try {
    res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, opts)
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection.', 0)
  }

  // 204 / empty body
  const text = await res.text()
  const json = text ? JSON.parse(text) : {}

  if (!res.ok || json.success === false) {
    const message = json?.error?.message || `Request failed (${res.status})`
    // Auto-clear an invalid/expired session.
    if (res.status === 401) setToken(null)
    throw new ApiError(message, res.status, json?.error?.details)
  }

  return json // { success, data, meta, message }
}

export const api = {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body }),
  patch: (path, body) => request('PATCH', path, { body }),
  del: (path) => request('DELETE', path),
  // Multipart upload (FormData); do not set Content-Type — the browser adds the boundary.
  upload: (path, formData) => request('POST', path, { body: formData, isForm: true }),
  baseUrl: BASE_URL,
}

export default api
