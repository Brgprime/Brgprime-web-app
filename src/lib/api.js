// Central API client for the BRG Prime backend.
// - attaches the JWT
// - transparently refreshes an expired access token (refresh-token flow)
// - retries transient failures (e.g. the free-tier backend waking from sleep)
// - unwraps the { success, data, meta } envelope

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '')

const TOKEN_KEY = 'user_token'
const REFRESH_KEY = 'user_refresh'

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const clean = (v) => (v && v !== 'null' && v !== '' ? v : null)
export const getToken = () => clean(localStorage.getItem(TOKEN_KEY))
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY))
export const getRefreshToken = () => clean(localStorage.getItem(REFRESH_KEY))
export const setRefreshToken = (t) => (t ? localStorage.setItem(REFRESH_KEY, t) : localStorage.removeItem(REFRESH_KEY))

function buildQuery(params) {
  if (!params) return ''
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, v)
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const TRANSIENT = [502, 503, 504]
const RETRY_DELAYS = [1500, 4000, 8000] // backoff while the backend wakes up

// ── Token refresh (deduped so concurrent 401s trigger a single refresh) ──────
let refreshPromise = null
async function tryRefresh() {
  const rt = getRefreshToken()
  if (!rt) return false
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: rt }),
        })
        const text = await res.text()
        const json = text ? JSON.parse(text) : {}
        if (res.ok && json?.data?.token) {
          setToken(json.data.token)
          setRefreshToken(json.data.refreshToken)
          return true
        }
        return false
      } catch {
        return false
      }
    })()
  }
  const ok = await refreshPromise
  refreshPromise = null
  return ok
}

function doFetch(method, path, { body, params, headers, isForm }) {
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
  return fetch(`${BASE_URL}${path}${buildQuery(params)}`, opts)
}

async function request(method, path, options = {}) {
  const isRefreshRoute = path.startsWith('/auth/refresh')
  let res

  // Retry network failures / transient 5xx while the backend spins up.
  for (let attempt = 0; ; attempt++) {
    try {
      res = await doFetch(method, path, options)
    } catch {
      if (attempt < RETRY_DELAYS.length) { await sleep(RETRY_DELAYS[attempt]); continue }
      throw new ApiError('Cannot reach the server. Please try again in a moment.', 0)
    }
    if (TRANSIENT.includes(res.status) && attempt < RETRY_DELAYS.length) {
      await sleep(RETRY_DELAYS[attempt]); continue
    }
    break
  }

  // Expired access token → refresh once, then replay the request.
  if (res.status === 401 && !isRefreshRoute && !options._retried && getRefreshToken()) {
    if (await tryRefresh()) return request(method, path, { ...options, _retried: true })
    setToken(null)
    setRefreshToken(null)
  }

  const text = await res.text()
  const json = text ? JSON.parse(text) : {}

  if (!res.ok || json.success === false) {
    if (res.status === 401 && !getRefreshToken()) setToken(null)
    const message = json?.error?.message || `Request failed (${res.status})`
    throw new ApiError(message, res.status, json?.error?.details)
  }
  return json // { success, data, meta, message }
}

export const api = {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body }),
  patch: (path, body) => request('PATCH', path, { body }),
  del: (path) => request('DELETE', path),
  upload: (path, formData) => request('POST', path, { body: formData, isForm: true }),
  baseUrl: BASE_URL,
}

export default api
