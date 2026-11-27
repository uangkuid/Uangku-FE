<script setup lang="ts">
import { ref } from 'vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppTag from '@/components/ui/AppTag.vue'
import ComingSoonLink from '@/components/ui/ComingSoonLink.vue'
import FamilyIcon from '@/components/ui/FamilyIcon.vue'
import type { Wallet } from '@/data/home'
import { formatRupiah } from '@/utils/rupiah'

defineProps<{
  total: number
  monthlyChange: number
  /** The wallets previewed on the card. */
  wallets: Wallet[]
  walletCount: number
}>()

/** Hides the total and the wallet balances from onlookers. */
const hidden = ref(false)
</script>

<template>
  <AppCard
    variant="primary"
    class="relative gap-6 overflow-hidden p-5 sm:p-7"
    aria-labelledby="balance-title"
  >
    <svg
      class="absolute -top-27.5 -right-22.5 size-80 opacity-18"
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M50 2c6 0 9 6 14 8s12-1 16 3 1 11 3 16 8 8 8 14-6 9-8 14 1 12-3 16-11 1-16 3-8 8-14 8-9-6-14-8-12 1-16-3-1-11-3-16-8-8-8-14 6-9 8-14-1-12 3-16 11-1 16-3 8-8 14-8z"
      />
    </svg>

    <div class="relative flex flex-col gap-1">
      <h2 id="balance-title" class="text-[15px] leading-5 font-medium opacity-90">Total balance</h2>
      <div class="flex flex-wrap items-center gap-2.5">
        <span
          class="font-display text-headline-small font-bold tracking-[-1px] whitespace-nowrap tabular-nums sm:text-[48px] sm:leading-14"
          data-testid="total-balance"
        >
          {{ hidden ? 'Rp ••••••••' : formatRupiah(total) }}
        </span>
        <AppIconButton
          :label="hidden ? 'Show balance' : 'Hide balance'"
          :selected="hidden"
          class="bg-on-primary-container text-on-primary!"
          @click="hidden = !hidden"
        >
          <IconEye stroke-width="1.8" :off="!hidden" />
        </AppIconButton>
      </div>
      <AppTag color="primary" size="m" class="self-start">
        +{{ formatRupiah(monthlyChange) }} this month
      </AppTag>
    </div>

    <div
      class="relative mt-auto grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-2"
    >
      <ComingSoonLink
        v-for="wallet in wallets"
        :key="wallet.name"
        class="state-layer focus-ring transition-morph flex min-h-30 min-w-0 flex-col justify-between gap-5 rounded-corner-xl bg-primary-container p-4 text-on-primary-container active:rounded-corner-lg sm:p-5"
      >
        <span class="flex min-w-0 items-center gap-2">
          <span class="truncate text-title-small font-semibold">{{ wallet.name }}</span>
          <FamilyIcon v-if="wallet.family" />
        </span>
        <span class="truncate font-display text-headline-small font-medium tabular-nums">
          {{ hidden ? 'Rp ••••••' : formatRupiah(wallet.balance) }}
        </span>
      </ComingSoonLink>
      <AppButton
        :as="ComingSoonLink"
        class="col-span-full mt-1 justify-self-start bg-on-primary-container! text-on-primary!"
      >
        All {{ walletCount }} wallets
        <IconChevronRight />
      </AppButton>
    </div>
  </AppCard>
</template>
