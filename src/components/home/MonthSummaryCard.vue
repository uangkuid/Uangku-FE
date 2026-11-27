<script setup lang="ts">
import { computed } from 'vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraCircularProgress from '@/components/ui/circular-progress/OraCircularProgress.vue'
import { formatRupiah } from '@/utils/rupiah'

const props = defineProps<{
  month: string
  income: number
  spending: number
  spentPercent: number
}>()

const percentText = computed(() => `${props.spentPercent.toLocaleString('id-ID')}%`)
</script>

<template>
  <OraCard variant="tertiary" class="gap-4.5 p-5 sm:p-7" aria-labelledby="month-title">
    <div class="flex flex-col gap-1">
      <h2 id="month-title" class="text-title-medium font-semibold">{{ month }} so far</h2>
      <p class="text-body-medium">Income and spending this month.</p>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <dl class="flex flex-col gap-2.5">
        <div class="flex flex-col gap-0.5">
          <dt class="text-[12px] leading-4 font-medium">Income</dt>
          <dd class="font-display text-[20px] leading-7 font-bold text-success tabular-nums">
            {{ formatRupiah(income) }}
          </dd>
        </div>
        <div class="flex flex-col gap-0.5">
          <dt class="text-[12px] leading-4 font-medium">Spending</dt>
          <dd class="font-display text-[20px] leading-7 font-bold text-error tabular-nums">
            {{ formatRupiah(spending) }}
          </dd>
        </div>
      </dl>

      <OraCircularProgress
        :value="spentPercent"
        :label="`${percentText} of income spent`"
        :size="136"
        :thickness="18"
        :gap="6"
        indicator-class="stroke-error"
        track-class="stroke-success"
      >
        <span class="font-display text-[20px] leading-6.5 font-bold">{{ percentText }}</span>
        <span class="text-[11px] leading-3.5">spent</span>
      </OraCircularProgress>
    </div>

    <div
      class="flex flex-wrap items-center justify-between gap-x-3 rounded-corner-lg-inc bg-surface-container-lowest px-4 py-3 text-on-surface"
    >
      <span class="text-[13px] leading-4.5 font-medium">Left to use</span>
      <span class="text-[16px] leading-6 font-bold tabular-nums">
        {{ formatRupiah(income - spending) }}
      </span>
    </div>
  </OraCard>
</template>
