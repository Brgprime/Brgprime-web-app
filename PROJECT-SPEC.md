# BRG Prime — Complete Project Specification

> **Purpose of this document:** This is an exact, exhaustive specification of the BRG Prime **web** app (Vue 3 + Vite). It is written so that another AI/developer can rebuild the **mobile** app to behave and look identically — same screens, same data, same flows, same design tokens, same copy. Where the web uses web-specific patterns (Vue Router, Pinia, localStorage, Tailwind classes), the mobile equivalent is noted, but the **behavior, content, and visual design must match exactly**.

---

## 0. What the app is

BRG Prime is a **Nigerian real-estate marketplace** for buying, selling, renting, leasing, shortletting, and listing land/commercial property. It is **frontend-only** — there is **no backend**. All data is mock data held in JS files and in-memory Pinia stores; user/session/favourites/subscription state persists to `localStorage`. Payments are **simulated** (a fake Paystack modal).

- **Tagline:** "Buy. Sell. Rent. Lease."
- **Brand name:** BRG Prime (Billionaire Realtors). Logo is a house icon on a primary-blue rounded square.
- **Currency:** Nigerian Naira (₦). Coverage is **nationwide** (Lagos, Abuja, Port Harcourt, Ibadan, Enugu, Benin City, Kano, Kaduna, Asaba, etc.), not Lagos-only.
- **No role system:** a single user type. Everyone can browse AND list properties. (An admin panel exists but is just another screen reachable from the profile — no real auth gate.)
- **Monetization model:** Subscription Plans (Free / Silver / Bronze / Gold). A previous "post credits" system was removed.

---

## 1. Tech stack (web) and mobile mapping

| Web | Version | Role | Mobile equivalent |
|-----|---------|------|-------------------|
| Vue 3 | ^3.4 | UI framework (`<script setup>` SFCs) | Your mobile framework (React Native / Flutter / etc.) |
| Vite | ^5 | Build/dev | Native bundler |
| Vue Router | ^4.3 | Routing + auth guard | Stack/Tab navigator |
| Pinia | ^2.1 | State stores | Your state manager (Redux/Zustand/Provider) |
| Tailwind CSS | ^3.4 | Styling (utility classes) | Convert tokens to your styling system (see §3) |
| lucide-vue-next | ^0.469 | Icons | `lucide-react-native` / equivalent Lucide port |
| Montserrat | Google Fonts | Font family (weights 400,500,600,700,800) | Bundle Montserrat |

**No backend, no API client, no auth server.** `package.json` scripts: `dev`, `build`, `preview`. Path alias `@` → `src`.

`index.html` head: title `BRG Prime — Buy. Sell. Rent. Lease.`, preconnect to Google Fonts, Montserrat weights `400;500;600;700;800`, and an inline SVG favicon (white house on `#1CA5F6` rounded square). `vercel.json` rewrites all routes to `/index.html` (SPA fallback) — irrelevant on mobile.

---

## 2. App entry & shell

- `main.js`: creates the Vue app, installs Pinia + Router, mounts `#app`, imports global CSS.
- `App.vue`: a `<router-view>` with a page transition (`name="page"`, `mode="out-in"`, keyed by route path) plus a global `<ToastContainer />` teleported to body.
- **Page transition (every navigation):** fade + slide. Enter from `opacity:0; translateY(6px)`, leave to `opacity:0; translateY(-4px)`, duration ~0.18s ease. Mobile: replicate as a subtle fade/slide on screen change.

### App layout (authenticated screens)
`AppLayout.vue` wraps most authenticated screens:
- A **fixed left sidebar** (`NavSidebar`, width 256px / `w-64`) on `lg+`; off-canvas (slides in from left, `-translate-x-full`) on smaller screens with a dark overlay (`bg-secondary/60`).
- Main content area is `lg:pl-64`, with a **sticky top bar** (`TopNav`, height 64px / `h-16`) and a `<main class="py-6">` slot.
- `sidebarOpen` ref toggled by the TopNav hamburger and closed by overlay tap / nav-item tap.

> **Mobile mapping:** The sidebar becomes a **bottom tab bar + drawer**, or a hamburger drawer. The TopNav becomes the mobile header. Keep the same destinations and grouping (see §6). The "current plan" pill, user card, and Sign Out belong at the bottom of the drawer.

---

## 3. Design system (EXACT tokens)

### 3.1 Colors (`tailwind.config.js`)
```
primary.DEFAULT   #1CA5F6   (brand blue)
primary.light     #6DCBFB
primary.dark      #0D8FD9
secondary.DEFAULT #1B2540   (deep navy — primary text color)
secondary.variant #2D3D63
brand.bg          #F4F7FF   (app background)
brand.border      #DDE3F0
brand.border-light#EEF2FA
brand.muted       #5E6A8A   (secondary text)
brand.light       #9AA3BB   (tertiary/placeholder text)
success           #2DC875   (green)
warning           #FFA726   (amber)
danger            #E63946   (red)
white             #FFFFFF
```
Body default: background `brand.bg` (#F4F7FF), text `secondary` (#1B2540), font Montserrat, antialiased.

### 3.2 Typography
- Font family: **Montserrat** everywhere (`font-sans`).
- Weights used: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold).
- Headings are typically `font-extrabold text-secondary`. Body copy `text-brand-muted`. Placeholders `text-brand-light`.

### 3.3 Radii & shadows
```
radius sm = 8px,  md = 12px,  lg = 20px   (plus Tailwind defaults like rounded-full, rounded-2xl=16px, rounded-xl=12px)
shadow card        = 0 2px 16px rgba(27,37,64,0.08)
shadow card-hover  = 0 4px 24px rgba(27,37,64,0.14)
```

### 3.4 Gradients (CSS classes in `assets/style.css`)
```
.navy-gradient    linear-gradient(135deg, #2D3D63 0%, #1B2540 100%)
.hero-gradient    linear-gradient(135deg, #1B2540 0%, #1CA5F6 100%)
.primary-gradient linear-gradient(135deg, #1CA5F6 0%, #0D8FD9 100%)
```

