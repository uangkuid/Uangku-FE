<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import {
  addDays,
  dateParts,
  FULL_MONTH_NAMES,
  monthWeeks,
  toIso,
  WEEKDAY_NAMES,
  withMonth,
  type IsoDate,
} from '@/utils/date'
import OraButton from '../button/OraButton.vue'
import OraIconButton from '../icon-button/OraIconButton.vue'

const props = defineProps<{
  /** First and last day that can be picked. */
  min?: IsoDate
  max?: IsoDate
  /** The outlined day. Defaults to the device's date. */
  today?: IsoDate
}>()

const model = defineModel<IsoDate | undefined>({ required: true })

const root = useTemplateRef('root')
const todayDate = computed(() => props.today ?? toIso(new Date()))

function clamp(date: IsoDate) {
  if (props.min && date < props.min) return props.min
  if (props.max && date > props.max) return props.max
  return date
}

/** The day that arrow keys move from; its month is the one shown. */
const cursor = ref(clamp(model.value ?? todayDate.value))
watch(model, (date) => {
  if (date) cursor.value = date
})

const pickingYear = ref(false)

const view = computed(() => dateParts(cursor.value))
const title = computed(() => `${FULL_MONTH_NAMES[view.value.month]} ${view.value.year}`)
const weeks = computed(() => monthWeeks(view.value.year, view.value.month))

const years = computed(() => {
  const first = props.min ? dateParts(props.min).year : view.value.year - 50
  const last = props.max ? dateParts(props.max).year : view.value.year + 50
  return Array.from({ length: last - first + 1 }, (_, index) => first + index)
})

const monthStart = (offset: number) =>
  toIso(new Date(view.value.year, view.value.month + offset, 1))
const canGoBack = computed(() => !props.min || addDays(monthStart(0), -1) >= props.min)
const canGoForward = computed(() => !props.max || monthStart(1) <= props.max)

function showMonth(year: number, month: number) {
  const date = new Date(year, month, 1)
  cursor.value = clamp(withMonth(cursor.value, date.getFullYear(), date.getMonth()))
}

const isDisabled = (date: IsoDate) => clamp(date) !== date

async function toggleYears() {
  pickingYear.value = !pickingYear.value
  if (!pickingYear.value) return
  await nextTick()
  const current = root.value?.querySelector<HTMLElement>('[data-year][aria-pressed="true"]')
  current?.scrollIntoView?.({ block: 'center' })
  current?.focus({ preventScroll: true })
}

function pickYear(year: number) {
  showMonth(year, view.value.month)
  pickingYear.value = false
}

async function onKeydown(event: KeyboardEvent) {
  const { year, month } = view.value
  const column = weeks.value.flat().findIndex((cell) => cell.date === cursor.value) % 7
  const yearStep = event.shiftKey ? 12 : 1
  const targets: Record<string, () => IsoDate> = {
    ArrowLeft: () => addDays(cursor.value, -1),
    ArrowRight: () => addDays(cursor.value, 1),
    ArrowUp: () => addDays(cursor.value, -7),
    ArrowDown: () => addDays(cursor.value, 7),
    Home: () => addDays(cursor.value, -column),
    End: () => addDays(cursor.value, 6 - column),
    PageUp: () => withMonth(cursor.value, ...yearMonth(year, month - yearStep)),
    PageDown: () => withMonth(cursor.value, ...yearMonth(year, month + yearStep)),
  }
  const target = targets[event.key]
  if (!target) return
  event.preventDefault()
  cursor.value = clamp(target())
  await nextTick()
  root.value?.querySelector<HTMLElement>(`[data-date="${cursor.value}"]`)?.focus()
}

/** A month number that may run past either end of the year, brought back into range. */
function yearMonth(year: number, month: number): [number, number] {
  const date = new Date(year, month, 1)
  return [date.getFullYear(), date.getMonth()]
}
</script>

<!--
  M3 date picker calendar for a single date: a month grid, month arrows and a list of years. Put it
  in a card or a popup for the docked picker; `OraDatePickerDialog` is the modal one.
-->
<template>
  <div ref="root" class="flex w-full max-w-82 flex-col gap-2 text-on-surface">
    <div class="flex items-center gap-1">
      <OraButton
        variant="text"
        class="text-on-surface-variant!"
        :aria-expanded="pickingYear"
        :aria-label="`${title}, choose year`"
        @click="toggleYears"
      >
        {{ title }}
        <IconChevronDown :class="pickingYear && 'rotate-180'" />
      </OraButton>
      <span class="flex-1"></span>
      <template v-if="!pickingYear">
        <OraIconButton
          label="Previous month"
          :disabled="!canGoBack"
          @click="showMonth(view.year, view.month - 1)"
        >
          <IconChevronLeft class="size-5!" />
        </OraIconButton>
        <OraIconButton
          label="Next month"
          :disabled="!canGoForward"
          @click="showMonth(view.year, view.month + 1)"
        >
          <IconChevronRight class="size-5!" />
        </OraIconButton>
      </template>
    </div>

    <div
      v-if="pickingYear"
      role="group"
      aria-label="Year"
      class="grid h-70 grid-cols-3 content-start gap-2 overflow-y-auto p-1"
      @keydown.esc.stop="pickingYear = false"
    >
      <button
        v-for="year in years"
        :key="year"
        type="button"
        data-year
        :aria-pressed="year === view.year"
        class="state-layer focus-ring transition-morph h-10 cursor-pointer text-body-large tabular-nums"
        :class="
          year === view.year
            ? 'rounded-field bg-primary font-semibold text-on-primary'
            : 'rounded-[20px] text-on-surface-variant'
        "
        @click="pickYear(year)"
      >
        {{ year }}
      </button>
    </div>

    <div v-else role="grid" :aria-label="title" class="flex flex-col">
      <div role="row" class="grid grid-cols-7">
        <span
          v-for="weekday in WEEKDAY_NAMES"
          :key="weekday"
          role="columnheader"
          :aria-label="weekday"
          class="flex h-10 items-center justify-center text-body-medium font-semibold text-on-surface-variant"
        >
          {{ weekday.slice(0, 2) }}
        </span>
      </div>
      <div v-for="week in weeks" :key="week[0]?.date" role="row" class="grid grid-cols-7">
        <template v-for="cell in week" :key="cell.date">
          <button
            v-if="cell.inMonth"
            type="button"
            role="gridcell"
            :data-date="cell.date"
            :disabled="isDisabled(cell.date)"
            :aria-selected="cell.date === model"
            :aria-current="cell.date === todayDate ? 'date' : undefined"
            :aria-label="`${cell.day} ${title}`"
            :tabindex="cell.date === cursor ? 0 : -1"
            class="group focus-ring flex h-11 cursor-pointer items-center justify-center rounded-full disabled:cursor-default"
            @click="model = cell.date"
            @keydown="onKeydown"
          >
            <span
              class="transition-morph flex size-10 items-center justify-center text-body-medium font-medium tabular-nums"
              :class="[
                cell.date === model
                  ? 'rounded-field bg-primary text-on-primary'
                  : 'rounded-[20px] group-enabled:group-hover:bg-on-surface/8 group-disabled:text-on-surface/38',
                cell.date === todayDate &&
                  cell.date !== model &&
                  'inset-ring-[1.5px] inset-ring-primary',
              ]"
            >
              {{ cell.day }}
            </span>
          </button>
          <span v-else role="gridcell" aria-disabled="true" class="h-11"></span>
        </template>
      </div>
    </div>
  </div>
</template>
