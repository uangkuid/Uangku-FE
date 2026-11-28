<script setup lang="ts">
import OraCard from '@/components/ui/card/OraCard.vue'
import { reportData } from '@/data/report'
import { formatRupiah } from '@/utils/rupiah'

const { months, income, expense, max, ticks, badge, summary } = reportData.trend
const last = months.length - 1

const x = (month: number) => (month / last) * 100
const y = (value: number) => 100 - (value / max) * 100

/** A Catmull-Rom curve through the months, as cubic Bézier segments. */
function smooth(values: number[]) {
  const points = values.map((value, month) => [x(month), y(value)] as const)
  return points.slice(0, -1).reduce((path, from, index) => {
    const to = points[index + 1]!
    const before = points[index - 1] ?? from
    const after = points[index + 2] ?? to
    const first = [from[0] + (to[0] - before[0]) / 6, from[1] + (to[1] - before[1]) / 6]
    const second = [to[0] - (after[0] - from[0]) / 6, to[1] - (after[1] - from[1]) / 6]
    return `${path} C${first} ${second} ${to}`
  }, `M${points[0]}`)
}

const series = [
  { name: 'Income', values: income, stroke: 'stroke-success', dot: 'border-success' },
  { name: 'Expense', values: expense, stroke: 'stroke-error', dot: 'border-error' },
]
const expensePath = smooth(expense)
</script>

<template>
  <OraCard variant="outlined" class="gap-4 p-6" aria-labelledby="trend-title">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 id="trend-title" class="text-title-medium font-semibold">Income &amp; expense trend</h2>
      <div class="flex gap-2 text-label-medium font-semibold">
        <span
          class="inline-flex h-7 items-center gap-1.5 rounded-full bg-success-container px-3 text-on-success-container"
        >
          <span class="size-2.5 rounded-full bg-success"></span>Income
        </span>
        <span
          class="inline-flex h-7 items-center gap-1.5 rounded-full bg-error-container px-3 text-on-error-container"
        >
          <span class="size-2.5 rounded-full bg-error"></span>Expense
        </span>
      </div>
    </div>

    <div class="grid grid-cols-[48px_minmax(0,1fr)] gap-x-3 pr-3">
      <div
        aria-hidden="true"
        class="flex h-55 flex-col items-end justify-between text-label-small text-on-surface-variant"
      >
        <span v-for="tick in ticks" :key="tick">{{ tick }}</span>
      </div>
      <div role="img" :aria-label="summary" class="relative h-55">
        <div class="absolute inset-0 flex flex-col justify-between">
          <div
            v-for="(tick, index) in ticks"
            :key="tick"
            class="border-t border-outline-variant"
            :class="index < ticks.length - 1 && 'border-dashed'"
          ></div>
        </div>
        <svg
          class="absolute inset-0 size-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path :d="`${expensePath} L100,100 L0,100 Z`" class="fill-error opacity-8" />
          <path
            v-for="item in series"
            :key="item.name"
            :d="smooth(item.values)"
            :class="item.stroke"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
        <template v-for="item in series" :key="item.name">
          <span
            v-for="(value, month) in item.values"
            :key="month"
            :title="`${item.name} ${months[month]}: ${formatRupiah(value)}`"
            class="absolute -translate-1/2 rounded-full border-3 bg-surface-container-lowest"
            :class="[item.dot, month === last ? 'size-4.5' : 'size-3']"
            :style="{ left: `${x(month)}%`, top: `${y(value)}%` }"
          ></span>
        </template>
        <span
          class="absolute -top-2 right-0 inline-flex h-7 translate-x-3 items-center rounded-full bg-inverse-surface px-3 text-label-medium font-semibold whitespace-nowrap text-inverse-on-surface"
        >
          {{ badge }}
        </span>
      </div>
      <span></span>
      <div
        aria-hidden="true"
        class="flex justify-between pt-2.5 text-body-small text-on-surface-variant"
      >
        <span
          v-for="(month, index) in months"
          :key="month"
          :class="index === last && 'font-bold text-on-surface'"
        >
          {{ month }}
        </span>
      </div>
    </div>
  </OraCard>
</template>
