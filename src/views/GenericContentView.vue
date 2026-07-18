<template>
  <AppLayout>
    <div class="page-pad pb-10">
      <div class="card p-6">
        <h2 class="text-xl font-extrabold text-secondary mb-2">{{ title }}</h2>
        <p class="text-brand-light text-xs mb-6">Last updated: January 2024</p>
        <div class="prose prose-sm max-w-none text-brand-muted leading-relaxed space-y-4" v-html="content"></div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'

const route = useRoute()
const title = computed(() => decodeURIComponent(route.params.title))

const contentMap = {
  'Terms & Conditions': `
    <h4 class="font-bold text-secondary">1. Acceptance of Terms</h4>
    <p>By accessing or using BRG Prime, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
    <h4 class="font-bold text-secondary">2. Use of Platform</h4>
    <p>BRG Prime is a real estate marketplace connecting buyers, sellers, renters, and agents across Nigeria. You agree to use the platform only for lawful purposes.</p>
    <h4 class="font-bold text-secondary">3. Listing Accuracy</h4>
    <p>Agents are solely responsible for the accuracy of their listings. BRG Prime does not guarantee the accuracy of any listing information.</p>
    <h4 class="font-bold text-secondary">4. Payments</h4>
    <p>All subscription payments are processed securely. Refunds are subject to our refund policy available on request.</p>
    <h4 class="font-bold text-secondary">5. Limitation of Liability</h4>
    <p>BRG Prime is not liable for any transactions conducted between users. Always conduct due diligence before committing to any property transaction.</p>
    <h4 class="font-bold text-secondary">6. Contact</h4>
    <p>For enquiries regarding these terms, contact us at legal@brgprime.com.</p>
  `,
  'Privacy Policy': `
    <h4 class="font-bold text-secondary">1. Information We Collect</h4>
    <p>We collect personal information you provide when registering, including name, email, phone number, and government ID (for agents).</p>
    <h4 class="font-bold text-secondary">2. How We Use Your Information</h4>
    <p>Your information is used to provide and improve our services, process payments, communicate with you, and ensure platform security.</p>
    <h4 class="font-bold text-secondary">3. Data Security</h4>
    <p>We implement industry-standard security measures to protect your data from unauthorised access.</p>
    <h4 class="font-bold text-secondary">4. Sharing of Information</h4>
    <p>We do not sell your personal information. We may share data with trusted service providers who assist in operating our platform.</p>
    <h4 class="font-bold text-secondary">5. Your Rights</h4>
    <p>You have the right to access, correct, or delete your personal data at any time through your account settings.</p>
  `,
  'About BRG Prime': `
    <p>BRG Prime is Nigeria's premier property marketplace, connecting thousands of buyers, sellers, renters, and agents across the country.</p>
    <h4 class="font-bold text-secondary">Our Mission</h4>
    <p>To make property transactions in Nigeria transparent, efficient, and accessible to everyone — from first-time renters to major investors.</p>
    <h4 class="font-bold text-secondary">What We Offer</h4>
    <p>Buy, sell, rent, lease, and shortlet properties across Nigeria's top cities. Our verified listings, agent profiles, and secure messaging ensure a trustworthy experience.</p>
    <h4 class="font-bold text-secondary">Our Values</h4>
    <p>Transparency · Integrity · Innovation · Customer-First</p>
    <h4 class="font-bold text-secondary">Contact</h4>
    <p>Email: hello@brgprime.com<br/>WhatsApp: +234 801 234 5678<br/>Address: 14 Admiralty Way, Lekki Phase 1, Lagos</p>
  `,
}

const content = computed(() => contentMap[title.value] || `<p>Content for "${title.value}" is coming soon.</p>`)
</script>
