<template>
  <div class="min-h-screen bg-white font-sans">

    <!-- ── Navbar ──────────────────────────────────────────────────── -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between lg:grid lg:grid-cols-3">

        <!-- Logo (left) -->
        <router-link to="/" class="flex items-center gap-2.5 flex-shrink-0">
          <div class="w-9 h-9 primary-gradient rounded-xl flex items-center justify-center shadow-sm">
            <Home :size="18" class="text-white" />
          </div>
          <div class="leading-tight">
            <div class="font-extrabold text-secondary text-[15px] tracking-tight">BRG Prime</div>
            <div class="hidden sm:block text-[10px] text-brand-light leading-none">Real Estate</div>
          </div>
        </router-link>

        <!-- Category nav (true center) -->
        <nav class="hidden lg:flex items-center justify-center gap-1">
          <button
            v-for="cat in navCategories" :key="cat"
            @click="navClick(cat)"
            class="px-4 py-2 text-sm font-medium text-brand-muted hover:text-secondary hover:bg-brand-bg rounded-md transition-colors whitespace-nowrap"
          >{{ cat }}</button>
        </nav>

        <!-- Action buttons (right) -->
        <div class="flex items-center gap-2 justify-end">
          <button
            @click="goToRegister"
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-secondary border-2 border-brand-border rounded-xl hover:border-primary hover:text-primary transition-colors"
          >
            <Search :size="14" /> Buy / Lease / Rent
          </button>
          <button
            @click="goToRegister"
            class="btn-primary px-4 py-2 text-sm font-bold gap-1.5"
          >
            <Plus :size="15" />
            <span class="hidden sm:inline">Post a Property</span>
            <span class="sm:hidden">Post</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ── Hero ────────────────────────────────────────────────────── -->
    <section class="relative min-h-[620px] flex items-center overflow-hidden">
      <!-- Background -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('/properties/p29.jpeg'); transform: scale(1.05);"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/30"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-secondary/50 via-transparent to-transparent"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div class="max-w-2xl">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6">
            <span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
            Nigeria's Premier Real Estate Platform
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-5">
            Find the Best<br />
            <span class="text-primary">Property</span> Best Fit For You
          </h1>
          <p class="text-white/65 text-lg leading-relaxed mb-10 max-w-lg">
            Browse thousands of verified listings — houses, apartments, land, and shortlets across Nigeria.
          </p>

          <!-- Search card -->
          <div class="bg-white rounded-2xl p-3 shadow-2xl">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              <div>
                <label class="block text-[10px] font-bold text-brand-muted uppercase tracking-wide px-1 mb-1">Type</label>
                <select v-model="search.type" class="w-full px-3 py-2.5 text-sm text-secondary bg-brand-bg rounded-lg border-0 outline-none font-medium cursor-pointer">
                  <option value="">All Types</option>
                  <option>Apartment</option>
                  <option>Duplex</option>
                  <option>Bungalow</option>
                  <option>Flat</option>
                  <option>Land</option>
                  <option>Shortlet</option>
                  <option>Office</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-brand-muted uppercase tracking-wide px-1 mb-1">Bedrooms</label>
                <select v-model="search.beds" class="w-full px-3 py-2.5 text-sm text-secondary bg-brand-bg rounded-lg border-0 outline-none font-medium cursor-pointer">
                  <option value="">Any</option>
                  <option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-brand-muted uppercase tracking-wide px-1 mb-1">Min. Price</label>
                <select v-model="search.minPrice" class="w-full px-3 py-2.5 text-sm text-secondary bg-brand-bg rounded-lg border-0 outline-none font-medium cursor-pointer">
                  <option value="">No Min</option>
                  <option value="500000">₦500k</option>
                  <option value="1000000">₦1M</option>
                  <option value="2000000">₦2M</option>
                  <option value="5000000">₦5M</option>
                  <option value="10000000">₦10M</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-brand-muted uppercase tracking-wide px-1 mb-1">Max. Price</label>
                <select v-model="search.maxPrice" class="w-full px-3 py-2.5 text-sm text-secondary bg-brand-bg rounded-lg border-0 outline-none font-medium cursor-pointer">
                  <option value="">No Max</option>
                  <option value="2000000">₦2M</option>
                  <option value="5000000">₦5M</option>
                  <option value="10000000">₦10M</option>
                  <option value="50000000">₦50M</option>
                  <option value="100000000">₦100M</option>
                </select>
              </div>
            </div>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="15" />
                <input
                  v-model="search.location"
                  class="w-full pl-9 pr-4 py-3 text-sm text-secondary bg-brand-bg rounded-xl border-0 outline-none placeholder:text-brand-light"
                  placeholder="Enter a location (e.g. Lekki, Victoria Island, Ikoyi...)"
                />
              </div>
              <button @click="goToRegister" class="btn-primary px-7 py-3 text-sm font-bold gap-2 whitespace-nowrap">
                <Search :size="15" /> Search
              </button>
            </div>
          </div>

          <!-- Quick links -->
          <div class="flex flex-wrap gap-2 mt-5">
            <span class="text-white/40 text-xs pt-1">Popular:</span>
            <button
              v-for="loc in ['Lekki', 'Victoria Island', 'Ikoyi', 'Ajah', 'Yaba']" :key="loc"
              @click="goToRegister"
              class="text-xs font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors border border-white/10"
            >{{ loc }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Stats bar ────────────────────────────────────────────────── -->
    <section class="bg-secondary py-5 border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
        <div v-for="stat in stats" :key="stat.label" class="text-center px-6 py-2">
          <div class="text-2xl font-extrabold text-white">{{ stat.value }}</div>
          <div class="text-xs text-white/50 mt-0.5">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- ── Featured Listings ─────────────────────────────────────────── -->
    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">Curated for You</p>
          <h2 class="text-3xl font-extrabold text-secondary">Featured Listings</h2>
          <p class="text-brand-muted mt-1 text-sm">Hand-picked premium properties across Nigeria</p>
        </div>
        <button @click="goToRegister" class="hidden sm:flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
          View all <ChevronRight :size="16" />
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="p in featuredProps" :key="p.id"
          @click="openGate(p)"
          class="group cursor-pointer card overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
        >
          <div class="relative overflow-hidden aspect-[4/3]">
            <img :src="p.images[0]" :alt="p.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent"></div>
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <span v-if="p.isVerified" class="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                <BadgeCheck :size="10" /> Verified
              </span>
              <span v-if="p.isRecentlyPosted" class="bg-success text-white text-[10px] font-bold px-2 py-1 rounded-full">New</span>
            </div>
            <!-- Type badge -->
            <div class="absolute top-3 right-3">
              <span
                class="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
                :class="{
                  'bg-primary/90 text-white':  p.listingType === 'rent',
                  'bg-success/90 text-white':  p.listingType === 'sale',
                  'bg-warning/90 text-white':  p.listingType === 'shortlet',
                  'bg-secondary/90 text-white': !['rent','sale','shortlet'].includes(p.listingType),
                }"
              >{{ listingLabel(p.listingType) }}</span>
            </div>
            <!-- Price overlay -->
            <div class="absolute bottom-3 left-3">
              <div class="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5">
                <span class="font-extrabold text-secondary text-sm">{{ fmtPrice(p.price, p.listingType) }}</span>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-secondary text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-1">{{ p.title }}</h3>
            <p class="text-brand-muted text-xs flex items-center gap-1.5 mb-3">
              <MapPin :size="11" class="text-brand-light flex-shrink-0" />{{ p.address }}
            </p>
            <div class="flex items-center gap-3 text-xs text-brand-muted border-t border-brand-border-light pt-3">
              <span v-if="p.bedrooms" class="flex items-center gap-1"><BedDouble :size="13" class="text-brand-light" /> {{ p.bedrooms }} bd</span>
              <span v-if="p.bathrooms" class="flex items-center gap-1"><Bath :size="13" class="text-brand-light" /> {{ p.bathrooms }} ba</span>
              <span class="flex items-center gap-1"><SquareDot :size="13" class="text-brand-light" /> {{ p.size }}m²</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Promo Banner ──────────────────────────────────────────────── -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-4">
      <div
        class="navy-gradient rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5"
        style="background-image: linear-gradient(135deg, #1B2540 0%, #2D3D63 100%);"
      >
        <div class="flex items-center gap-5">
          <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp :size="22" class="text-primary" />
          </div>
          <div>
            <div class="text-white font-extrabold text-lg mb-0.5">List your property and reach thousands of buyers</div>
            <div class="text-white/50 text-sm">Post your first listing today and get discovered by verified buyers and tenants.</div>
          </div>
        </div>
        <button @click="goToRegister" class="flex-shrink-0 bg-white text-secondary font-bold px-6 py-3 rounded-xl text-sm hover:bg-brand-bg transition-colors whitespace-nowrap shadow-sm">
          Get Started Free →
        </button>
      </div>
    </section>

    <!-- ── Available Listings (For Rent) ────────────────────────────── -->
    <section id="for-rent" class="py-16 bg-brand-bg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-6">
          <div>
            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">Available Now</p>
            <h2 class="text-3xl font-extrabold text-secondary">For Rent</h2>
            <p class="text-brand-muted mt-1 text-sm">Quality rental properties across Nigeria</p>
          </div>
          <button @click="goToRegister" class="hidden sm:flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
            View all <ChevronRight :size="16" />
          </button>
        </div>
        <!-- Location chips -->
        <div class="flex flex-wrap gap-2 mb-8">
          <button
            v-for="loc in locations" :key="loc"
            @click="activeLocation = loc"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
            :class="activeLocation === loc
              ? 'bg-secondary text-white border-secondary shadow-sm'
              : 'bg-white text-brand-muted border-brand-border hover:border-secondary hover:text-secondary'"
          >{{ loc }}</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="p in rentProps" :key="p.id"
            @click="openGate(p)"
            class="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
          >
            <div class="relative overflow-hidden aspect-[4/3]">
              <img :src="p.images[0]" :alt="p.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-secondary/50 via-transparent to-transparent"></div>
              <div class="absolute top-3 left-3 flex gap-1.5">
                <span v-if="p.isVerified" class="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full"><BadgeCheck :size="10" /> Verified</span>
                <span v-if="p.isRecentlyPosted" class="bg-success text-white text-[10px] font-bold px-2 py-1 rounded-full">New</span>
              </div>
              <div class="absolute bottom-3 left-3">
                <div class="bg-white/95 rounded-xl px-3 py-1.5">
                  <span class="font-extrabold text-secondary text-sm">{{ fmtPrice(p.price, p.listingType) }}</span>
                </div>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-secondary text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-1">{{ p.title }}</h3>
              <p class="text-brand-muted text-xs flex items-center gap-1.5 mb-3"><MapPin :size="11" class="text-brand-light flex-shrink-0" />{{ p.address }}</p>
              <div class="flex items-center gap-3 text-xs text-brand-muted border-t border-brand-border-light pt-3">
                <span v-if="p.bedrooms" class="flex items-center gap-1"><BedDouble :size="13" class="text-brand-light" /> {{ p.bedrooms }} bd</span>
                <span v-if="p.bathrooms" class="flex items-center gap-1"><Bath :size="13" class="text-brand-light" /> {{ p.bathrooms }} ba</span>
                <span class="flex items-center gap-1"><SquareDot :size="13" class="text-brand-light" /> {{ p.size }}m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── For Sale ──────────────────────────────────────────────────── -->
    <section id="for-sale" class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">Own It</p>
          <h2 class="text-3xl font-extrabold text-secondary">For Sale</h2>
          <p class="text-brand-muted mt-1 text-sm">Buy your dream home in Nigeria's top locations</p>
        </div>
        <button @click="goToRegister" class="hidden sm:flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
          View all <ChevronRight :size="16" />
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="p in saleProps" :key="p.id"
          @click="openGate(p)"
          class="group cursor-pointer card overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
        >
          <div class="relative overflow-hidden aspect-[4/3]">
            <img :src="p.images[0]" :alt="p.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-secondary/50 via-transparent to-transparent"></div>
            <div class="absolute top-3 left-3 flex gap-1.5">
              <span v-if="p.isVerified" class="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full"><BadgeCheck :size="10" /> Verified</span>
              <span v-if="p.isRecentlyPosted" class="bg-success text-white text-[10px] font-bold px-2 py-1 rounded-full">New</span>
            </div>
            <div class="absolute top-3 right-3">
              <span class="bg-success/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">For Sale</span>
            </div>
            <div class="absolute bottom-3 left-3">
              <div class="bg-white/95 rounded-xl px-3 py-1.5">
                <span class="font-extrabold text-secondary text-sm">{{ fmtPrice(p.price, p.listingType) }}</span>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-secondary text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-1">{{ p.title }}</h3>
            <p class="text-brand-muted text-xs flex items-center gap-1.5 mb-3"><MapPin :size="11" class="text-brand-light flex-shrink-0" />{{ p.address }}</p>
            <div class="flex items-center gap-3 text-xs text-brand-muted border-t border-brand-border-light pt-3">
              <span v-if="p.bedrooms" class="flex items-center gap-1"><BedDouble :size="13" class="text-brand-light" /> {{ p.bedrooms }} bd</span>
              <span v-if="p.bathrooms" class="flex items-center gap-1"><Bath :size="13" class="text-brand-light" /> {{ p.bathrooms }} ba</span>
              <span class="flex items-center gap-1"><SquareDot :size="13" class="text-brand-light" /> {{ p.size }}m²</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Shortlets ─────────────────────────────────────────────────── -->
    <section id="shortlet" class="py-16 bg-brand-bg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">Short Stay</p>
            <h2 class="text-3xl font-extrabold text-secondary">Shortlets</h2>
            <p class="text-brand-muted mt-1 text-sm">Furnished apartments available daily and weekly</p>
          </div>
          <button @click="goToRegister" class="hidden sm:flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
            View all <ChevronRight :size="16" />
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          <div
            v-for="p in shortletProps" :key="p.id"
            @click="openGate(p)"
            class="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
          >
            <div class="relative overflow-hidden" style="aspect-ratio: 4/3;">
              <img :src="p.images[0]" :alt="p.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-secondary/50 via-transparent to-transparent"></div>
              <div class="absolute top-2.5 left-2.5">
                <span class="bg-warning text-white text-[10px] font-bold px-2 py-1 rounded-full">Shortlet</span>
              </div>
              <div class="absolute bottom-2.5 left-2.5">
                <div class="bg-white/95 rounded-lg px-2.5 py-1">
                  <span class="font-extrabold text-secondary text-xs">₦{{ p.price.toLocaleString() }}/night</span>
                </div>
              </div>
            </div>
            <div class="p-3.5">
              <h3 class="font-bold text-secondary text-xs leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-1">{{ p.title }}</h3>
              <p class="text-brand-muted text-[11px] flex items-center gap-1"><MapPin :size="10" class="text-brand-light flex-shrink-0" />{{ p.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Why BRG Prime ─────────────────────────────────────────────── -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <p class="text-xs font-bold text-primary uppercase tracking-widest mb-2">Why BRG Prime</p>
        <h2 class="text-3xl font-extrabold text-secondary">Why Everyone Chooses BRG Prime</h2>
        <p class="text-brand-muted mt-2 text-sm">Trusted by 15,000+ Nigerians for their real estate needs</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div v-for="f in features" :key="f.title" class="text-center group">
          <div class="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <component :is="f.icon" :size="28" class="text-white" />
          </div>
          <h3 class="text-lg font-extrabold text-secondary mb-2">{{ f.title }}</h3>
          <p class="text-brand-muted text-sm leading-relaxed max-w-xs mx-auto">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── Testimonials ──────────────────────────────────────────────── -->
    <section class="py-20" style="background: linear-gradient(135deg, #1B2540 0%, #2D3D63 100%);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-xs font-bold text-primary uppercase tracking-widest mb-2">Testimonials</p>
          <h2 class="text-3xl font-extrabold text-white">What Our Users Say</h2>
          <p class="text-white/40 mt-2 text-sm">Real stories from real BRG Prime users</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            v-for="t in testimonials" :key="t.name"
            class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors"
          >
            <div class="flex gap-0.5 mb-4">
              <Star v-for="i in 5" :key="i" :size="14" class="text-warning" style="fill: #FFA726;" />
            </div>
            <p class="text-white/75 text-sm leading-relaxed italic mb-6">"{{ t.text }}"</p>
            <div class="flex items-center gap-3">
              <img :src="t.avatar" class="w-10 h-10 rounded-full object-cover ring-2 ring-white/20" />
              <div>
                <div class="text-white font-bold text-sm">{{ t.name }}</div>
                <div class="text-white/40 text-xs">{{ t.role }} · {{ t.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FAQ ───────────────────────────────────────────────────────── -->
    <section class="py-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div class="text-center mb-12">
        <p class="text-xs font-bold text-primary uppercase tracking-widest mb-2">Got Questions?</p>
        <h2 class="text-3xl font-extrabold text-secondary">Frequently Asked Questions</h2>
      </div>
      <div class="space-y-3">
        <div
          v-for="(faq, i) in faqs" :key="i"
          class="card overflow-hidden"
        >
          <button
            @click="openFaq = openFaq === i ? null : i"
            class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-brand-bg transition-colors"
          >
            <span class="font-semibold text-secondary text-sm pr-4">{{ faq.q }}</span>
            <ChevronDown
              :size="18"
              class="text-brand-light flex-shrink-0 transition-transform duration-300"
              :class="openFaq === i ? 'rotate-180 text-primary' : ''"
            />
          </button>
          <div
            v-if="openFaq === i"
            class="px-6 pb-5 border-t border-brand-border-light"
          >
            <p class="text-brand-muted text-sm leading-relaxed pt-4">{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA Banner ─────────────────────────────────────────────────── -->
    <section class="primary-gradient py-20">
      <div class="max-w-3xl mx-auto text-center px-4">
        <h2 class="text-4xl font-extrabold text-white mb-4 leading-tight">Ready to Find Your<br />Dream Property?</h2>
        <p class="text-white/70 text-lg mb-8">Join thousands of Nigerians who found their perfect home through BRG Prime.</p>
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            @click="goToRegister"
            class="bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-brand-bg transition-colors shadow-lg"
          >Get Started — It's Free</button>
          <router-link
            to="/login"
            class="border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
          >Sign In</router-link>
        </div>
      </div>
    </section>

    <!-- ── Contact ────────────────────────────────────────────────────── -->
    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-2xl font-extrabold text-secondary">Looking for Facts, Figures or Properties?</h2>
        <p class="text-brand-muted mt-1 font-semibold text-sm">Ask BRG Prime</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="mailto:support@brgprime.ng" class="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
          <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Mail :size="18" class="text-primary" />
          </div>
          <div>
            <div class="text-xs text-brand-muted mb-0.5">Email</div>
            <div class="font-semibold text-secondary text-sm">support@brgprime.ng</div>
          </div>
        </a>
        <a href="https://wa.me/2348012345678" target="_blank" class="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
          <div class="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Phone :size="18" class="text-success" />
          </div>
          <div>
            <div class="text-xs text-brand-muted mb-0.5">Phone (WhatsApp)</div>
            <div class="font-semibold text-secondary text-sm">(+234) 801 234 5678</div>
          </div>
        </a>
        <div class="card p-5 flex items-center gap-4">
          <div class="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin :size="18" class="text-warning" />
          </div>
          <div>
            <div class="text-xs text-brand-muted mb-0.5">Address</div>
            <div class="font-semibold text-secondary text-sm">Plot 760, Victoria Island, Lagos</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <footer class="bg-secondary border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-10">
          <!-- Brand col -->
          <div class="col-span-2">
            <div class="flex items-center gap-2.5 mb-4">
              <div class="w-9 h-9 primary-gradient rounded-xl flex items-center justify-center">
                <Home :size="18" class="text-white" />
              </div>
              <span class="font-extrabold text-white text-lg">BRG Prime</span>
            </div>
            <p class="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">Nigeria's most trusted real estate platform for buying, selling, renting, and investing in property.</p>
            <div class="flex gap-2">
              <button
                v-for="s in ['f', 't', 'ig', 'in']" :key="s"
                class="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors text-white text-xs font-bold"
              >{{ s }}</button>
            </div>
          </div>
          <!-- Link cols -->
          <div v-for="col in footerCols" :key="col.title">
            <div class="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-4 pb-2 border-b border-primary/30">{{ col.title }}</div>
            <ul class="space-y-2.5">
              <li v-for="link in col.links" :key="link">
                <a href="#" @click.prevent="goToRegister" class="text-white/45 hover:text-white text-sm transition-colors">{{ link }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-white/30 text-xs">© 2026 BRG Prime. All rights reserved.</p>
          <div class="flex gap-5">
            <router-link to="/generic/Terms%20%26%20Conditions" class="text-white/30 hover:text-white/70 text-xs transition-colors">Terms of Service</router-link>
            <router-link to="/generic/Privacy%20Policy" class="text-white/30 hover:text-white/70 text-xs transition-colors">Privacy Policy</router-link>
            <a href="#" class="text-white/30 hover:text-white/70 text-xs transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- ── Sign-up Gate Modal ──────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="gateModal"
          class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style="background: rgba(27,37,64,0.7); backdrop-filter: blur(6px);"
          @click.self="gateModal = false"
        >
          <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up">
            <!-- Property image preview -->
            <div class="relative h-44">
              <img :src="gateProperty?.images?.[0]" :alt="gateProperty?.title" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-secondary/85 to-transparent"></div>
              <button
                @click="gateModal = false"
                class="absolute top-3 right-3 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <X :size="15" />
              </button>
              <div class="absolute bottom-4 left-4 right-4">
                <div class="text-white font-extrabold text-base leading-tight line-clamp-1">{{ gateProperty?.title }}</div>
                <div class="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin :size="11" />{{ gateProperty?.address }}
                </div>
              </div>
            </div>

            <!-- CTA content -->
            <div class="p-6 text-center">
              <div class="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Lock :size="20" class="text-white" />
              </div>
              <h3 class="font-extrabold text-secondary text-lg mb-1">Sign up to view details</h3>
              <p class="text-brand-muted text-sm mb-5 leading-relaxed">
                Create a free account to see full property info, contact the owner, and book a viewing.
              </p>
              <button @click="goToRegister" class="btn-primary w-full py-3 text-sm font-bold mb-3">
                Create Free Account
              </button>
              <router-link to="/login" class="block text-center text-sm text-brand-muted hover:text-secondary font-medium transition-colors">
                Already have an account? <span class="text-primary font-semibold">Sign In</span>
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mockProperties } from '@/data/mockData'
import {
  Home, Search, MapPin, ChevronRight, ChevronDown, BadgeCheck,
  BedDouble, Bath, Lock, X, Plus, Mail, Phone, Star,
  TrendingUp, ShieldCheck, Zap,
} from 'lucide-vue-next'

// lucide doesn't export SquareDot — use a simple inline fallback
const SquareDot = { template: '<svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>', props: ['size'] }

const router = useRouter()

// ── State ──────────────────────────────────────────────────────────
const search        = reactive({ type: '', beds: '', minPrice: '', maxPrice: '', location: '' })
const activeLocation = ref('All')
const openFaq        = ref(null)
const gateModal      = ref(false)
const gateProperty   = ref(null)

// ── Data ───────────────────────────────────────────────────────────
const navCategories = ['For Sale', 'For Rent', 'Shortlet']

const stats = [
  { value: '12,000+', label: 'Active Listings' },
  { value: '36',      label: 'Cities Covered' },
  { value: '15,000+', label: 'Registered Users' },
  { value: '98%',     label: 'Verified Properties' },
]

const locations = ['All', 'Lekki', 'Victoria Island', 'Ikoyi', 'Ajah', 'Yaba', 'Gbagada', 'Magodo', 'Surulere', 'Ikeja']

const features = [
  { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every property is manually verified by our team before going live. No scams, no fakes.' },
  { icon: Zap,         title: 'Instant Discovery', desc: 'Advanced filters and smart search help you find the perfect property in seconds.' },
  { icon: TrendingUp,  title: 'Market Insights', desc: 'Access real-time pricing data and market trends to make informed property decisions.' },
]

const testimonials = [
  {
    text: 'I found my Lekki apartment in just 3 days on BRG Prime. The listings are accurate and the process was seamless. Highly recommend!',
    name: 'Adaeze Okafor',
    role: 'Tenant',
    location: 'Lekki, Lagos',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=adaeze',
  },
  {
    text: 'As a property owner, BRG Prime helped me sell my Maitama property in under 2 weeks. The platform is professional and the support team is excellent.',
    name: 'Emeka Nwosu',
    role: 'Property Owner',
    location: 'Maitama, Abuja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=emeka2',
  },
  {
    text: 'I used BRG Prime to find a shortlet for my client visiting Port Harcourt. The photos matched perfectly, and the booking was straightforward. 10/10!',
    name: 'Funmi Adeyemi',
    role: 'Property Agent',
    location: 'Port Harcourt, Rivers',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=funmi',
  },
]

const faqs = [
  { q: 'What makes BRG Prime different from other real estate platforms in Nigeria?', a: 'BRG Prime combines verified listings, government ID verification for all users, and flexible subscription plans that ensure only serious landlords and agents list properties. Every listing is manually reviewed before going live.' },
  { q: 'How do I book a property inspection?', a: 'Once you sign up and view a property listing, you can request a viewing directly from the property page. Our team coordinates with the owner or agent to schedule a convenient time for you.' },
  { q: 'Is registration free?', a: 'Yes! Creating an account on BRG Prime is completely free. Our Free Plan lets you list up to 3 properties, and you can upgrade to a paid plan anytime for more listings, premium placement and boosts.' },
  { q: 'How can BRG Prime help me sell or rent out my property?', a: 'Choose a subscription plan, then list your property with photos, pricing, and full details. Paid plans unlock premium listings and boosts so your property reaches thousands of verified buyers and tenants actively searching on our platform.' },
  { q: 'What is the difference between Verified and Unverified listings?', a: 'Verified listings have been physically inspected or documentation-checked by our team. They carry a blue Verified badge and are prioritised in search results, giving owners more visibility.' },
]

const footerCols = [
  { title: 'For Sale', links: ['New Homes', 'Commercial Properties', 'Land for Sale', 'Off-Plan', 'Estate Agents'] },
  { title: 'For Rent', links: ['Apartments', 'Commercial Spaces', 'Shortlets', 'Letting Agents', 'Find Flatmates'] },
  { title: 'Company', links: ['About Us', 'Careers', 'Help Center', 'FAQ', 'Contact Us', 'Privacy Policy'] },
]

// ── Computed ────────────────────────────────────────────────────────
const featuredProps  = computed(() => mockProperties.slice(0, 9))
const rentProps      = computed(() => mockProperties.filter(p => p.listingType === 'rent').slice(0, 9))
const saleProps      = computed(() => mockProperties.filter(p => p.listingType === 'sale').slice(0, 9))
const shortletProps  = computed(() => mockProperties.filter(p => p.listingType === 'shortlet').slice(0, 8))

// ── Helpers ─────────────────────────────────────────────────────────
const listingLabel = (type) => {
  const map = { rent: 'For Rent', sale: 'For Sale', shortlet: 'Shortlet', land: 'Land', commercialRent: 'Commercial' }
  return map[type] || type
}

const fmtPrice = (price, type) => {
  if (type === 'shortlet') return `₦${price.toLocaleString('en-NG')}/night`
  if (price >= 1_000_000) return `₦${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M${type === 'rent' ? '/yr' : ''}`
  if (price >= 1_000) return `₦${(price / 1_000).toFixed(0)}k${type === 'rent' ? '/yr' : ''}`
  return `₦${price.toLocaleString('en-NG')}`
}

// ── Actions ─────────────────────────────────────────────────────────
const goToRegister = () => router.push('/register')

const navSectionMap = { 'For Sale': 'for-sale', 'For Rent': 'for-rent', 'Shortlet': 'shortlet' }

const navClick = (cat) => {
  const id = navSectionMap[cat]
  if (id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    goToRegister()
  }
}

const openGate = (property) => {
  gateProperty.value = property
  gateModal.value    = true
}
</script>
