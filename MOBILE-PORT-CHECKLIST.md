# BRG Prime — Mobile Port Checklist

One line per screen / system. Check off as each is built and matches the web (see `PROJECT-SPEC.md` for full detail). Status legend: `[ ]` not started · `[~]` in progress · `[x]` done & matches web.

---

## Foundation (do first)
- [ ] **Design tokens** — colors, Montserrat fonts, radii (8/12/20), shadows, gradients (`PROJECT-SPEC.md §3`)
- [ ] **Reusable UI** — buttons (primary/secondary/outline-danger), input field, card, chip, badge, section-title
- [ ] **Bundle assets** — `properties/p01–p34.jpeg`, house logo/app icon
- [ ] **Persistence layer** — key-value store mapping the localStorage keys (`user_*`, `sub_*`, `saved_properties`)
- [ ] **Stores** — `user`, `subscription` (PLANS), `property`, `favorites`, `toast` (`§5`)
- [ ] **Navigation** — auth gate (token presence), drawer/tab structure, top header (`§6`)
- [ ] **Global toasts** — colored snackbars (success/error/info/warning) (`§7.24`)
- [ ] **Page transitions** — fade/slide on screen change

## Auth & public (public — no token required)
- [ ] **Landing** `/` — marketing scroll + sign-up gate modal (optional on mobile) (`§7.1`)
- [ ] **Onboarding** — 3 slides, sets `onboarding_completed` (not routed on web; optional) (`§7.2`)
- [ ] **Login** `/login` — mock auth, min-8 password, → dashboard (`§7.3`)
- [ ] **Register** `/register` — 3 steps: details → OTP → success (`§7.4`)
- [ ] **Forgot Password** `/forgot-password` — email → "check inbox" (`§7.5`)

## Core (authenticated)
- [ ] **Dashboard** `/dashboard` — greeting, featured, stats row, popular locations, FAB (`§7.6`)
- [ ] **Properties** `/properties` — search + location select + filter, tabs, grid/list, empty state (`§7.7`)
- [ ] **PropertyCard** — badges (type/Verified/New/Premium/Boosted), heart, price fmt (`§7.7`)
- [ ] **FilterModal** — price/type/beds/baths/verified bottom sheet (`§7.7`)
- [ ] **Property Detail** `/property/:id` — gallery, features, amenities, agent card, sticky CTA (`§7.8`)
- [ ] **Add Listing** `/add-listing` — full form, quota badge, limit modal, premium/boost toggles (`§7.9`)
- [ ] **My Listings** `/my-listings` — status tabs, listing cards, empty state (`§7.10`)
- [ ] **Book Viewing** `/book-viewing?id=` — property preview + scheduling form (`§7.21`)

## Monetization
- [ ] **Subscriptions** `/subscriptions` — usage card, 4 plans, monthly/annual, cross-benefits, FAQ (`§7.11`)
- [ ] **Paystack Modal** — simulated checkout (email/card/expiry/cvv → success) (`§7.11`)
- [ ] **Payments** `/payments` — summary cards, history, record-payment modal (`§7.15`)
- [ ] **Payment Methods** `/profile/payments` — saved cards, add card, bank transfer (`§7.19`)

## Engagement & insights
- [ ] **Forum** `/forum` — group chat, send + simulated reply, typing indicator (`§7.12`)
- [ ] **Notifications** `/notifications` — typed cards, unread badge, mark-all-read (`§7.13`)
- [ ] **Analytics** — now an **Admin tab** (not in sidebar); standalone `/analytics` route is unlinked (`§7.14`, `§7.23`)

## Profile cluster
- [ ] **Profile** `/profile` — hero, plan card, account/subscription/support, admin entry, sign out (`§7.16`)
- [ ] **Edit Profile** `/profile/edit` — avatar, name/email/phone/bio, save (`§7.17`)
- [ ] **Privacy & Security** `/profile/privacy` — change password, toggles, delete account (`§7.18`)
- [ ] **Saved Properties** `/profile/saved` — favorites grid, empty state (`§7.20`)
- [ ] **Generic Content** `/generic/:title` — Terms / Privacy / About (`§7.22`)

## Admin (lower priority)
- [ ] **Admin** `/admin` — Overview / Users / Listings / Revenue / Analytics / Reports tabs (`§7.23`)

## Cross-cutting behaviors (verify across all screens)
- [ ] Money formatting (`₦X.XB/M/k`) + suffixes (`/yr`, `/night`) consistent
- [ ] Premium > Boosted > normal sort order in results
- [ ] Plan quota blocks publishing at limit; allowances decrement on publish
- [ ] Favorites persist + drive nav badge / Saved screen / heart fills
- [ ] Unread notifications drive the bell badge
- [ ] Logout clears user keys and returns to login
- [ ] Simulated latency/spinners on async actions

## Do NOT port (dead code — not in router)
- [ ] ~~AgentDashboard.vue~~ · ~~BuyerDashboard.vue~~ · ~~ListingsView.vue~~ · ~~TenantsView.vue~~

---

**Total routed screens to build: 24** (23 if Landing is skipped on mobile). Source of truth: `src/router/index.js` (screens) + Pinia stores (behavior) + `src/data/*` (content).
