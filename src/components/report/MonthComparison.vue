<script setup lang="ts">
import OraCard from '@/components/ui/card/OraCard.vue'
import { reportData } from '@/data/report'

const tones = { error: 'text-error', success: 'text-success', primary: 'text-primary' }
</script>

<template>
  <OraCard class="gap-4 p-6" aria-labelledby="comparison-title">
    <div class="flex items-baseline justify-between gap-3">
      <h2 id="comparison-title" class="text-title-medium font-semibold">Month vs month</h2>
      <span class="text-body-small text-on-surface-variant">Nov → Dec 2024</span>
    </div>
    <div
      v-for="row in reportData.compare"
      :key="row.label"
      class="flex flex-col gap-1.5 rounded-corner-lg-inc bg-surface-container-lowest px-4.5 py-4"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-[13px] leading-4.5 text-on-surface-variant">{{ row.label }}</span>
        <span
          class="inline-flex h-6 items-center rounded-full bg-success-container px-2.5 text-label-medium font-bold text-on-success-container"
        >
          {{ row.change }}
        </span>
      </div>
      <div class="flex items-baseline gap-2 tabular-nums">
        <span class="text-body-medium text-on-surface-variant">{{ row.from }}</span>
        <span aria-hidden="true" class="text-on-surface-variant">→</span>
        <span class="sr-only">to</span>
        <span class="font-display text-title-large font-bold" :class="tones[row.tone]">
          {{ row.to }}
        </span>
      </div>
    </div>
  </OraCard>
</template>