### 3.5 Reusable component classes (replicate as styled components)
- `.btn-primary` — inline-flex centered, `bg-primary` white text, `font-semibold py-3 px-6 rounded-md`, hover `bg-primary-dark`, active scale 0.98, disabled 50% opacity.
- `.btn-secondary` — white bg, `text-secondary`, `border border-brand-border`, hover `bg-brand-bg`, same sizing.
- `.btn-outline-danger` — transparent, `text-danger`, `border-danger`; hover fills danger bg white text.
- `.input-field` — full width, `px-4 py-3 rounded-md border border-brand-border bg-white text-secondary`, placeholder `text-brand-light`, focus `border-primary` + ring `primary/20`, `text-sm`.
- `.card` — `bg-white rounded-md shadow-card`.
- `.chip` — `px-4 py-1.5 rounded-full text-sm font-medium border`, whitespace-nowrap.
  - `.chip-active` — `bg-primary text-white border-primary shadow-sm`.
  - `.chip-inactive` — `bg-white text-brand-muted border-brand-border`, hover border/text primary.
- `.section-title` — `text-lg font-bold text-secondary mb-3`.
- `.badge` — `text-xs font-semibold px-2 py-0.5 rounded-full`.
- `.page-pad` — `px-4 sm:px-6` (horizontal screen padding).
- `.stat-card` — `card p-4 flex flex-col gap-1`.
- `.nav-link` — `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium`.
  - `.nav-link-active` — `bg-primary text-white`.
  - `.nav-link-inactive` — `text-white/60`, hover `bg-white/10 text-white` (used on the navy sidebar).
- `.scrollbar-none` — hides scrollbars (mobile: just hide scroll indicators on horizontal carousels).

### 3.6 Transitions/animations
- `.page-*` — page transition (see §2).
- `.toast-*` — toast slides in from the right with a spring `cubic-bezier(0.34,1.56,0.64,1)`, ~0.32s; leaves to the right.
- `.fade-*` — modal/overlay fade, 0.2s.
- `.slide-up-*` — bottom-sheet/modal: enter from `opacity:0; translateY(20px) scale(0.98)`, ~0.28s `cubic-bezier(0.32,0.72,0,1)`.
- Custom scrollbar is 6px, track `brand.bg`, thumb `brand.border`.

> **Mobile:** Bottom sheets (filter, Paystack, limit prompt) should slide up from the bottom edge with the slide-up curve. On phones the web already renders these as full-width bottom sheets (`items-end`, `rounded-t-2xl`) — mobile should do the same.

---

## 4. Data model (mock data — `src/data/mockData.js`)

### 4.1 Property object shape
Every property in `mockProperties` (33 items, ids `'1'`–`'33'`) has:
```js
{
  id: '1',                       // string
  title: 'Modern Luxury Apartment',
  address: 'Lekki Phase 1, Lagos',
  description: '…',              // long paragraph
  price: 2500000,               // number, NGN
  listingType: 'rent',          // 'rent'|'sale'|'lease'|'shortlet'|'commercialRent'|'commercialSale'|'land'|'landLease'|'jointVenture'
  propertyType: 'apartment',    // 'apartment'|'house'|'duplex'|'studio'|'bungalow'|'terrace'|'penthouse'|'flat'|'commercial'|'land'|'mansion'|…
  bedrooms: 3,                  // number (0 for land/commercial)
  bathrooms: 2,
  size: 180,                    // m² (number)
  yearBuilt: 2020,              // number or null
  furnishingStatus: 'Fully Furnished', // 'Fully Furnished'|'Furnished'|'Semi-Furnished'|'Unfurnished'|'N/A'
  propertyCondition: 'New',     // 'New'|'Excellent'|'Good'|'Fair'|'Needs Renovation'
  amenities: ['Swimming Pool','Gym','Generator','Security','CCTV','Parking', …],
  images: ['/properties/p01.jpeg', …],  // 2–5 local image paths
  createdAt: '2024-01-15',      // 'YYYY-MM-DD'
  isRecentlyPosted: true,       // boolean → "New" badge
  isVerified: true,             // boolean → "Verified" badge; also drives featured
  agentName: 'Sarah Williams',
  agentAvatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=sarah',
  rating: 4.8,                  // number
  reviewCount: 24,
  // added at runtime by addListing(): isPremium, isBoosted (booleans)
}
```
**Listing-type distribution in mock data:** mix of rent (majority), sale, shortlet, one `commercialRent` (id 4), one `land` (id 5). Prices range from ₦380k (mini flat rent) to ₦1.2B (Banana Island mansion). Shortlet prices are per-night (₦25k–₦200k).

**Images:** local files at `public/properties/p01.jpeg … p34.jpeg` (34 real listing photos from Billionaire Realtors). All interiors except `p33` (exterior). There is no land/office-specific photo, so land (id 5) and commercial (id 4) reuse the closest interiors/exterior. **Mobile must bundle these same 34 images** and reference them by the same `pNN.jpeg` names. Agent avatars use DiceBear avataaars PNG (`https://api.dicebear.com/7.x/avataaars/png?seed=<name>`); user default avatar is `https://i.pravatar.cc/150?u=brgprime` / `?u=agent`.

### 4.2 Other mock collections
- `mockTenants` (3): `{ id, name, email, phone, property, leaseStart, leaseEnd, rentAmount, status: 'Active'|'Expired', avatar }`. (Used only by the orphaned TenantsView — see §8.)
- `mockForumMessages` (7): `{ id, sender, text, time, isMe, avatar }`. Two have `isMe:true` (sender 'Me'). Seeds the Forum chat.
- `mockNotifications` (6): `{ id, title, message, time, read, type }` where `type ∈ {inquiry, success, payment, message, subscription, viewing}`. 3 unread, 3 read. Drives the unread badge across the app.

### 4.3 Locations (`src/data/nigerianLocations.js`)
- `nigerianLocations` — array of ~25 location strings (cities + Lagos/Abuja areas) used by the Properties filter dropdown: `Lagos, Abuja, Port Harcourt, Ibadan, Enugu, Benin City, Kano, Kaduna, Asaba, Owerri, Uyo, Calabar, Jos, Abeokuta, Warri, Lekki, Victoria Island, Ikoyi, Yaba, Ajah, Maitama, Wuse, Gwarinpa, Asokoro, GRA`.
- `lagosLocations` — alias of `nigerianLocations` (backwards compat).
- `majorCities` — 12-city subset.
- `popularLocations` — dashboard carousel: 8 cities with mock counts and a `https://picsum.photos/seed/<city>/300/200` image:
  `Lagos 1240, Abuja 860, Port Harcourt 412, Ibadan 318, Enugu 244, Benin City 196, Kano 173, Kaduna 151`.

