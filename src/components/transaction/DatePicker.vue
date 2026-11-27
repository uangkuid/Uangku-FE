<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import { useDismissOnOutsidePress } from '@/components/ui/dismissOnOutsidePress'
import { onRadioKeydown, radioTabindex } from '@/components/ui/radioGroup'
import type { DayActivity } from '@/data/newTransaction'
import {
  addDays,
  dateParts,
  formatWeekday,
  monthWeeks,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  withMonth,
  type IsoDate,
} from '@/utils/date'

const props = defineProps<{
  /** The day selected when the picker opens. */
  initial: IsoDate
  today: IsoDate
  years: number[]
  /** Marks the days that already have transactions. */
  activityOn: (date: IsoDate) => DayActivity
}>()

const emit = defineEmits<{
  confirm: [date: IsoDate]
  cancel: []
}>()

const titleId = useId()
const root = useTemplateRef('root')

/** Picked but not confirmed yet. */
const selected = ref(props.initial)
/** The month on screen, which may differ from the selected day's. */
const view = ref(dateParts(props.initial))
const yearsOpen = ref(false)
useDismissOnOutsidePress(yearsOpen, useTemplateRef('yearField'))

const gridLabel = computed(() => `${MONTH_NAMES[view.value.month]} ${view.value.year}`)

const weeks = computed(() =>
  monthWeeks(view.value.year, view.value.month).map((week) =>
    week.map((cell) => ({ ...cell, activity: props.activityOn(cell.date) })),
  ),
)

/** The day in the tab order: the selected one, or the 1st while another month shows. */
const tabDate = computed(() => {
  const days = weeks.value.flat().filter((cell) => cell.inMonth)
  return (days.find((cell) => cell.date === selected.value) ?? days[0])?.date
})

function activityText({ income, expense }: DayActivity, joiner: string) {
  return [income && 'income', expense && 'expense'].filter(Boolean).join(joiner)
}

function dayLabel(date: IsoDate, activity: DayActivity) {
  const { year, month, day } = dateParts(date)
  const marks = activityText(activity, ' and ')
  return [
    `${day} ${MONTH_NAMES[month]} ${year}`,
    date === props.today && 'today',
    marks && `has ${marks}`,
  ]
    .filter(Boolean)
    .join(', ')
}

const summary = computed(() => {
  const marks = activityText(props.activityOn(selected.value), ' & ')
  const day = `${formatWeekday(selected.value)} ${dateParts(selected.value).year}`
  return `${day} · ${marks ? `has ${marks}` : 'no transactions yet'}`
})

/** `month` may run past either end of the year. */
function show(year: number, month: number) {
  const first = new Date(year, month, 1)
  view.value = { year: first.getFullYear(), month: first.getMonth(), day: 1 }
}

async function focusIn(selector: string) {
  await nextTick()
  root.value?.querySelector<HTMLElement>(selector)?.focus()
}

function toggleYears() {
  yearsOpen.value = !yearsOpen.value
  if (yearsOpen.value) focusIn('[role="option"][aria-selected="true"], [role="option"]')
}

function pickYear(year: number) {
  show(year, view.value.month)
  closeYears()
}

function closeYears() {
  yearsOpen.value = false
  focusIn('[aria-haspopup="listbox"]')
}

function onYearsKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    return closeYears()
  }
  const step = { ArrowDown: 1, ArrowUp: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  const options = [...(root.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])]
  const index = options.indexOf(event.target as HTMLElement)
  options[(index + step + options.length) % options.length]?.focus()
}

function onYearsFocusout(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !(event.currentTarget as Node).contains(next)) yearsOpen.value = false
}

/** Arrow keys walk the days; Page Up and Page Down walk the months. */
function onDayKeydown(event: KeyboardEvent, date: IsoDate) {
  const days = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key]
  const months = { PageUp: -1, PageDown: 1 }[event.key]
  if (!days && !months) return
  event.preventDefault()
  const { year, month } = dateParts(date)
  selected.value = days ? addDays(date, days) : withMonth(date, year, month + (months ?? 0))
  view.value = dateParts(selected.value)
  focusIn(`[data-date="${selected.value}"]`)
}

const monthRow = useTemplateRef('monthRow')

/** Scrolls the month on screen to the middle of its row, and nothing around the row. */
function centerMonth(behavior?: ScrollBehavior) {
  const row = monthRow.value
  const chip = row?.querySelector<HTMLElement>('[aria-checked="true"]')
  if (!row || !chip) return
  const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2
  row.scrollTo?.({ left, behavior })
}

// After the render, which is when the new month's chip is the checked one.
watch(
  () => view.value.month,
  () => centerMonth(),
  { flush: 'post' },
)

onMounted(() => {
  root.value?.scrollIntoView?.({ block: 'nearest' })
  centerMonth('instant')
})
</script>

