<script setup lang="ts">
import IconKey from '@/components/icons/IconKey.vue'
import IconSliders from '@/components/icons/IconSliders.vue'
import IconWallet from '@/components/icons/IconWallet.vue'

const benefits = [
  { icon: IconWallet, lead: 'Share Wallet & Transactions', text: 'with trusted members.' },
  { icon: IconSliders, lead: 'Full Control.', text: 'Decide who can view or manage finances.' },
  {
    icon: IconKey,
    lead: 'Extra Security.',
    text: 'Uses a separate Secret Key to keep shared data safe.',
  },
]
</script>

<!-- What sharing as a family gives. -->
<template>
  <ul class="flex flex-col gap-3.5">
    <li v-for="benefit in benefits" :key="benefit.lead" class="flex items-center gap-4">
      <span
        aria-hidden="true"
        class="flex size-10 flex-none items-center justify-center rounded-corner-md bg-primary text-on-primary"
      >
        <component :is="benefit.icon" class="size-5.5" />
      </span>
      <span class="text-body-large">
        <strong class="font-semibold">{{ benefit.lead }}</strong> {{ benefit.text }}
      </span>
    </li>
  </ul>
</template>