---

## 5. State stores (Pinia) — exact behavior to replicate

All stores persist to `localStorage`. On mobile use the platform's persistent key-value store (AsyncStorage / SharedPreferences / etc.) with the same keys and defaults.

### 5.1 `user` store (`stores/user.js`)
State (with localStorage fallbacks → defaults):
```
name   'Tunde Adeyemi'  (key user_name)
email  'tunde@example.com' (user_email)
phone  '08012345678'    (user_phone)
bio    'Real estate enthusiast based in Nigeria.' (user_bio)
profileImageUrl 'https://i.pravatar.cc/150?u=brgprime' (user_avatar)
token  null             (user_token)  ← presence = logged in
joinDate ISO now        (user_joinDate)
```
Getters: `isLoggedIn` = `!!token`; `initials` = first letters of up to 2 name words, uppercased.
Actions:
- `login(userData)` — sets name/email/phone, token (or `mock_token_<ts>`), sets joinDate if not already set, then `_persist()`.
- `logout()` — clears token and removes user_* keys (token, name, email, phone, bio, avatar).
- `updateProfile(data)` — `Object.assign` + persist.
- `_persist()` — writes all fields to localStorage.

### 5.2 `subscription` store (`stores/subscription.js`) — **the monetization core**
**`PLANS` array** (exported; ordered by ascending monthly price — note Bronze priced above Silver intentionally):

| id | name | price (₦/mo) | listings | premium | boosts | leads | flags |
|----|------|-------------|----------|---------|--------|-------|-------|
| `free` | Free Plan | 0 | 3 | 0 | 0 | false | tagline "Get started — list up to 3 properties" |
| `silver` | Silver Plan | 18,000 | 55 | 10 | 5 | true | **`popular: true`** ("Most Popular") |
| `bronze` | Bronze Plan | 40,000 | 260 | 50 | 30 | true | — |
| `gold` | Gold Plan | 64,000 | 520 | 100 | 55 | true | — |

Each plan also has a `features: string[]` list and `tagline`. Feature lists:
- Free: "Up to 3 property listings", "Standard search placement", "In-app messaging", "Basic property search".
- Silver: "Up to 55 listings", "10 premium listings", "5 listing boosts", "Unlimited property requests (leads)", "Priority support".
- Bronze: "Up to 260 listings", "50 premium listings", "30 listing boosts", "Unlimited property requests (leads)", "Priority support".
- Gold: "Up to 520 listings", "100 premium listings", "55 listing boosts", "Unlimited property requests (leads)", "Dedicated account manager".

`getPlan(id)` returns the plan or Free as fallback.

State: `planId` (key `sub_plan`, default `'free'`), `premiumUsed` (`sub_premium_used`), `boostsUsed` (`sub_boosts_used`), `renewsAt` (`sub_renews_at`), `history` (`sub_history`, array).
Getters: `plan`, `listingLimit`, `premiumLimit`, `boostLimit`, `hasLeads`, `isPaid` (`planId !== 'free'`), `premiumRemaining` (max(0, limit−used)), `boostsRemaining`.
Actions:
- `subscribe(planId)` — switches plan, **resets** premiumUsed/boostsUsed to 0, sets `renewsAt` to now+30 days for paid plans (null for free), and for paid plans unshifts a history entry `{ plan, amount, date }`. Persists (history capped at 50).
- `canPostListing(currentCount)` — `currentCount < listingLimit`.
- `usePremium()` — if remaining>0, increment premiumUsed, persist, return true; else false.
- `useBoost()` — same for boosts.

### 5.3 `property` store (`stores/property.js`)
State: `listings` (copy of `mockProperties`), `searchQuery`, `selectedLocation` ('All Locations'), `selectedTab` ('All'), and `filterOptions { minPrice:100000, maxPrice:50000000, propertyType:'All', bedrooms:'Any', bathrooms:'Any', verifiedOnly:false }`.
Getters:
- `filteredListings` — filters by search (title/address contains query, case-insensitive), location (address includes selectedLocation), tab→listingType (see map below), price range, propertyType (lowercased compare), bedrooms `>=`, bathrooms `>=`, verifiedOnly. Then **sorts by visibility rank**: premium = +2, boosted = +1, so premium listings float to the top, boosted next.
- `featuredListings` — `isVerified` items, first 6.
- `recentListings` — `isRecentlyPosted` items, first 4.
- `myListings` — items where `agentName === 'You'` (i.e., listings the current user created via Add Listing).
- `getById(id)` — find by id.
Actions:
- `addListing(listing)` — prepends a new listing with generated `id: String(Date.now())`, `createdAt` today, `isRecentlyPosted:true`, `isVerified:false`, `isPremium`/`isBoosted` from input, `agentName:'You'`, default agent avatar, `rating:0`, `reviewCount:0`.
- `resetFilters()` — restores default filterOptions.

**Tab → listingType map** (`tabMatchesType`): `Buy→sale, Sell→sale, Rent→rent, Lease→lease, Shortlet→shortlet, Commercial→commercialRent, Land→land, New Dev→sale`. Tab `All` matches everything.

### 5.4 `favorites` store (`stores/favorites.js`)
State: `savedIds` (a `Set`, persisted to `saved_properties` as JSON array).
Getters: `count` (size), `isSaved(id)`.
Action: `toggle(id)` — add/remove and persist. Drives the heart toggle and the "Saved" badge in nav.

### 5.5 `toast` store (`stores/toast.js`)
State: `toasts: []`.
Actions: `show(message, type='success', duration=3500)` pushes `{id, message, type}` and auto-dismisses after `duration`; `dismiss(id)`; convenience `success(msg)`, `error(msg)` (5000ms), `info(msg)`, `warning(msg)`. Types map to colors: success=green, error=red(danger), info=blue(primary), warning=amber. Icons: CheckCircle2 / XCircle / Info / AlertTriangle.

---

## 6. Navigation map (routes & guard)

