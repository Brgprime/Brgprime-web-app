// Generated placeholder avatars.
//
// People are never represented by stock photos of real humans. Until a user
// uploads their own picture we render a deterministic initials avatar built
// locally as an inline SVG — no network request, no third-party avatar service.

const PALETTE = [
  ['#1F6FEB', '#0B3C91'],
  ['#0E9F6E', '#046C4E'],
  ['#D97706', '#92400E'],
  ['#7C3AED', '#4C1D95'],
  ['#DB2777', '#831843'],
  ['#0891B2', '#0E4F63'],
  ['#DC2626', '#7F1D1D'],
  ['#4F46E5', '#312E81'],
]

/** Stable non-negative hash so the same person always gets the same colour. */
const hash = (str) => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** "Chidi Okafor" → "CO", "adaeze" → "A", "" → "?" */
export const initialsOf = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const letters = parts.length === 1
    ? parts[0].slice(0, 2)
    : parts[0][0] + parts[parts.length - 1][0]
  return letters.toUpperCase()
}

/**
 * Inline-SVG data URI of an initials avatar. Safe anywhere an image `src`
 * is expected.
 */
export const initialsAvatar = (name, size = 128) => {
  const seed = String(name || 'brgprime')
  const [from, to] = PALETTE[hash(seed) % PALETTE.length]
  const text = initialsOf(name)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>` +
    `</linearGradient></defs>` +
    `<rect width="128" height="128" fill="url(#g)"/>` +
    `<text x="64" y="64" fill="#ffffff" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" ` +
    `font-size="${text.length > 1 ? 48 : 56}" font-weight="600" text-anchor="middle" ` +
    `dominant-baseline="central">${text}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/** Sources we must never show as a person — stock photos and old placeholders. */
const isStockPhoto = (url) =>
  /images\.unsplash\.com|i\.pravatar\.cc|randomuser\.me|picsum\.photos|api\.dicebear\.com|ui-avatars\.com/i.test(url)

/**
 * Resolve the image to show for a person: their uploaded picture when there is
 * a genuine one, otherwise a generated initials avatar.
 */
export const resolveAvatar = (url, name) => {
  const clean = typeof url === 'string' ? url.trim() : ''
  if (!clean || isStockPhoto(clean)) return initialsAvatar(name)
  return clean
}