<!-- The docked date picker. It reports a date only on "Confirm". -->
<template>
  <div
    ref="root"
    role="group"
    :aria-labelledby="titleId"
    class="flex flex-col gap-3.5 rounded-corner-xl bg-surface-container-lowest px-4 pt-5 pb-4 inset-ring inset-ring-outline-variant"
  >
    <div class="flex items-center gap-2 px-1">
      <h3 :id="titleId" class="min-w-0 flex-1 text-title-large font-medium">Select date</h3>
      <div ref="yearField" class="relative" @focusout="onYearsFocusout">
        <AppButton
          variant="tonal"
          class="gap-1! bg-surface-container-high! pr-2.5! pl-3.5! text-on-surface!"
          aria-haspopup="listbox"
          :aria-expanded="yearsOpen"
          :aria-label="`Year, ${view.year}`"
          @click="toggleYears"
        >
          {{ view.year }}
          <IconChevronDown :class="yearsOpen && 'rotate-180'" />
        </AppButton>
        <div
          v-if="yearsOpen"
          role="listbox"
          aria-label="Year"
          class="absolute top-11.5 right-0 z-5 flex w-30 flex-col gap-0.5 rounded-corner-lg-inc bg-surface-container-high p-1.5 shadow-elevation-2"
          @keydown="onYearsKeydown"
        >
          <button
            v-for="year in years"
            :key="year"
            type="button"
            role="option"
            :aria-selected="year === view.year"
            class="state-layer focus-ring h-10 flex-none cursor-pointer rounded-field text-label-large font-semibold"
            :class="
              year === view.year
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface'
            "
            @click="pickYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <AppIconButton label="Previous month" @click="show(view.year, view.month - 1)">
        <IconChevronLeft class="size-5.5!" />
      </AppIconButton>
      <!-- Scrolls sideways and fades at both ends. The vertical padding leaves room for focus. -->
      <div
        ref="monthRow"
        role="radiogroup"
        aria-label="Month"
        class="relative -my-1 flex min-w-0 flex-1 snap-x snap-proximity scroll-smooth gap-1.5 overflow-x-auto [mask-image:linear-gradient(90deg,transparent,black_16px,black_calc(100%-16px),transparent)] px-4 py-1.5 [scrollbar-width:none] motion-reduce:scroll-auto"
        @keydown="onRadioKeydown"
      >
        <button
          v-for="(name, month) in MONTH_NAMES"
          :key="name"
          type="button"
          role="radio"
          :aria-checked="month === view.month"
          :tabindex="radioTabindex([...MONTH_NAMES.keys()], view.month, month)"
          class="state-layer focus-ring transition-morph h-10 min-w-14 flex-none cursor-pointer snap-center border px-3.5 text-label-large font-semibold active:rounded-corner-sm"
          :class="
            month === view.month
              ? 'rounded-corner-md border-primary bg-primary text-on-primary'
              : 'rounded-[20px] border-outline-variant text-primary'
          "
          @click="show(view.year, month)"
        >
          {{ name }}
        </button>
      </div>
      <AppIconButton label="Next month" @click="show(view.year, view.month + 1)">
        <IconChevronRight class="size-5.5!" />
      </AppIconButton>
    </div>

    <div role="grid" :aria-label="gridLabel" class="flex flex-col gap-0.5">
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
      <div v-for="week in weeks" :key="week[0]?.date" role="row" class="grid grid-cols-7">
        <template v-for="cell in week" :key="cell.date">
          <button
            v-if="cell.inMonth"
            type="button"
            role="gridcell"
            :data-date="cell.date"
            :aria-selected="cell.date === selected"
            :aria-current="cell.date === today ? 'date' : undefined"
            :aria-label="dayLabel(cell.date, cell.activity)"
            :tabindex="cell.date === tabDate ? 0 : -1"
            class="group focus-ring flex h-14.5 cursor-pointer flex-col items-center gap-0.75 rounded-corner-md pt-1"
            @click="selected = cell.date"
            @keydown="onDayKeydown($event, cell.date)"
          >
            <span
              class="transition-morph flex size-9.5 items-center justify-center text-body-medium font-medium tabular-nums"
              :class="[
                cell.date === selected
                  ? 'rounded-field bg-primary text-on-primary'
                  : 'rounded-[19px] text-on-surface group-hover:bg-surface-container-high',
                cell.date === today &&
                  cell.date !== selected &&
                  'inset-ring-[1.5px] inset-ring-primary',
              ]"
            >
              {{ cell.day }}
            </span>
            <span aria-hidden="true" class="flex h-1.5 gap-0.75">
              <span v-if="cell.activity.income" class="size-1.5 rounded-full bg-success"></span>
              <span v-if="cell.activity.expense" class="size-1.5 rounded-full bg-error"></span>
            </span>
          </button>
          <span
            v-else
            role="gridcell"
            aria-disabled="true"
            class="flex h-14.5 flex-col items-center pt-1"
          >
            <span
              class="flex size-9.5 items-center justify-center text-body-medium font-medium text-outline-variant tabular-nums"
            >
              {{ cell.day }}
            </span>
          </span>
        </template>
      </div>
    </div>

    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-corner-lg bg-surface-container px-3.5 py-2.5"
    >
      <span class="text-body-medium font-medium" aria-live="polite">{{ summary }}</span>
      <span class="inline-flex items-center gap-3 text-label-medium text-on-surface-variant">
        <span class="inline-flex items-center gap-1.5">
          <span class="size-2 rounded-full bg-success"></span>Income
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="size-2 rounded-full bg-error"></span>Expense
        </span>
      </span>
    </div>

    <div class="flex gap-2.5">
      <AppButton variant="outlined" class="flex-1! border-primary!" @click="emit('cancel')">
        Cancel
      </AppButton>
      <AppButton class="flex-1!" @click="emit('confirm', selected)">Confirm</AppButton>
    </div>
  </div>
</template>