`router/index.js` — `createWebHistory`, scrolls to top on every navigation.

**Auth guard (`beforeEach`):**
- Routes without `meta.public` require a `user_token` in localStorage → else redirect to `/login`.
- If authenticated and visiting a public page (except `/` landing) → redirect to `/dashboard`.

| Path | View | Public? | Notes |
|------|------|---------|-------|
| `/` | LandingView | ✅ | Marketing landing (logged-in users may revisit) |
| `/login` | LoginView | ✅ | Mock auth |
| `/register` | RegisterView | ✅ | 2-step + OTP + success |
| `/forgot-password` | ForgotPasswordView | ✅ | |
| `/dashboard` | DashboardView (→ MainDashboard) | 🔒 | Home |
| `/properties` | PropertiesView | 🔒 | Accepts `?type=<Tab>` query |
| `/property/:id` | PropertyDetailView | 🔒 | |
| `/add-listing` | AddListingView | 🔒 | Plan-quota gated publish |
| `/my-listings` | MyListingsView | 🔒 | `myListings` |
| `/buy-posts` | → redirect `/subscriptions` | 🔒 | Legacy redirect |
| `/payments` | PaymentsView | 🔒 | |
| `/forum` | ForumView | 🔒 | Group chat |
| `/subscriptions` | SubscriptionsView | 🔒 | Plans + Paystack |
| `/notifications` | NotificationsView | 🔒 | |
| `/analytics` | AnalyticsView | 🔒 | Route still exists but **not linked in nav**; analytics surfaced via Admin → Analytics tab |
| `/profile` | ProfileView | 🔒 | |
| `/profile/edit` | EditProfileView | 🔒 | |
| `/profile/privacy` | PrivacyView | 🔒 | |
| `/profile/payments` | PaymentMethodsView | 🔒 | |
| `/profile/saved` | SavedPropertiesView | 🔒 | |
| `/admin` | AdminView | 🔒 | Reachable from Profile |
| `/book-viewing` | BookViewingView | 🔒 | Reads `?id=` |
| `/generic/:title` | GenericContentView | 🔒 | Terms / Privacy / About |
| `/:pathMatch(.*)*` | → redirect `/dashboard` | — | Catch-all |

> **Onboarding note:** `OnboardingView` exists (3 slides) and writes `onboarding_completed` to localStorage, finishing to `/login`. It is **not wired into the router** in this build (no route). On mobile, show it on first launch before login if you want; otherwise mirror the web (skip it).

### 6.1 Sidebar nav structure (`NavSidebar.vue`) — replicate destinations & grouping
Header: house icon in primary-gradient square + "BRG Prime" / "Buy · Sell · Rent · Lease".
Grouped nav (group label, items as `icon + label`):
1. *(no label)* — **Home** (`/dashboard`, LayoutDashboard), **Properties** (`/properties`, Building2).
2. **Browse** — these route to `/properties?type=<X>`: Buy (Home), Sell (Tag), Rent (Key), Lease (FileText), Shortlet (Moon), Commercial (Building2), Land (Landmark), New Dev (HardHat).
3. **Listings** — Post a Listing (`/add-listing`, Plus), My Listings (`/my-listings`, ClipboardList), Saved (`/profile/saved`, Star, badge = favorites count).
4. **Community** — Forum (`/forum`, MessageSquare). *(Analytics was removed from the sidebar; it now lives in the Admin panel — see §7.23.)*
5. **Account** — Subscription (`/subscriptions`, Crown), Notifications (`/notifications`, Bell, badge = unread count), Profile (`/profile`, User).

Active item = `nav-link-active` (primary bg). Browse items are active when on `/properties` with matching `?type`.

Below nav: **Plan pill** linking to `/subscriptions` — Crown in amber square, plan name, "`<myCount>`/`<listingLimit>` listings used", chevron.
Bottom: **User card** linking to `/profile` (avatar with green online dot, name, "BRG Prime Member") + **Sign Out** button (logs out → `/login`).

### 6.2 Top bar (`TopNav.vue`)
Sticky white header, 64px. Left: hamburger (mobile only). Center: page title + optional breadcrumb (from `titleMap` keyed by route). Right: desktop "Search /" shortcut chip → `/properties`; Notifications bell (red dot if unread); avatar → `/profile`.
`titleMap` examples: `/dashboard`→"Home"; `/properties`→"Properties"/"Browse all listings"; `/add-listing`→"Post a Listing"/"Listings"; `/subscriptions`→"Subscriptions"/"Plans & Pricing"; property detail → "Property Details"/"Properties · Detail"; generic → decoded title. Unknown → "BRG Prime".

---

## 7. Screen-by-screen specification

For each screen: purpose, layout, data, interactions, and exact copy where it matters. **All money formatting, badges, and empty states must match.**

### 7.1 LandingView (`/`) — public marketing page
A long scrolling marketing page (web-first; on mobile, can be a simplified scroll or skipped in favor of going straight to login/register, but the content/sections are listed here for fidelity). Sections in order:
1. **Sticky navbar:** logo; center category buttons `For Sale / For Rent / Shortlet` (smooth-scroll to sections `#for-sale`, `#for-rent`, `#shortlet`); right buttons "Buy / Lease / Rent" and "Post a Property" — **all CTAs go to `/register`**.
2. **Hero:** background image `/properties/p29.jpeg` with navy gradient overlay; badge "Nigeria's Premier Real Estate Platform"; headline "Find the Best **Property** Best Fit For You"; subcopy about verified listings nationwide; a **search card** (Type / Bedrooms / Min Price / Max Price selects + location input + Search button — all trigger `/register`); popular location quick chips (Lekki, Victoria Island, Ikoyi, Ajah, Yaba).
3. **Stats bar** (navy): `12,000+ Active Listings · 36 Cities Covered · 15,000+ Registered Users · 98% Verified Properties`.
4. **Featured Listings:** grid of `mockProperties.slice(0,9)` cards. Clicking any card opens the **sign-up gate modal**.
5. **Promo banner** (navy): "List your property and reach thousands of buyers" + "Get Started Free →".
6. **For Rent** (`#for-rent`): location filter chips (All, Lekki, VI, Ikoyi, Ajah, Yaba, Gbagada, Magodo, Surulere, Ikeja) + grid of rent listings (first 9). Cards open the gate.
7. **For Sale** (`#for-sale`): first 9 sale listings.
8. **Shortlets** (`#shortlet`): first 8 shortlet listings, 4-col, price `/night`.
9. **Why BRG Prime:** 3 features — Verified Listings (ShieldCheck), Instant Discovery (Zap), Market Insights (TrendingUp).
10. **Testimonials** (navy): 3 cards (Adaeze Okafor/Tenant/Lekki; Emeka Nwosu/Owner/Maitama; Funmi Adeyemi/Agent/Port Harcourt), 5 stars each.
11. **FAQ:** 5 accordion items (see source for exact Q&A).
12. **CTA banner** (primary gradient): "Ready to Find Your Dream Property?" + "Get Started — It's Free" (→/register) + "Sign In" (→/login).
13. **Contact:** email `support@brgprime.ng`, WhatsApp `(+234) 801 234 5678`, address "Plot 760, Victoria Island, Lagos".
14. **Footer** (navy): brand blurb, social buttons, link columns (For Sale / For Rent / Company), copyright "© 2026 BRG Prime", Terms/Privacy/Cookie links.

