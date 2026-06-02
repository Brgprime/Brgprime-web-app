<template>
  <AppLayout>
    <div class="page-pad pb-10">

      <!-- Admin Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-danger/10 rounded-md flex items-center justify-center flex-shrink-0">
            <ShieldAlert :size="20" class="text-danger" />
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-secondary">Admin Panel</h2>
            <p class="text-xs text-brand-muted">Full platform control · BRG Prime</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="badge bg-success/10 text-success flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-success rounded-full"></span>
            System Online
          </span>
          <span class="text-xs text-brand-muted">Last sync: just now</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-brand-bg border border-brand-border rounded-md p-1 mb-6 overflow-x-auto scrollbar-none">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0"
          :class="activeTab === tab.id ? 'bg-white text-secondary shadow-sm' : 'text-brand-muted hover:text-secondary'"
        >
          <component :is="tab.icon" :size="14" />
          {{ tab.label }}
          <span v-if="tab.badge" class="ml-0.5 badge bg-danger text-white text-[10px]">{{ tab.badge }}</span>
        </button>
      </div>

      <!-- ── OVERVIEW ─────────────────────────────────────────────────────── -->
      <div v-if="activeTab === 'overview'" class="space-y-6">

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="stat in overviewStats" :key="stat.label" class="card p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-md flex items-center justify-center" :class="stat.bg">
                <component :is="stat.icon" :size="18" :class="stat.color" />
              </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="stat.trendClass">
                {{ stat.trend }}
              </span>
            </div>
            <div class="text-2xl font-extrabold text-secondary">{{ stat.value }}</div>
            <div class="text-xs text-brand-muted mt-0.5">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Revenue + Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <!-- Revenue Sparkline -->
          <div class="lg:col-span-2 card p-5">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-bold text-secondary">Revenue Overview</h3>
                <p class="text-xs text-brand-muted mt-0.5">Platform earnings from subscription plans</p>
              </div>
              <span class="text-xl font-extrabold text-success">₦14.3M</span>
            </div>
            <div class="flex items-end gap-1.5 h-32">
              <div v-for="(bar, i) in revenueChart" :key="i" class="flex-1 flex flex-col items-center gap-1 group">
                <span class="text-[10px] text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">{{ bar.val }}</span>
                <div
                  class="w-full rounded-t-sm transition-all duration-700"
                  :class="i === revenueChart.length - 1 ? 'primary-gradient' : 'bg-primary/25 group-hover:bg-primary/50'"
                  :style="`height:${(bar.val / maxRev) * 100}%`"
                ></div>
                <span class="text-[10px] text-brand-light">{{ bar.month }}</span>
              </div>
            </div>
          </div>

          <!-- Activity Feed -->
          <div class="card p-5">
            <h3 class="font-bold text-secondary mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div v-for="act in recentActivity" :key="act.id" class="flex items-start gap-3">
                <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" :class="act.bg">
                  <component :is="act.icon" :size="12" :class="act.color" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-secondary font-medium leading-snug">{{ act.text }}</p>
                  <p class="text-[11px] text-brand-light mt-0.5">{{ act.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card p-5">
          <h3 class="font-bold text-secondary mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              v-for="action in quickActions" :key="action.label"
              @click="activeTab = action.tab"
              class="flex flex-col items-center gap-2 p-4 rounded-md border border-brand-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div class="w-9 h-9 rounded-md flex items-center justify-center" :class="action.bg">
                <component :is="action.icon" :size="17" :class="action.color" />
              </div>
              <span class="text-xs font-semibold text-secondary text-center">{{ action.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ── USERS ───────────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'users'" class="space-y-4">

        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            <input v-model="userSearch" class="input-field pl-9 text-sm" placeholder="Search users by name or email..." />
          </div>
          <div class="flex gap-2">
            <button
              v-for="f in ['All','Active','Disabled']" :key="f"
              @click="userFilter = f"
              class="chip text-xs flex-shrink-0"
              :class="userFilter === f ? 'chip-active' : 'chip-inactive'"
            >{{ f }}</button>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-3">
          <div class="card p-4 text-center">
            <div class="text-xl font-extrabold text-secondary">{{ users.length }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Total Users</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-xl font-extrabold text-success">{{ users.filter(u => u.status === 'Active').length }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Active</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-xl font-extrabold text-danger">{{ users.filter(u => u.status === 'Disabled').length }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Disabled</div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[560px]">
            <thead>
              <tr class="border-b border-brand-border-light bg-brand-bg">
                <th class="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">User</th>
                <th class="text-left px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th class="text-left px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th class="text-center px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider hidden sm:table-cell">Listings</th>
                <th class="text-center px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                <th class="text-right px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border-light">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-brand-bg transition-colors">
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <img :src="user.avatar" class="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <div class="font-semibold text-secondary text-sm">{{ user.name }}</div>
                      <div class="text-xs text-brand-muted md:hidden">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3.5 hidden md:table-cell">
                  <div class="text-xs text-secondary">{{ user.email }}</div>
                  <div class="text-xs text-brand-muted">{{ user.phone }}</div>
                </td>
                <td class="px-4 py-3.5 hidden lg:table-cell">
                  <div class="text-xs text-brand-muted">{{ user.joined }}</div>
                </td>
                <td class="px-4 py-3.5 text-center hidden sm:table-cell">
                  <span class="font-bold text-secondary">{{ user.listings }}</span>
                </td>
                <td class="px-4 py-3.5 text-center">
                  <span class="badge text-xs" :class="user.status === 'Active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="toggleUserStatus(user)"
                      class="text-xs font-semibold px-3 py-1.5 rounded-md border transition-all"
                      :class="user.status === 'Active'
                        ? 'border-danger/30 text-danger hover:bg-danger hover:text-white'
                        : 'border-success/30 text-success hover:bg-success hover:text-white'"
                    >
                      {{ user.status === 'Active' ? 'Disable' : 'Enable' }}
                    </button>
                    <button @click="viewUser(user)" class="text-xs font-semibold text-primary hover:underline">View</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredUsers.length">
                <td colspan="6" class="text-center py-12 text-brand-muted text-sm">No users found</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <!-- ── LISTINGS ────────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'listings'" class="space-y-4">

        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            <input v-model="listingSearch" class="input-field pl-9 text-sm" placeholder="Search listings by title or location..." />
          </div>
          <div class="flex gap-2">
            <button
              v-for="f in ['All','Active','Pending','Disabled']" :key="f"
              @click="listingFilter = f"
              class="chip text-xs flex-shrink-0"
              :class="listingFilter === f ? 'chip-active' : 'chip-inactive'"
            >{{ f }}</button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="card p-4 text-center">
            <div class="text-xl font-extrabold text-secondary">{{ adminListings.length }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Total</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-xl font-extrabold text-success">{{ adminListings.filter(l => l.adminStatus === 'Active').length }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Active</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-xl font-extrabold text-warning">{{ adminListings.filter(l => l.adminStatus === 'Pending').length }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Pending</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-xl font-extrabold text-danger">{{ adminListings.filter(l => l.adminStatus === 'Disabled').length }}</div>
            <div class="text-xs text-brand-muted mt-0.5">Disabled</div>
          </div>
        </div>

        <!-- Listings Table -->
        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[600px]">
            <thead>
              <tr class="border-b border-brand-border-light bg-brand-bg">
                <th class="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">Listing</th>
                <th class="text-left px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider hidden md:table-cell">Posted By</th>
                <th class="text-left px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider hidden lg:table-cell">Price</th>
                <th class="text-center px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider hidden sm:table-cell">Verified</th>
                <th class="text-center px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                <th class="text-right px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border-light">
              <tr v-for="listing in filteredListings" :key="listing.id" class="hover:bg-brand-bg transition-colors">
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <img :src="listing.images[0]" class="w-12 h-10 rounded-md object-cover flex-shrink-0" />
                    <div class="min-w-0">
                      <div class="font-semibold text-secondary text-sm truncate max-w-[180px]">{{ listing.title }}</div>
                      <div class="text-xs text-brand-muted">{{ listing.address }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3.5 hidden md:table-cell">
                  <div class="flex items-center gap-2">
                    <img :src="listing.agentAvatar" class="w-6 h-6 rounded-full object-cover" />
                    <span class="text-xs text-secondary">{{ listing.agentName }}</span>
                  </div>
                </td>
                <td class="px-4 py-3.5 hidden lg:table-cell">
                  <span class="text-sm font-bold text-secondary">{{ fmtPrice(listing.price) }}</span>
                </td>
                <td class="px-4 py-3.5 text-center hidden sm:table-cell">
                  <button @click="toggleVerified(listing)" :title="listing.isVerified ? 'Remove verification' : 'Verify listing'">
                    <BadgeCheck :size="18" :class="listing.isVerified ? 'text-success' : 'text-brand-border hover:text-success'" />
                  </button>
                </td>
                <td class="px-4 py-3.5 text-center">
                  <span class="badge text-xs" :class="statusBadge(listing.adminStatus)">{{ listing.adminStatus }}</span>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      v-if="listing.adminStatus === 'Pending'"
                      @click="approveListing(listing)"
                      class="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-success/30 text-success hover:bg-success hover:text-white transition-all"
                    >Approve</button>
                    <button
                      @click="toggleListingStatus(listing)"
                      class="text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-all"
                      :class="listing.adminStatus === 'Disabled'
                        ? 'border-success/30 text-success hover:bg-success hover:text-white'
                        : 'border-warning/30 text-warning hover:bg-warning hover:text-white'"
                    >
                      {{ listing.adminStatus === 'Disabled' ? 'Enable' : 'Disable' }}
                    </button>
                    <button
                      @click="deleteListing(listing.id)"
                      class="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-danger/30 text-danger hover:bg-danger hover:text-white transition-all"
                    >Delete</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredListings.length">
                <td colspan="6" class="text-center py-12 text-brand-muted text-sm">No listings found</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <!-- ── REVENUE ─────────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'revenue'" class="space-y-5">

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="r in revenueStats" :key="r.label" class="card p-5">
            <div class="w-10 h-10 rounded-md flex items-center justify-center mb-3" :class="r.bg">
              <component :is="r.icon" :size="18" :class="r.color" />
            </div>
            <div class="text-2xl font-extrabold text-secondary">{{ r.value }}</div>
            <div class="text-xs text-brand-muted mt-0.5">{{ r.label }}</div>
          </div>
        </div>

        <!-- Transactions -->
        <div class="card overflow-hidden">
          <div class="px-5 py-4 border-b border-brand-border-light flex items-center justify-between">
            <h3 class="font-bold text-secondary">All Transactions</h3>
            <button class="text-primary text-sm font-semibold hover:underline">Export CSV</button>
          </div>
          <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[500px]">
            <thead>
              <tr class="border-b border-brand-border-light bg-brand-bg">
                <th class="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">User</th>
                <th class="text-left px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">Type</th>
                <th class="text-left px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                <th class="text-right px-4 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">Amount</th>
                <th class="text-center px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border-light">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-brand-bg transition-colors">
                <td class="px-5 py-3.5">
                  <div class="font-semibold text-secondary text-sm">{{ tx.user }}</div>
                  <div class="text-xs text-brand-muted">{{ tx.email }}</div>
                </td>
                <td class="px-4 py-3.5">
                  <span class="badge text-xs" :class="tx.typeClass">{{ tx.type }}</span>
                </td>
                <td class="px-4 py-3.5 hidden md:table-cell text-xs text-brand-muted">{{ tx.date }}</td>
                <td class="px-4 py-3.5 text-right font-bold text-secondary">{{ tx.amount }}</td>
                <td class="px-5 py-3.5 text-center">
                  <span class="badge text-xs" :class="tx.status === 'Successful' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{ tx.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <!-- ── REPORTS ─────────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'reports'" class="space-y-5">

        <!-- System Health -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="h in healthStats" :key="h.label" class="card p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" :class="h.bg">
              <component :is="h.icon" :size="17" :class="h.color" />
            </div>
            <div>
              <div class="font-bold text-secondary">{{ h.value }}</div>
              <div class="text-xs text-brand-muted">{{ h.label }}</div>
            </div>
          </div>
        </div>

        <!-- Flagged Content -->
        <div class="card overflow-hidden">
          <div class="px-5 py-4 border-b border-brand-border-light">
            <h3 class="font-bold text-secondary">Flagged Content</h3>
            <p class="text-xs text-brand-muted mt-0.5">Reported listings and users requiring review</p>
          </div>
          <div class="divide-y divide-brand-border-light">
            <div v-for="report in flaggedContent" :key="report.id" class="px-5 py-4 flex items-start gap-4 hover:bg-brand-bg transition-colors">
              <div class="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" :class="report.iconBg">
                <component :is="report.icon" :size="17" :class="report.iconColor" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <span class="font-semibold text-secondary text-sm">{{ report.title }}</span>
                    <span class="ml-2 badge text-xs" :class="report.severityClass">{{ report.severity }}</span>
                  </div>
                  <span class="text-xs text-brand-light flex-shrink-0">{{ report.time }}</span>
                </div>
                <p class="text-xs text-brand-muted mt-0.5">{{ report.description }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <button @click="resolveReport(report)" class="text-xs font-semibold text-success hover:underline">Resolve</button>
                  <span class="text-brand-border">·</span>
                  <button class="text-xs font-semibold text-danger hover:underline">Remove Content</button>
                  <span class="text-brand-border">·</span>
                  <button class="text-xs text-brand-muted hover:text-secondary">Dismiss</button>
                </div>
              </div>
            </div>
            <div v-if="!flaggedContent.length" class="px-5 py-12 text-center">
              <CheckCircle2 :size="28" class="text-success mx-auto mb-2" />
              <p class="text-brand-muted text-sm">All clear — no flagged content</p>
            </div>
          </div>
        </div>

        <!-- Platform Logs -->
        <div class="card overflow-hidden">
          <div class="px-5 py-4 border-b border-brand-border-light">
            <h3 class="font-bold text-secondary">Platform Logs</h3>
          </div>
          <div class="divide-y divide-brand-border-light">
            <div v-for="log in platformLogs" :key="log.id" class="px-5 py-3 flex items-center gap-3">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded font-mono" :class="log.levelClass">{{ log.level }}</span>
              <span class="text-xs text-brand-muted flex-shrink-0 hidden sm:block">{{ log.time }}</span>
              <span class="text-xs text-secondary flex-1">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- User Detail Modal -->
    <Transition name="fade">
      <div v-if="selectedUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" @click.self="selectedUser = null">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
          <div class="flex items-center gap-4 mb-5">
            <img :src="selectedUser.avatar" class="w-16 h-16 rounded-full object-cover border-2 border-brand-border" />
            <div>
              <h3 class="font-extrabold text-secondary">{{ selectedUser.name }}</h3>
              <p class="text-xs text-brand-muted">{{ selectedUser.email }}</p>
              <span class="badge mt-1 text-xs" :class="selectedUser.status === 'Active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'">{{ selectedUser.status }}</span>
            </div>
          </div>
          <div class="space-y-2 text-sm mb-5">
            <div class="flex justify-between"><span class="text-brand-muted">Phone</span><span class="font-medium text-secondary">{{ selectedUser.phone }}</span></div>
            <div class="flex justify-between"><span class="text-brand-muted">Joined</span><span class="font-medium text-secondary">{{ selectedUser.joined }}</span></div>
            <div class="flex justify-between"><span class="text-brand-muted">Listings</span><span class="font-medium text-secondary">{{ selectedUser.listings }}</span></div>
            <div class="flex justify-between"><span class="text-brand-muted">Plan</span><span class="font-medium text-secondary">{{ selectedUser.plan }}</span></div>
          </div>
          <div class="flex gap-3">
            <button
              @click="toggleUserStatus(selectedUser); selectedUser = null"
              class="flex-1 py-2.5 text-sm font-bold rounded-md border transition-all"
              :class="selectedUser.status === 'Active' ? 'border-danger text-danger hover:bg-danger hover:text-white' : 'border-success text-success hover:bg-success hover:text-white'"
            >{{ selectedUser.status === 'Active' ? 'Disable User' : 'Enable User' }}</button>
            <button @click="selectedUser = null" class="flex-1 py-2.5 text-sm font-bold btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </Transition>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { mockProperties } from '@/data/mockData'
import { useToastStore } from '@/stores/toast'
import {
  ShieldAlert, Users, Building2, BarChart2, Flag, Search, BadgeCheck,
  CheckCircle2, DollarSign, TrendingUp, UserCheck, AlertTriangle,
  UserPlus, CreditCard, Activity, Server, Wifi, Database, Clock,
  MessageSquare, Eye, Trash2,
} from 'lucide-vue-next'

const toast = useToastStore()

const activeTab   = ref('overview')
const userSearch  = ref('')
const userFilter  = ref('All')
const listingSearch = ref('')
const listingFilter = ref('All')
const selectedUser  = ref(null)

const tabs = [
  { id: 'overview',  label: 'Overview',  icon: BarChart2  },
  { id: 'users',     label: 'Users',     icon: Users      },
  { id: 'listings',  label: 'Listings',  icon: Building2, badge: 3 },
  { id: 'revenue',   label: 'Revenue',   icon: DollarSign },
  { id: 'reports',   label: 'Reports',   icon: Flag,      badge: 2 },
]

// ── Overview ──────────────────────────────────────────────────────────────
const overviewStats = [
  { label: 'Total Users',    value: '5,284',  trend: '+12%', icon: Users,      color: 'text-primary',  bg: 'bg-primary/10',  trendClass: 'bg-primary/10 text-primary'  },
  { label: 'Active Listings',value: '12,401', trend: '+8%',  icon: Building2,  color: 'text-success',  bg: 'bg-success/10',  trendClass: 'bg-success/10 text-success'  },
  { label: 'Monthly Revenue', value: '₦4.1M', trend: '+22%', icon: TrendingUp, color: 'text-warning',  bg: 'bg-warning/10',  trendClass: 'bg-warning/10 text-warning'  },
  { label: 'New Today',      value: '47',     trend: '+3',   icon: UserPlus,   color: 'text-secondary',bg: 'bg-secondary/10',trendClass: 'bg-secondary/10 text-secondary'},
]

const revenueChart = [
  { month: 'Jan', val: 180 }, { month: 'Feb', val: 240 }, { month: 'Mar', val: 210 },
  { month: 'Apr', val: 310 }, { month: 'May', val: 390 }, { month: 'Jun', val: 410 },
]
const maxRev = computed(() => Math.max(...revenueChart.map(d => d.val)))

const recentActivity = [
  { id: 1, text: 'New user registered: Funmi Adeleke', time: '2 min ago', icon: UserPlus, color: 'text-primary',  bg: 'bg-primary/10'  },
  { id: 2, text: 'Listing flagged for review: Studio Apt, Yaba', time: '11 min ago', icon: Flag, color: 'text-warning', bg: 'bg-warning/10' },
  { id: 3, text: 'Payment of ₦40,000 received (Bronze Plan)', time: '34 min ago', icon: CreditCard, color: 'text-success', bg: 'bg-success/10' },
  { id: 4, text: 'User Emeka Johnson disabled by admin', time: '1 hr ago', icon: ShieldAlert, color: 'text-danger', bg: 'bg-danger/10' },
  { id: 5, text: 'Listing "Penthouse, Ikoyi" verified', time: '2 hrs ago', icon: BadgeCheck, color: 'text-success', bg: 'bg-success/10' },
]

const quickActions = [
  { label: 'Manage Users',    tab: 'users',    icon: Users,       color: 'text-primary', bg: 'bg-primary/10'   },
  { label: 'Review Listings', tab: 'listings', icon: Building2,   color: 'text-success', bg: 'bg-success/10'   },
  { label: 'View Revenue',    tab: 'revenue',  icon: DollarSign,  color: 'text-warning', bg: 'bg-warning/10'   },
  { label: 'View Reports',    tab: 'reports',  icon: Flag,        color: 'text-danger',  bg: 'bg-danger/10'    },
]

// ── Users ─────────────────────────────────────────────────────────────────
const users = ref([
  { id: 'u1', name: 'Tunde Adeyemi',    email: 'tunde@example.com',   phone: '08012345678', joined: 'Jan 15, 2024', listings: 4, plan: 'Silver Plan', status: 'Active',   avatar: 'https://i.pravatar.cc/150?u=tunde'  },
  { id: 'u2', name: 'Sarah Williams',   email: 'sarah@homes.ng',      phone: '08034567890', joined: 'Jan 10, 2024', listings: 7, plan: 'Bronze Plan', status: 'Active',   avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=sarah'  },
  { id: 'u3', name: 'Emeka Johnson',    email: 'emeka@realty.ng',     phone: '08056789012', joined: 'Dec 5, 2023',  listings: 3, plan: 'Free Plan',   status: 'Disabled', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=emeka'  },
  { id: 'u4', name: 'Amara Peters',     email: 'amara@prime.ng',      phone: '08078901234', joined: 'Feb 2, 2024',  listings: 5, plan: 'Silver Plan', status: 'Active',   avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=amara'  },
  { id: 'u5', name: 'Chioma Obi',       email: 'chioma@property.ng',  phone: '07012345678', joined: 'Nov 20, 2023', listings: 2, plan: 'Free Plan',   status: 'Active',   avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=chioma' },
  { id: 'u6', name: 'Lagos Homes Realty',email:'lagos@homes.ng',      phone: '08099887766', joined: 'Oct 1, 2023',  listings: 9, plan: 'Gold Plan',   status: 'Active',   avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=lagos'  },
  { id: 'u7', name: 'Prime Properties', email: 'prime@estate.ng',     phone: '09012345678', joined: 'Sep 14, 2023', listings: 6, plan: 'Bronze Plan', status: 'Active',   avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=prime'  },
  { id: 'u8', name: 'Funmi Adeleke',    email: 'funmi@gmail.com',     phone: '08023456789', joined: 'Mar 1, 2024',  listings: 0, plan: 'Free Plan',   status: 'Active',   avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=funmi'  },
])

const filteredUsers = computed(() => {
  let list = users.value
  if (userFilter.value !== 'All') list = list.filter(u => u.status === userFilter.value)
  if (userSearch.value) {
    const q = userSearch.value.toLowerCase()
    list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  return list
})

const toggleUserStatus = (user) => {
  user.status = user.status === 'Active' ? 'Disabled' : 'Active'
  toast.success(`${user.name} has been ${user.status === 'Active' ? 'enabled' : 'disabled'}.`)
}

const viewUser = (user) => { selectedUser.value = user }

// ── Listings ──────────────────────────────────────────────────────────────
const adminListings = ref(mockProperties.map((p, i) => ({
  ...p,
  adminStatus: i === 3 ? 'Pending' : i === 5 ? 'Disabled' : i === 10 ? 'Pending' : 'Active',
})))

const filteredListings = computed(() => {
  let list = adminListings.value
  if (listingFilter.value !== 'All') list = list.filter(l => l.adminStatus === listingFilter.value)
  if (listingSearch.value) {
    const q = listingSearch.value.toLowerCase()
    list = list.filter(l => l.title.toLowerCase().includes(q) || l.address.toLowerCase().includes(q))
  }
  return list
})

const toggleVerified   = (l)  => { l.isVerified = !l.isVerified; toast.success(`Listing ${l.isVerified ? 'verified' : 'unverified'}.`) }
const approveListing   = (l)  => { l.adminStatus = 'Active'; toast.success('Listing approved and published.') }
const toggleListingStatus = (l) => {
  l.adminStatus = l.adminStatus === 'Disabled' ? 'Active' : 'Disabled'
  toast.success(`Listing ${l.adminStatus === 'Active' ? 'enabled' : 'disabled'}.`)
}
const deleteListing = (id) => {
  const idx = adminListings.value.findIndex(l => l.id === id)
  if (idx !== -1) adminListings.value.splice(idx, 1)
  toast.success('Listing deleted.')
}

const statusBadge = (s) => ({
  Active:   'bg-success/10 text-success',
  Pending:  'bg-warning/10 text-warning',
  Disabled: 'bg-danger/10 text-danger',
}[s] || 'bg-brand-bg text-brand-muted')

const fmtPrice = (p) => {
  if (p >= 1_000_000_000) return `₦${(p / 1_000_000_000).toFixed(1)}B`
  if (p >= 1_000_000)     return `₦${(p / 1_000_000).toFixed(1)}M`
  if (p >= 1_000)         return `₦${(p / 1_000).toFixed(0)}k`
  return `₦${p.toLocaleString()}`
}

// ── Revenue ───────────────────────────────────────────────────────────────
const revenueStats = [
  { label: 'Total Revenue',  value: '₦14.3M', icon: TrendingUp, color: 'text-success',  bg: 'bg-success/10'  },
  { label: 'This Month',     value: '₦4.1M',  icon: DollarSign, color: 'text-primary',  bg: 'bg-primary/10'  },
  { label: 'Subscriptions',  value: '₦8.9M',  icon: CreditCard, color: 'text-warning',  bg: 'bg-warning/10'  },
  { label: 'Premium & Boosts',value: '₦5.4M', icon: Activity,   color: 'text-secondary',bg: 'bg-secondary/10'},
]

const transactions = ref([
  { id: 't1', user: 'Sarah Williams',    email: 'sarah@homes.ng',     type: 'Gold Plan',   typeClass: 'bg-success/10 text-success',   date: 'Mar 1, 2026',  amount: '₦64,000', status: 'Successful' },
  { id: 't2', user: 'Lagos Homes Realty',email: 'lagos@homes.ng',     type: 'Bronze Plan', typeClass: 'bg-primary/10 text-primary',   date: 'Feb 28, 2026', amount: '₦40,000', status: 'Successful' },
  { id: 't3', user: 'Amara Peters',      email: 'amara@prime.ng',     type: 'Silver Plan', typeClass: 'bg-warning/10 text-warning',   date: 'Feb 25, 2026', amount: '₦18,000', status: 'Successful' },
  { id: 't4', user: 'Funmi Adeleke',     email: 'funmi@gmail.com',    type: 'Gold Plan',   typeClass: 'bg-success/10 text-success',   date: 'Feb 20, 2026', amount: '₦64,000', status: 'Successful' },
  { id: 't5', user: 'Prime Properties',  email: 'prime@estate.ng',    type: 'Bronze Plan', typeClass: 'bg-primary/10 text-primary',   date: 'Feb 18, 2026', amount: '₦40,000', status: 'Successful' },
  { id: 't6', user: 'Chioma Obi',        email: 'chioma@property.ng', type: 'Silver Plan', typeClass: 'bg-warning/10 text-warning',   date: 'Feb 10, 2026', amount: '₦18,000', status: 'Pending'    },
])

// ── Reports ───────────────────────────────────────────────────────────────
const healthStats = [
  { label: 'Uptime',       value: '99.9%', icon: Server,    color: 'text-success', bg: 'bg-success/10' },
  { label: 'API Latency',  value: '42ms',  icon: Wifi,      color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'DB Size',      value: '1.2 GB',icon: Database,  color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Avg Response', value: '180ms', icon: Clock,     color: 'text-secondary',bg:'bg-secondary/10'},
]

const flaggedContent = ref([
  { id: 'f1', title: 'Suspicious Listing — Duplicate Address',    description: 'Listing ID #4 shares the same address as 3 other listings. Possible duplicate or scam.', severity: 'High',   severityClass: 'bg-danger/10 text-danger',  icon: AlertTriangle, iconColor: 'text-danger',  iconBg: 'bg-danger/10',  time: '1 hr ago'  },
  { id: 'f2', title: 'User Reported for Spam Messages',          description: 'User "Chioma Obi" has been reported 3 times for sending unsolicited DMs.',             severity: 'Medium', severityClass: 'bg-warning/10 text-warning',icon: MessageSquare, iconColor: 'text-warning', iconBg: 'bg-warning/10', time: '4 hrs ago' },
])

const platformLogs = [
  { id: 1, level: 'INFO',  levelClass: 'bg-primary/10 text-primary',  time: '14:32:01', message: 'User auth token refreshed — user_id: u1' },
  { id: 2, level: 'WARN',  levelClass: 'bg-warning/10 text-warning',  time: '14:28:14', message: 'Rate limit hit on POST /listings — IP: 41.xxx' },
  { id: 3, level: 'INFO',  levelClass: 'bg-primary/10 text-primary',  time: '14:20:00', message: 'Payment webhook received — ref: BRG20260305' },
  { id: 4, level: 'ERROR', levelClass: 'bg-danger/10 text-danger',    time: '13:55:42', message: 'Image upload failed — file too large (>5MB)' },
  { id: 5, level: 'INFO',  levelClass: 'bg-primary/10 text-primary',  time: '13:40:11', message: 'New listing submitted — listing_id: 13' },
  { id: 6, level: 'INFO',  levelClass: 'bg-primary/10 text-primary',  time: '13:10:00', message: 'Daily analytics snapshot generated' },
]

const resolveReport = (report) => {
  const idx = flaggedContent.value.findIndex(r => r.id === report.id)
  if (idx !== -1) flaggedContent.value.splice(idx, 1)
  toast.success('Report resolved.')
}
</script>
