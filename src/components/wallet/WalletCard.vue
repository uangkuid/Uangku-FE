<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { walletLook } from '@/components/wallet/walletLook'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import OraSleepingIcon from '@/components/ui/sleeping-icon/OraSleepingIcon.vue'
import type { WalletAccount } from '@/data/wallets'
import { formatRupiah } from '@/utils/rupiah'

const props = defineProps<{
  wallet: WalletAccount
  /** Its place in the full list, which picks its colors. */
  index: number
  /** Percent of the total balance. */
  share: number
}>()

const look = computed(() => walletLook(props.wallet, props.index))
const shareText = computed(
  () => `${props.share.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`,
)
</script>

<template>
  <li class="flex">
    <RouterLink
      :to="{ name: 'wallet', params: { id: wallet.id } }"
      class="state-layer focus-ring transition-morph flex w-full flex-col gap-4.5 rounded-corner-xl bg-surface-container-low p-5 active:rounded-corner-lg"
      :class="wallet.sleeping && 'text-on-surface-variant'"
    >
      <span class="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          class="flex size-13 flex-none items-center justify-center text-title-medium font-bold tracking-[0.5px]"
          :class="[look.glyph, look.shape]"
        >
          {{ wallet.glyph }}
        </span>
        <span class="flex flex-wrap justify-end gap-1.5">
          <FamilyIcon v-if="wallet.family" labelled />
          <OraSleepingIcon v-if="wallet.sleeping" />
        </span>
      </span>
      <span class="flex flex-col gap-0.5">
        <span class="truncate text-[15px] leading-5.5 font-semibold">{{ wallet.name }}</span>
        <span class="font-display text-headline-small font-bold tabular-nums">
          {{ formatRupiah(wallet.balance) }}
        </span>
      </span>
      <span class="flex items-center gap-2.5">
        <span class="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
          <span class="block h-full rounded-full" :class="look.bar" :style="{ width: `${share}%` }">
          </span>
        </span>
        <span class="text-body-small font-semibold text-on-surface-variant">
          {{ shareText }} of total
        </span>
      </span>
    </RouterLink>
  </li>
</template>