**Sign-up gate modal:** shows the tapped property's image + title + address, a lock icon, "Sign up to view details", "Create Free Account" (→/register) and "Already have an account? Sign In" (→/login).

Price formatting helper `fmtPrice(price, type)`: shortlet → `₦X/night`; ≥1M → `₦X.XM` (+`/yr` if rent); ≥1k → `₦Xk` (+`/yr` if rent); else `₦X`.

### 7.2 OnboardingView (3 slides; not routed by default)
Carousel of 3 slides (translateX transitions). Each: navy gradient top half (rounded bottom 40px) with logo, Skip, an icon (Building2 / Home / ShieldCheck), and an Unsplash image; white bottom half with title + description. Page dots; Back / Next / "Get Started". Finish → set `onboarding_completed`, go `/login`. Copy:
- "Your Complete Property Marketplace" — buy/sell/rent/lease across Nigeria's top cities.
- "List in Minutes, Reach Thousands".
- "Verified. Trusted. Secure.".

### 7.3 LoginView (`/login`)
Centered card. Logo (house in primary-gradient rounded square), "Welcome back" / "Sign in to your BRG Prime account".
Form: Email (Mail icon), Password (Lock icon, show/hide eye, forgot-password link). Inline error if password < 8 chars: "Password must be at least 8 characters." Submit shows spinner ~0.9s, then `userStore.login({ name:'Tunde Adeyemi', email, phone:'08012345678', token })` and routes `/dashboard`. Divider "or continue with" + Google/Facebook buttons (visual only). Footer: "Don't have an account? Sign Up".

### 7.4 RegisterView (`/register`) — 3 steps in one card
Progress bar shows step/2. 
- **Step 1 — Account Details:** First/Last name, Email, Phone (with `+234` prefix box, 10-digit), Password (show/hide, min 8), Confirm Password, Terms & Privacy checkbox (required, links to generic pages), Create Account. Validates passwords match + length (errors inline). Google/Facebook buttons. "Already have an account? Sign In".
- **Step 2 — OTP:** ShieldCheck icon, "Enter the 6-digit code sent to `<email>`", 6 single-char boxes with auto-advance/backspace handling; auto-verifies when all filled. "Resend code". "Verify & Continue". "← Go back".
- **Step 3 — Success:** CheckCircle, "Account created!", "Welcome to BRG Prime, `<firstName>`!", "Redirecting to dashboard...". On reaching step 3 it calls `userStore.login(...)` (name = first+last, phone = `0`+entered) and after ~2s routes `/dashboard`.

### 7.5 ForgotPasswordView (`/forgot-password`)
Card with KeyRound icon, "Reset password". Email field → "Send Reset Link" (spinner ~1s) → success state "Check your inbox" with the email echoed + "Back to Sign In". Footer "Remembered it? Sign In".

### 7.6 DashboardView (`/dashboard`) → `MainDashboard` inside AppLayout
- **Greeting:** time-based ("Good morning/afternoon/evening,") + user's first name + "What are you looking for today?".
- **Featured Listings:** header with "See All" → `/properties`; grid of `featuredListings` (PropertyCard).
- **Stats row** (4 static cards): `12,400+ Active Listings`, `5,200+ Happy Users`, `850+ Agents & Sellers`, `36 Locations`.
- **Popular Locations:** horizontal scroll carousel of `popularLocations` (image with navy gradient overlay, city name, "`<count>`+ listings"); each taps to `/properties`. Header "Explore".
- **Floating Action Button** (fixed bottom-right): "Post a Listing" (Plus) → `/add-listing`, primary gradient pill.

### 7.7 PropertiesView (`/properties`)
- **Search + filter row:** search input (binds `propStore.searchQuery`), location `<select>` (`All Locations` + `nigerianLocations`), "Filter" button → opens FilterModal.
- **Tab bar** (horizontal scroll chips): `All, Buy, Sell, Rent, Lease, Shortlet, Commercial, Land, New Dev`. Reads `?type=` query on mount to preselect.
- **Results count** ("`<n>` properties found") + grid/list view toggle (LayoutGrid/List).
- **Grid** of `filteredListings` (PropertyCard), or **empty state** (SearchX, "No properties found", "Try adjusting your search or filters", "Clear Filters" button that resets filters + clears search).

**PropertyCard** (`components/PropertyCard.vue`): image (h-48, object-cover, hover zoom). Badges: top-left listing-type pill (`formatType`: rent→"For Rent", sale→"For Sale", lease→"For Lease", shortlet→"Shortlet", commercialRent→"Commercial", land→"Land", etc.); bottom-right Premium (amber, ArrowUpNarrowWide) or Boosted (green, Rocket); top-right Verified (green BadgeCheck) and a "New" pill (amber, bottom-left) if recently posted; heart favorite toggle (top-right circle, fills danger when saved). Content: title (1 line), address with MapPin, features row (beds/baths/size m²) when bedrooms present, price row: `formatPrice(price)` + suffix (`/yr` for rent|lease|commercialRent, `/night` for shortlet) + rating with star.
**`formatPrice`:** ≥1e9 → `₦X.XB`; ≥1e6 → `₦X.XM`; ≥1e3 → `₦Xk`; else `₦<localized>`.

