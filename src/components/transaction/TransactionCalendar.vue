<script setup lang="ts">
import { computed, ref } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraMonthStrip from '@/components/ui/month-strip/OraMonthStrip.vue'
import { dateParts, FULL_MONTH_NAMES, monthWeeks, WEEKDAY_NAMES, type IsoDate } from '@/utils/date'

const props = defineProps<{
  year: number
  today: IsoDate
  /** The transactions to mark on the days. */
  entries: { date: IsoDate; amount: number }[]
}>()

/** 0 for January. */
const month = defineModel<number>('month', { required: true })
/** The only day listed; none while the whole month is. */
const day = defineModel<IsoDate | undefined>('day')

const expanded = ref(false)

const gridLabel = computed(() => `${FULL_MONTH_NAMES[month.value]} ${props.year}`)

const weeks = computed(() =>
  monthWeeks(props.year, month.value).map((week) =>
    week.map((cell) => {
      const own = props.entries.filter((entry) => entry.date === cell.date)
      return {
        ...cell,
        count: own.length,
        income: own.some((entry) => entry.amount > 0),
        spending: own.some((entry) => entry.amount < 0),
      }
    }),
  ),
)

/** Collapsed, the calendar shows the week of the selected day, or else of today. */
const shownWeeks = computed(() => {
  if (expanded.value) return weeks.value
  const now = dateParts(props.today)
  const isCurrent = now.year === props.year && now.month === month.value
  const focus = day.value ?? (isCurrent ? props.today : undefined)
  const week = weeks.value.find((cells) =>
    cells.some((cell) => cell.inMonth && cell.date === focus),
  )
  return [week ?? weeks.value[0]!]
})

function dayLabel(cell: { date: IsoDate; day: number; count: number }) {
  return [
    `${cell.day} ${FULL_MONTH_NAMES[month.value]}`,
    cell.date === props.today && 'today',
    cell.count && `${cell.count} ${cell.count === 1 ? 'transaction' : 'transactions'}`,
  ]
    .filter(Boolean)
    .join(', ')
}

function showMonth(next: number) {
  if (next < 0 || next > 11) return
  month.value = next
  day.value = undefined
}
</script>

<!-- The month's days, as one week or in full. Pressing a day lists only that day. -->
<template>
  <section
    aria-label="Calendar"
    class="flex min-w-0 flex-col gap-3.5 rounded-card bg-surface-container-low px-3 pt-5 pb-2 sm:px-5"
  >
    <OraMonthStrip
      class="-mx-2"
      :month="month"
      :disable-previous="month === 0"
      :disable-next="month === 11"
      @select="showMonth"
      @step="showMonth(month + $event)"
    />

    <div role="grid" :aria-label="gridLabel" class="flex flex-col gap-0.5">
      <div role="row" class="grid grid-cols-7">
        <span
          v-for="weekday in WEEKDAY_NAMES"
          :key="weekday"
          role="columnheader"
          class="flex h-7 items-center justify-center text-label-large font-semibold"
        >
          {{ weekday }}
        </span>
      </div>
      <div v-for="week in shownWeeks" :key="week[0]?.date" role="row" class="grid grid-cols-7">
        <template v-for="cell in week" :key="cell.date">
          <button
            v-if="cell.inMonth"
            type="button"
            role="gridcell"
            :aria-selected="cell.date === day"
            :aria-current="cell.date === today ? 'date' : undefined"
            :aria-label="dayLabel(cell)"
            class="group focus-ring flex h-13.5 cursor-pointer flex-col items-center gap-0.75 rounded-corner-md pt-1"
            @click="day = cell.date === day ? undefined : cell.date"
          >
            <span
              class="transition-morph flex size-9 items-center justify-center text-body-medium font-semibold tabular-nums"
              :class="[
                cell.date === day
                  ? 'rounded-corner-md bg-primary text-on-primary'
                  : 'rounded-[18px] text-on-surface group-hover:bg-surface-container-high',
                cell.date === today && cell.date !== day && 'inset-ring-[1.5px] inset-ring-primary',
              ]"
            >
              {{ cell.day }}
            </span>
            <span aria-hidden="true" class="flex h-1.5 gap-0.75">
              <span v-if="cell.income" class="size-1.5 rounded-full bg-success"></span>
              <span v-if="cell.spending" class="size-1.5 rounded-full bg-error"></span>
            </span>
          </button>
          <span
            v-else
            role="gridcell"
            aria-disabled="true"
            class="flex h-13.5 flex-col items-center pt-1"
          >
            <span
              class="flex size-9 items-center justify-center text-body-medium font-semibold text-outline-variant tabular-nums"
            >
              {{ cell.day }}
            </span>
          </span>
        </template>
      </div>
    </div>

    <div
      class="flex flex-wrap items-center justify-between gap-x-3 border-t border-outline-variant pt-1"
    >
      <span class="inline-flex items-center gap-3 pl-2 text-label-medium text-on-surface-variant">
        <span class="inline-flex items-center gap-1.5">
          <span class="size-2 rounded-full bg-success"></span>Income
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="size-2 rounded-full bg-error"></span>Expense
        </span>
      </span>
      <OraButton variant="text" :aria-expanded="expanded" @click="expanded = !expanded">
        {{ expanded ? 'Show week' : 'Show month' }}
        <IconChevronDown
          class="[transition:rotate_var(--motion-fast-spatial)]"
          :class="expanded && 'rotate-180'"
        />
      </OraButton>
    </div>
  </section>
</template>
