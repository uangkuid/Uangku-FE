<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import IconCalendar from '@/components/icons/IconCalendar.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import OraChip from '@/components/ui/chip/OraChip.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraMonthStrip from '@/components/ui/month-strip/OraMonthStrip.vue'
import {
  addDays,
  dateParts,
  FULL_MONTH_NAMES,
  formatShortDate,
  monthWeeks,
  toIso,
  WEEKDAY_NAMES,
  type IsoDate,
} from '@/utils/date'

const props = defineProps<{ today: IsoDate }>()

const from = defineModel<IsoDate | undefined>('from')
const to = defineModel<IsoDate | undefined>('to')

/** Which end of the range the next pressed day sets. */
const picking = ref<'from' | 'to'>(from.value ? 'to' : 'from')

// A cleared range starts over from its first day.
watch(from, (date) => {
  if (!date) picking.value = 'from'
})

const view = ref(dateParts(from.value ?? props.today))

/** `month` may run past either end of the year. */
function show(year: number, month: number) {
  view.value = dateParts(toIso(new Date(year, month, 1)))
}

const monthTitle = computed(() => `${FULL_MONTH_NAMES[view.value.month]} ${view.value.year}`)
const weeks = computed(() => monthWeeks(view.value.year, view.value.month))

const presets = computed(() => {
  const { year, month } = dateParts(props.today)
  const day = (y: number, m: number, d: number) => toIso(new Date(y, m, d))
  return [
    { label: 'This month', from: day(year, month, 1), to: day(year, month + 1, 0) },
    { label: 'Last 7 days', from: addDays(props.today, -6), to: props.today },
    { label: 'Last month', from: day(year, month - 1, 1), to: day(year, month, 0) },
    { label: 'This year', from: day(year, 0, 1), to: day(year, 11, 31) },
  ]
})

function pickPreset(preset: { from: IsoDate; to: IsoDate }) {
  from.value = preset.from
  to.value = preset.to
  picking.value = 'to'
  view.value = dateParts(preset.from)
}

function focusEnd(end: 'from' | 'to') {
  picking.value = end
  const date = (end === 'from' ? from.value : to.value) ?? from.value
  if (date) view.value = dateParts(date)
}

function pickDay(date: IsoDate) {
  if (picking.value === 'from' || !from.value) {
    from.value = date
    if (to.value && to.value < date) to.value = undefined
    picking.value = 'to'
  } else if (date < from.value) {
    from.value = date
  } else {
    to.value = date
    picking.value = 'from'
  }
}

/** The day in the tab order: the start of the range, or else the 1st of the month. */
const tabDate = computed(() => {
  const days = weeks.value.flat().filter((cell) => cell.inMonth)
  return (days.find((cell) => cell.date === from.value) ?? days[0])?.date
})

function onDayKeydown(event: KeyboardEvent) {
  const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key]
  if (!step) return
  event.preventDefault()
  const grid = (event.currentTarget as HTMLElement).closest('[role="grid"]')
  const days = [...(grid?.querySelectorAll<HTMLElement>('button') ?? [])]
  days[days.indexOf(event.currentTarget as HTMLElement) + step]?.focus()
}

/** The month's days with where each one stands in the range. */
const rows = computed(() => {
  const start = from.value
  const end = to.value ?? start
  const lastDay = new Date(view.value.year, view.value.month + 1, 0).getDate()
  return weeks.value.map((week) =>
    week.map((cell, column) => {
      const isFrom = cell.date === start
      const isTo = cell.date === to.value
      const inRange =
        cell.inMonth && !!start && !!end && start !== end && cell.date >= start && cell.date <= end
      return {
        ...cell,
        isEnd: isFrom || isTo,
        inRange,
        // The band behind the range is rounded where it starts and stops, and at each week's edges.
        roundStart: isFrom || column === 0 || cell.day === 1,
        roundEnd: cell.date === end || column === 6 || cell.day === lastDay,
        label: [
          `${cell.day} ${FULL_MONTH_NAMES[view.value.month]} ${view.value.year}`,
          cell.date === props.today && 'today',
          isFrom ? 'range start' : isTo ? 'range end' : inRange && 'in range',
        ]
          .filter(Boolean)
          .join(', '),
      }
    }),
  )
})