**FilterModal** (`components/FilterModal.vue`) — bottom sheet on mobile (slide-up), centered dialog on desktop:
- Price Range: Min/Max ₦ inputs with live thousands-grouping (caret-preserving formatter).
- Property Type chips: All, Apartment, House, Duplex, Studio, Bungalow, Terrace, Penthouse, Commercial, Land.
- Bedrooms: Any / 1+ / 2+ / 3+ / 4+ / 5+.
- Bathrooms: Any / 1+ / 2+ / 3+ / 4+.
- Verified Only toggle switch.
- Footer: Reset / Apply Filters. Edits a local copy; Apply writes to `propStore.filterOptions`; Reset calls store reset.

### 7.8 PropertyDetailView (`/property/:id`)
- **Hero image** (h-72/sm:h-96) with active-image switching; Back button; Favorite (heart); Share (visual); listing-type badge bottom-left; thumbnail strip (first 4 images) bottom-right.
- **Header:** title + Verified badge; address with MapPin; rating star + "(N reviews)".
- **Features panel** (when bedrooms): Bedrooms / Bathrooms / sqm with icons.
- **Description** + chips (furnishing, "`<condition>` Condition", "Built `<year>`").
- **Amenities** chips (primary-tinted).
- **Agent card:** avatar, name, "Real Estate Agent", Message (secondary) + Call (`tel:`) buttons.
- **Fixed bottom bar** (`lg:left-64`): price + suffix + address; "Book Viewing" → `/book-viewing?id=<id>`.
- **Not found** fallback: "Property not found" + "Browse Properties".

