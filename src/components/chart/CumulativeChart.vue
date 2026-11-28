<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onRadioKeydown, radioTabindex } from '@/components/ui/shared/radioGroup'
import { formatRupiah } from '@/utils/rupiah'

const props = defineProps<{
  days: string[]
  /** Cumulative totals, one per day. */
  income: number[]
  spending: number[]
  /** The value at the top of the plot. */
  max: number
  /** Axis labels from the top of the plot down, evenly spaced. */
  ticks: string[]
  /** Accessible name of the chart. */
  label: string
  initialDay: number
  /** Written after the day in the tooltip. */
  year?: number
  /** Masks the amounts. */
  hidden?: boolean
  /** Puts the tooltip over the plot, which needs room above it, instead of beside the line. */
  tooltipAbove?: boolean
}>()

const selected = ref(props.initialDay)
watch(
  () => props.days,
  () => (selected.value = props.initialDay),
)

const last = computed(() => props.days.length - 1)
const x = (day: number) => (day / last.value) * 100
const y = (value: number) => 100 - (value / props.max) * 100

function line(values: number[]) {
  return values.map((value, day) => `${day ? 'L' : 'M'}${x(day)} ${y(value)}`).join(' ')
}

const amount = (value: number) => (props.hidden ? 'Rp ••••' : formatRupiah(value))

const series = computed(() => [
  {
    name: 'Income',
    short: 'In',
    values: props.income,
    stroke: 'stroke-success',
    dot: 'bg-success',
  },
  {
    name: 'Expense',
    short: 'Out',
    values: props.spending,
    stroke: 'stroke-error',
    dot: 'bg-error',
  },
])

/** Each day's hit area; the first and last are half as wide, to stay inside the plot. */
function column(day: number) {
  const width = 100 / last.value
  if (day === 0) return { left: '0%', width: `${width / 2}%` }
  if (day === last.value) return { left: `${100 - width / 2}%`, width: `${width / 2}%` }
  return { left: `${x(day) - width / 2}%`, width: `${width}%` }
}

const tooltipPlace = computed(() => {
  const day = selected.value
  const left = `${x(day)}%`
  if (props.tooltipAbove) {
    const shift = day === 0 ? '-12px' : day === last.value ? 'calc(-100% + 12px)' : '-50%'
    return { left, bottom: 'calc(100% + 8px)', translate: shift }
  }
  return { left, top: '8px', translate: day > last.value / 2 ? 'calc(-100% - 16px)' : '16px' }
})
</script>

<!-- Income and spending added up day by day. Pointing at or focusing a day reads its totals. -->
<template>
  <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
    <div
      aria-hidden="true"
      class="-my-2 flex h-64 flex-col items-end justify-between text-label-small text-on-surface-variant tabular-nums"
    >
      <span v-for="tick in ticks" :key="tick">{{ tick }}</span>
    </div>

    <div class="relative h-60">
      <div aria-hidden="true" class="absolute inset-0 flex flex-col justify-between">
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
        <path :d="`${line(income)} L100 100 L0 100 Z`" class="fill-success opacity-10" />
        <path
          v-for="item in series"
          :key="item.name"
          :d="line(item.values)"
          :class="item.stroke"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <span
        aria-hidden="true"
        class="absolute inset-y-0 border-l-[1.5px] border-dashed border-outline"
        :style="{ left: `${x(selected)}%` }"
      ></span>
      <span
        v-for="item in series"
        :key="item.name"
        aria-hidden="true"
        class="absolute size-3.5 -translate-1/2 rounded-full ring-3 ring-surface-container-low"
        :class="item.dot"
        :style="{ left: `${x(selected)}%`, top: `${y(item.values[selected] ?? 0)}%` }"
      ></span>

      <div role="radiogroup" :aria-label="label" class="absolute inset-0" @keydown="onRadioKeydown">
        <button
          v-for="(day, index) in days"
          :key="day"
          type="button"
          role="radio"
          :aria-checked="index === selected"
          :aria-label="`${day}: income ${amount(income[index] ?? 0)}, expense ${amount(spending[index] ?? 0)}`"
          :tabindex="radioTabindex([...days.keys()], selected, index)"
          class="focus-ring absolute inset-y-0 cursor-pointer rounded-corner-sm"
          :style="column(index)"
          @click="selected = index"
          @focus="selected = index"
          @mouseenter="selected = index"
        ></button>
      </div>

      <div
        role="status"
        class="pointer-events-none absolute z-10 flex min-w-44 flex-col gap-1.5 rounded-corner-lg bg-inverse-surface px-3.5 py-3 whitespace-nowrap text-inverse-on-surface shadow-elevation-3"
        :style="tooltipPlace"
      >
        <span class="text-label-medium opacity-75">
          {{ days[selected] }}{{ year ? ` ${year}` : '' }}
        </span>
        <span
          v-for="item in series"
          :key="item.name"
          class="flex justify-between gap-4 text-body-medium font-semibold"
        >
          <span class="inline-flex items-center gap-1.5">
            <span class="size-2 rounded-full" :class="item.dot"></span>{{ item.short }}
          </span>
          <span class="tabular-nums">{{ amount(item.values[selected] ?? 0) }}</span>
        </span>
      </div>
    </div>

    <span></span>
    <div aria-hidden="true" class="relative h-7 text-label-small text-on-surface-variant">
      <span
        v-for="(day, index) in days"
        :key="day"
        class="absolute top-2.5 whitespace-nowrap"
        :class="[
          index === selected && 'font-bold text-on-surface',
          index === 0 ? '' : index === last ? '-translate-x-full' : '-translate-x-1/2',
          index % 2 && index !== selected && 'max-sm:hidden',
        ]"
        :style="{ left: `${x(index)}%` }"
      >
        {{ day }}
      </span>
    </div>
  </div>
</template>