const ends = computed(() => [
  { key: 'from' as const, label: 'From', date: from.value },
  { key: 'to' as const, label: 'To', date: to.value },
])
</script>

<!-- A date range: its two ends, shortcuts, and a month to pick them in. -->
<template>
  <div class="flex flex-col gap-3.5 px-2">
    <div class="flex gap-3">
      <div v-for="end in ends" :key="end.key" class="flex min-w-0 flex-1 flex-col gap-1.5">
        <span class="text-label-large" aria-hidden="true">{{ end.label }}</span>
        <button
          type="button"
          class="state-layer focus-ring flex h-14 cursor-pointer items-center gap-3 rounded-field border bg-surface px-4 text-body-large"
          :class="[
            picking === end.key ? 'border-primary inset-ring inset-ring-primary' : 'border-outline',
            end.date ? 'text-on-surface' : 'text-on-surface-variant',
          ]"
          :aria-pressed="picking === end.key"
          :aria-label="`${end.label}, ${end.date ? formatShortDate(end.date) : 'Pick date'}`"
          @click="focusEnd(end.key)"
        >
          <IconCalendar class="size-5.5 flex-none text-on-surface-variant" />
          <span class="truncate">{{ end.date ? formatShortDate(end.date) : 'Pick date' }}</span>
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <OraChip
        v-for="preset in presets"
        :key="preset.label"
        :selected="from === preset.from && to === preset.to"
        @click="pickPreset(preset)"
      >
        {{ preset.label }}
      </OraChip>
    </div>

    <div class="flex items-center gap-1">
      <span class="flex-1 text-title-medium font-semibold" aria-live="polite">{{
        monthTitle
      }}</span>
      <OraIconButton label="Previous year" @click="show(view.year - 1, view.month)">
        <IconChevronLeft class="size-5!" />
      </OraIconButton>
      <span class="min-w-10 text-center text-label-large font-semibold tabular-nums">
        {{ view.year }}
      </span>
      <OraIconButton label="Next year" @click="show(view.year + 1, view.month)">
        <IconChevronRight class="size-5!" />
      </OraIconButton>
    </div>

    <OraMonthStrip
      class="-mx-2"
      :month="view.month"
      @select="show(view.year, $event)"
      @step="show(view.year, view.month + $event)"
    />

    <div role="grid" :aria-label="monthTitle" class="flex flex-col gap-1">
      <div role="row" class="grid grid-cols-7">
        <span
          v-for="weekday in WEEKDAY_NAMES"
          :key="weekday"
          role="columnheader"
          class="flex h-8 items-center justify-center text-label-large font-semibold text-on-surface-variant"
        >
          {{ weekday }}
        </span>
      </div>
      <div v-for="week in rows" :key="week[0]?.date" role="row" class="grid grid-cols-7">
        <template v-for="cell in week" :key="cell.date">
          <button
            v-if="cell.inMonth"
            type="button"
            role="gridcell"
            :aria-selected="cell.isEnd || cell.inRange"
            :aria-label="cell.label"
            :tabindex="cell.date === tabDate ? 0 : -1"
            class="group focus-ring flex h-11 cursor-pointer items-center justify-center"
            :class="[
              cell.inRange && 'bg-secondary-container text-on-secondary-container',
              cell.inRange && cell.roundStart && 'rounded-l-full',
              cell.inRange && cell.roundEnd && 'rounded-r-full',
            ]"
            @click="pickDay(cell.date)"
            @keydown="onDayKeydown"
          >
            <span
              class="transition-morph flex size-10 items-center justify-center text-body-medium font-semibold tabular-nums"
              :class="[
                cell.isEnd
                  ? 'rounded-field bg-primary text-on-primary'
                  : 'rounded-[20px] group-hover:bg-on-surface/8',
                cell.date === today && !cell.isEnd && 'inset-ring-[1.5px] inset-ring-primary',
              ]"
            >
              {{ cell.day }}
            </span>
          </button>
          <span
            v-else
            role="gridcell"
            aria-disabled="true"
            class="flex h-11 items-center justify-center text-body-medium font-semibold text-outline-variant tabular-nums"
          >
            {{ cell.day }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
