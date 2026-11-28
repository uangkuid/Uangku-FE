<script setup lang="ts">
import { computed } from 'vue'
import ShapeScallop from '@/components/shapes/ShapeScallop.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import type { WalletAccount } from '@/data/wallets'
import { formatRupiah } from '@/utils/rupiah'

const props = defineProps<{ wallets: WalletAccount[] }>()

function sum(wallets: WalletAccount[]) {
  return wallets.reduce((total, wallet) => total + wallet.balance, 0)
}

const total = computed(() => sum(props.wallets))
const groups = computed(() =>
  [
    { name: 'Personal', wallets: props.wallets.filter((wallet) => !wallet.family) },
    { name: 'Family', wallets: props.wallets.filter((wallet) => wallet.family) },
  ].map(({ name, wallets }) => {
    const balance = sum(wallets)
    return {
      name,
      count: wallets.length,
      balance,
      percent: total.value ? Math.round((balance / total.value) * 100) : 0,
    }
  }),
)
const shares = computed(() =>
  groups.value.map((group) => `${group.name} ${group.percent} percent`).join(', '),
)
</script>

<template>
  <OraCard
    variant="primary"
    class="relative flex-row! flex-wrap items-end justify-between gap-6 overflow-hidden p-7"
    aria-labelledby="total-title"
  >
    <ShapeScallop class="absolute -bottom-37.5 -left-20 size-75 opacity-16" />
    <div class="relative flex flex-col gap-1">
      <h2 id="total-title" class="text-[15px] leading-5 font-medium opacity-90">Total balance</h2>
      <span
        class="font-display text-headline-large font-bold tracking-[-1px] tabular-nums sm:text-[48px] sm:leading-14"
      >
        {{ formatRupiah(total) }}
      </span>
    </div>
    <div class="relative flex flex-[0_1_460px] flex-col gap-3">
      <div role="img" :aria-label="shares" class="flex h-4 gap-1">
        <div
          class="min-w-2 rounded-l-corner-sm rounded-r-corner-xs bg-surface-container-lowest"
          :style="{ flex: `${groups[0]!.percent} 1 0` }"
        ></div>
        <div
          class="min-w-2 rounded-l-corner-xs rounded-r-corner-sm bg-tertiary-container"
          :style="{ flex: `${groups[1]!.percent} 1 0` }"
        ></div>
      </div>
      <dl class="flex justify-between gap-4 tabular-nums">
        <div v-for="group in groups" :key="group.name" class="flex flex-col last:text-right">
          <dt class="text-body-small opacity-90">{{ group.name }} · {{ group.count }}</dt>
          <dd class="text-[18px] leading-6.5 font-bold">{{ formatRupiah(group.balance) }}</dd>
        </div>
      </dl>
    </div>
  </OraCard>
</template>