### 7.9 AddListingView (`/add-listing`)
Header "Post a Listing" + quota badge ("`<myCount>`/`<listingLimit>` listings", green if room/red if full, links to `/subscriptions`) + "Save Draft" (toast "Draft saved successfully.").
Form sections (cards):
- **A. Listing Type** chips: For Rent, For Sale, For Lease, Shortlet, Commercial Rent, Commercial Sale, Land for Sale, Land for Lease, Joint Venture (values: rent, sale, lease, shortlet, commercialRent, commercialSale, land, landLease, jointVenture).
- **B. Property Details:** Title*, Property Type chips (apartment, house, duplex, bungalow, terrace, penthouse, studio, selfContain, miniFlat, commercial, land, other), Full Address*, Price ₦* (grouped input) with helper text ("Charged per yr/night" or "Total sale / asking price"), Size m². **Bedrooms/Bathrooms/Year Built** shown unless land/commercial. Furnishing select (Fully Furnished/Semi-Furnished/Unfurnished), Condition chips (New/Excellent/Good/Fair/Needs Renovation). Conditional: **Service Charge** (rentals), **Tenure/Title** select (sales: C of O, R of O, Deed of Assignment, Governor's Consent, Registered Survey), **Land** fields (Land Size, Zoning), **Shortlet** fields (Min Stay nights, Max Guests).
- **C. Description:** textarea, max 1000 chars, live counter.
- **D. Amenities** chips (multi-select): Swimming Pool, Gym, Generator, Security, CCTV, Parking, Boys Quarters, Elevator, Water Treatment, Internet/Fibre, Air Conditioning, Prepaid Meter.
- **E. Photos & Media:** up to 10 images (file input → object URLs). First is "Cover". Remove on hover.
- **F. Contact Preference:** Call / WhatsApp / Email (icon buttons).
- **G. Boost Visibility (paid plans only, `subStore.isPaid`):** Premium Listing toggle (amber, "`<premiumRemaining>` left", disabled at 0) and Listing Boost toggle (green, "`<boostsRemaining>` left", disabled at 0).
- **Publish** button (spinner ~1.2s).

**Publish logic:** require title+address+price (else toast error "Please fill in all required fields."). If `!canPostListing(myCount)` → show **Listing Limit modal** ("Listing Limit Reached", "Your `<plan>` allows up to `<limit>` listings. Upgrade to publish more properties.", "View Plans" / "Maybe later"). Otherwise consume premium/boost allowance if toggled (`usePremium`/`useBoost`), call `addListing({...form, isPremium, isBoosted, images: form.images.length ? form.images : ['/properties/p10.jpeg']})`, toast "Listing published successfully!", route `/my-listings` after ~0.8s.

### 7.10 MyListingsView (`/my-listings`)
Header "My Listings" + count + "Post New". Filter tabs: All / Active / Pending / Sold (filters by `p.status`, default 'Active'). Each listing is a horizontal card: image, status pill (Active green / Pending amber / Sold navy) + Premium/Boosted pills, title, address, price (`₦<localized>` + `/yr` unless sale), stats row (random-ish views/saves), View (→detail) / Edit (→add-listing) links. Empty state: ClipboardList, "No listings yet", "Post Your First Listing".

### 7.11 SubscriptionsView (`/subscriptions`)
- Header "Choose Your Plan" + **Monthly/Annual toggle** (Annual shows "Save 20%").
- **Current plan usage card** (navy gradient): plan name + Active badge, "Renews `<date>`" if paid, plan icon, and 3 stats: Listings used (`myCount/listingLimit`), Premium left (`premiumRemaining/premiumLimit`), Boosts left (`boostsRemaining/boostLimit`).
- **Plan grid** (4 cards): icon (Free=Sparkles, Silver=Star, Bronze=Award, Gold=Crown), name, tagline, price (`₦<displayPrice>` /month or "/mo, billed annually"; annual = `round(price*0.8)`), feature list (green checks), CTA. **Most Popular** ribbon on Silver. CTA label: "Current Plan" (disabled) / "Downgrade" (free) / "Upgrade" or "Switch Plan" by rank.
- **Cross-plan benefits:** Multiple property listings (Building2), Premium listings (ArrowUpNarrowWide), Listing boosts (Rocket), Unlimited property requests (Inbox).
- **FAQ** (4 accordion items about upgrades, premium/boosts, listing limits, payments).
- **Checkout flow:** choosing a paid plan opens **PaystackModal** with bundle `{ name (+" (Annual)"), price = displayPrice × (12 if annual else 1), descriptor, successText }`. Free plan applies immediately with toast "You are now on the Free Plan." On payment success → `subscribe(plan.id)` + toast "`<plan>` activated — enjoy your new plan!".

**PaystackModal** (`components/PaystackModal.vue`) — simulated checkout bottom sheet/dialog:
- Paystack-branded header ("P" mark in `#00C3F7`, "Paystack" / "Secure Payment", close X).
- Amount banner: bundle name, `₦<price>`, optional descriptor, "brgprime.ng".
- Form: Email (prefilled from user), Card Number (auto-formats `#### #### #### ####`, 16 digits), Expiry (MM/YY), CVV (3). Validation errors inline. Pay button (`#00C3F7`→`#0099CC` gradient) shows "Processing..." spinner ~2.2s.
- Success state: green check, "Payment Successful!", `successText`, "Continue" → emits success.
- Props: `show`, `bundle`. Emits `close`, `success`. (Generalized: also supports legacy `posts` bundles via descriptor fallback.)

### 7.12 ForumView (`/forum`) — group chat
Full-height chat. Header: primary-gradient avatar (Users), "Forum Group", "`<n>` messages · 5 members online", Info button. Messages list (seeded from `mockForumMessages`): mine (right-aligned, primary-gradient bubble, rounded-tr-md) vs others (left, white bubble with sender name + avatar). "Today" date divider. Typing indicator (3 bouncing dots). Input: auto-resizing textarea (Enter sends, Shift+Enter newline), Send button (disabled when empty). After sending, a simulated reply arrives ~2.2s later (random canned line from "Lagos Homes Realty"). Auto-scrolls to bottom.

### 7.13 NotificationsView (`/notifications`)
Header: "`<unread>` unread" + "Mark all read". List of cards (seeded from `mockNotifications`): type-colored icon circle (inquiry/message=primary MessageSquare, success=green BadgeCheck, payment=amber CreditCard, subscription=navy TrendingUp, viewing=green Calendar), title + time, message; unread items have a left primary border + a dot, and tapping marks read. Empty state: Bell + "No notifications yet".

### 7.14 AnalyticsView (`/analytics`) — *no longer in the sidebar*
> The same analytics content now lives inside the **Admin panel → Analytics tab** (§7.23). The standalone `/analytics` route/view still exists (reachable by URL) but is not linked from any nav. On mobile, build analytics **only inside Admin** unless you also want a personal analytics screen.

- **Summary stats** (4): Active Listings 12 (+8%), Total Views 4,291 (+22%), Inquiries 145 (+15%), Conversion Rate 3.4% (−2%). Up/down colored.
- **Monthly Views** bar chart with period toggle 3M/6M/1Y (data in `allData`), last bar highlighted primary.
- **Listing Performance:** 3 rows (Modern Luxury Apartment Lekki / 4-Bed House Maitama / Penthouse Ikoyi) with image, views·inquiries, price, status badge.
- **Lead Sources:** progress bars — Direct Search 45% (primary), Recommendations 28% (success), Forum 15% (warning), Social Media 12% (secondary-variant).

### 7.15 PaymentsView (`/payments`)
- **Summary cards** (4): Total Received ₦3.3M (green), Pending ₦0 (amber), Overdue ₦1.8M (red), This Month ₦0 (primary).
- **Payment History** list (seeded 3 rows: Adebayo Okafor/Paid, Ngozi Eze/Paid, Emeka Nwachukwu/Overdue) with status icon, name, property·date, amount, status badge. "+ Record Payment" opens a modal (Tenant Name, Property, Amount, Status: Paid/Pending/Overdue/Partial) → prepends to list. Empty state with CreditCard.

### 7.16 ProfileView (`/profile`)
- **Hero card:** avatar (green online dot), name + BadgeCheck, email, phone, "BRG Prime Member" badge, Edit (pencil) → `/profile/edit`. Bio. Stats row: My Listings count (→/my-listings), Saved count (→/profile/saved), Member Since (`<Mon Year>`).
- **Plan card** (→/subscriptions): navy Crown square, plan name, "`<myCount>` of `<limit>` listings used", "Manage"/"Upgrade".
- **Account** section: Edit Profile, Privacy & Security.
- **Subscription** section: My Plan (badge = plan name).
- **Support** section: Help Center (mailto), Contact Us (WhatsApp), Terms & Conditions, Privacy Policy, About BRG Prime (→ generic pages).
- **Admin Panel** entry (danger-tinted card) → `/admin`.
- **Sign Out** (danger outline) → logout → `/login`.
- "BRG Prime v1.0.0".

### 7.17 EditProfileView (`/profile/edit`)
Avatar card with camera overlay (file → object URL). Form: First/Last Name, Email, Phone (`+234` prefix), Bio (counter /200). Save (spinner ~0.6s) → `updateProfile` + toast "Profile updated successfully!".

### 7.18 PrivacyView (`/profile/privacy`)
- **Change Password:** Current / New (min 8) / Confirm, show/hide. Validates match + length → toast.
- **Privacy Settings** toggles: Profile Visibility (on), Email Notifications (on), SMS Notifications (off), Two-Factor Authentication (off).
- **Danger Zone:** "Delete Account" (outline danger, visual only).

### 7.19 PaymentMethodsView (`/profile/payments`)
- **Saved cards** (seeded one Visa •••• 4242 exp 08/26) with remove (Trash2). Empty state with CreditCard.
- **Add Payment Method:** Card Number (auto-format), Expiry, CVV, Cardholder Name → adds a card.
- **Bank Transfer Details:** First Bank of Nigeria, BRG Prime Ltd, account 3012345678 (Copy).

### 7.20 SavedPropertiesView (`/profile/saved`)
Header "`<n>` saved property/ies" + "Browse More". Grid of PropertyCards for listings where `favStore.isSaved`. Empty state: heart icon, "No saved properties yet", "Explore Properties".

### 7.21 BookViewingView (`/book-viewing?id=`)
Card with **property preview** (image, title, address, price+suffix) read from `?id`. "Schedule a Viewing". Form: Full Name*, Phone* (`+234`), Email, Preferred Date* (min = today), Preferred Time* (slots 9:00 AM–5:00 PM hourly), Message. Submit (spinner ~1.2s) → success notice "Viewing Booked!" with date/time + toast "Viewing confirmed for `<date>` at `<time>`!". Button cycles Confirm Booking → Booking… → Booked!.

### 7.22 GenericContentView (`/generic/:title`)
Renders static HTML content keyed by decoded title. "Last updated: January 2024". Provided keys: **Terms & Conditions** (6 sections), **Privacy Policy** (5 sections), **About BRG Prime** (mission/offer/values/contact). Unknown title → "Content for "`<title>`" is coming soon." Links used: `/generic/Terms%20%26%20Conditions`, `/generic/Privacy%20Policy`, `/generic/About%20BRG%20Prime`.

### 7.23 AdminView (`/admin`)
A full admin console (6 tabs). Reachable from Profile; no real gate. Tabs:
- **Overview:** 4 stat cards (Total Users 5,284 +12%, Active Listings 12,401 +8%, Monthly Revenue ₦4.1M +22%, New Today 47 +3); Revenue bar chart (₦14.3M, Jan–Jun); Recent Activity feed (5 items); Quick Actions (jump to tabs).
- **Users:** search + filter (All/Active/Disabled); 3 stat tiles; table (8 seeded users with name/email/phone/joined/listings/plan/status/avatar) with Disable/Enable + View (opens a user detail modal); toggling status toasts.
- **Listings:** search + filter (All/Active/Pending/Disabled); 4 stat tiles; table built from `mockProperties` with an `adminStatus` (a few Pending/Disabled). Actions: toggle Verified (BadgeCheck), Approve (pending), Enable/Disable, Delete. All toast.
- **Revenue:** 4 stat cards (Total ₦14.3M, This Month ₦4.1M, Subscriptions ₦8.9M, Premium & Boosts ₦5.4M); transactions table (6 rows, plan purchases, Successful/Pending). "Export CSV" (visual).
- **Analytics** (Activity icon): platform-wide analytics, ported from the old AnalyticsView. 4 summary stats (Active Listings 12,401 +8%, Total Views 184.2k +22%, Inquiries 3,920 +15%, Conversion Rate 3.4% −2%); **Platform Views** bar chart with 3M/6M/1Y period toggle (last bar highlighted primary); **Top Performing Listings** (3 rows: Modern Luxury Apartment Lekki, 4-Bed House Maitama, Penthouse Ikoyi — image, views·inquiries, price, status); **Lead Sources** progress bars (Direct Search 45% primary, Recommendations 28% success, Forum 15% warning, Social Media 12% secondary-variant).
- **Reports:** System Health tiles (Uptime 99.9%, API Latency 42ms, DB Size 1.2 GB, Avg Response 180ms); Flagged Content (2 items, Resolve/Remove/Dismiss); Platform Logs (6 INFO/WARN/ERROR lines).

> **Mobile:** Admin can be a lower-priority screen. If included, mirror the tabs and seeded data; tables become scrollable lists/cards.

### 7.24 ToastContainer (global)
Top-right stack (teleported), max 5s. Colored by type (success/error/info/warning), icon + message + close. Spring slide-in from right. **Mobile:** show as top or bottom toasts/snackbars with the same colors/icons/messages.

---

## 8. Orphaned / legacy files (DO NOT rebuild as screens)

These files exist in `src/` but are **not referenced by the router** (superseded during an overhaul). Do **not** port them; they're dead code:
- `components/AgentDashboard.vue`, `components/BuyerDashboard.vue` — replaced by `MainDashboard.vue`.
- `views/ListingsView.vue` — replaced by `PropertiesView.vue`.
- `views/TenantsView.vue` — landlord/tenant management, not in nav.
- `Main-images/` (source WhatsApp originals) and `BRG-Logo.png` / `BRG-icon.png` are assets; the app actually uses `public/properties/pNN.jpeg` and the inline SVG favicon.

> If you want to confirm current truth, the **router (`src/router/index.js`) is the source of truth** for which screens exist.

---

## 9. Cross-cutting behaviors to replicate exactly

1. **Money formatting** is consistent: card/detail use `₦X.XB / ₦X.XM / ₦Xk / ₦<localized>`; suffixes `/yr` (rent, lease, commercialRent) and `/night` (shortlet). Inputs group thousands live with a caret-preserving formatter.
2. **Premium/Boosted sorting:** search results float premium (+2) above boosted (+1) above normal. Premium/Boosted badges appear on cards and My Listings.
3. **Plan quota gating:** publishing is blocked when `myListings.length >= listingLimit` (limit modal). Premium/boost toggles only appear on paid plans and decrement allowances on publish.
4. **Favorites** persist and surface as a nav badge, a Saved screen, and heart fills on cards/detail.
5. **Notifications unread count** drives the bell dot in TopNav and the Notifications nav badge.
6. **Auth is mock:** any login/registration "works"; the only gate is presence of `user_token`. Logout clears user keys and returns to `/login`.
7. **All payments are simulated** via PaystackModal (no real gateway). 2.2s fake processing then success.
8. **Simulated latency** everywhere (login ~0.9s, publish ~1.2s, save ~0.6s, booking ~1.2s, forgot ~1s) — keep small spinners for fidelity.
9. **Everything is in Nigerian context:** ₦, nationwide cities, Nigerian names, C of O / Governor's Consent tenures, BQ (Boys Quarters), prepaid meter, generator, etc.

---

## 10. Asset checklist for the mobile build

- [ ] Bundle Montserrat (400/500/600/700/800).
- [ ] Bundle `properties/p01.jpeg … p34.jpeg` (the 34 real listing photos) under the same names.
- [ ] House-icon logo (white house on `#1CA5F6` rounded square) for splash/app icon/nav header.
- [ ] Network images used as-is (DiceBear avatars, pravatar user avatar, picsum location images, Unsplash onboarding images) — bundle local fallbacks if offline support is needed.
- [ ] Recreate the color/radii/shadow/gradient tokens (§3) in your styling system.
- [ ] Port the 5 stores' state, getters, actions, and persistence keys (§5) faithfully.
- [ ] Recreate all screens in §7 with the same copy, badges, and empty states.

---

*This spec reflects the repository state at documentation time. The router file and the Pinia stores are the canonical sources of truth for screens and behavior; the mock data files are canonical for content.*
