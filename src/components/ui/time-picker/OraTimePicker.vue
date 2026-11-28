<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'

type Unit = 'hour' | 'minute'

const { hour12 = false, mode = 'dial' } = defineProps<{
  /** A 12-hour clock with AM and PM instead of the 24-hour one. */
  hour12?: boolean
  /** `dial` picks on a clock face; `input` types the numbers. */
  mode?: 'dial' | 'input'
}>()

/** 24-hour `HH:MM`, whichever clock is shown. */
const model = defineModel<string>({ required: true })

const unit = ref<Unit>('hour')
const dial = useTemplateRef('dial')
let dragging = false

const hour = computed(() => Number(model.value.split(':')[0]) || 0)
const minute = computed(() => Number(model.value.split(':')[1]) || 0)
const pm = computed(() => hour.value >= 12)
const shownHour = computed(() => (hour12 ? hour.value % 12 || 12 : hour.value))
const pad = (value: number) => String(value).padStart(2, '0')

function set(nextHour: number, nextMinute: number) {
  model.value = `${pad((nextHour + 24) % 24)}:${pad((nextMinute + 60) % 60)}`
}

/** An hour as the 12-hour clock shows it, kept in the current half of the day. */
const fromClock = (value: number) => (value % 12) + (pm.value ? 12 : 0)

function setPeriod(toPm: boolean) {
  set((hour.value % 12) + (toPm ? 12 : 0), minute.value)
}

/* Dial geometry in px: a 256px face, an outer ring and, for the 24-hour clock, an inner one. */
const CENTER = 128
const OUTER = 104
const INNER = 68

function position(index: number, radius: number) {
  const angle = (index / 12) * 2 * Math.PI - Math.PI / 2
  return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) }
}

const numbers = computed(() => {
  if (unit.value === 'minute') {
    return Array.from({ length: 12 }, (_, index) => ({
      value: index * 5,
      text: pad(index * 5),
      inner: false,
      selected: minute.value === index * 5,
      ...position(index, OUTER),
    }))
  }
  const outer = Array.from({ length: 12 }, (_, index) => {
    const value = index || 12
    return {
      value,
      text: String(value),
      inner: false,
      selected: shownHour.value === value,
      ...position(index, OUTER),
    }
  })
  if (hour12) return outer
  const inner = Array.from({ length: 12 }, (_, index) => {
    const value = index ? index + 12 : 0
    return {
      value,
      text: index ? String(value) : '00',
      inner: true,
      selected: hour.value === value,
      ...position(index, INNER),
    }
  })
  return [...outer, ...inner]
})

const hand = computed(() => {
  if (unit.value === 'minute') return position(minute.value / 5, OUTER)
  const inner = !hour12 && (hour.value === 0 || hour.value > 12)
  return position(hour.value % 12, inner ? INNER : OUTER)
})

/** Whether the hand points between two numbers, which then shows a dot in its handle. */
const between = computed(() => unit.value === 'minute' && minute.value % 5 !== 0)

function pickAt(event: PointerEvent) {
  const box = dial.value!.getBoundingClientRect()
  const x = event.clientX - box.left - box.width / 2
  const y = event.clientY - box.top - box.height / 2
  // Clockwise from 12 o'clock, as a share of a turn.
  const turn = (Math.atan2(x, -y) / (2 * Math.PI) + 1) % 1
  if (unit.value === 'minute') return set(hour.value, Math.round(turn * 60) % 60)
  const step = Math.round(turn * 12) % 12
  if (hour12) return set(fromClock(step), minute.value)
  const inner = Math.hypot(x, y) < ((OUTER + INNER) / 2) * (box.width / (CENTER * 2) || 1)
  const value = inner ? (step ? step + 12 : 0) : step || 12
  set(value, minute.value)
}

function onPointerdown(event: PointerEvent) {
  if (event.button > 0) return
  dragging = true
  dial.value?.setPointerCapture?.(event.pointerId)
  pickAt(event)
}

function onPointermove(event: PointerEvent) {
  if (dragging) pickAt(event)
}

function onPointerup() {
  if (!dragging) return
  dragging = false
  unit.value = 'minute'
}

function onKeydown(event: KeyboardEvent) {
  const step = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  if (unit.value === 'hour') set(hour.value + step, minute.value)
  else set(hour.value, minute.value + step)
}

function onInput(which: Unit, event: Event) {
  const input = event.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').slice(-2)
  input.value = digits
  if (!digits) return
  const value = Number(digits)
  if (which === 'minute') {
    if (value <= 59) set(hour.value, value)
  } else if (hour12) {
    if (value >= 1 && value <= 12) set(fromClock(value), minute.value)
  } else if (value <= 23) {
    set(value, minute.value)
  }
}

/** A field left empty or out of range shows the value in use again. */
function onBlur(which: Unit, event: Event) {
  ;(event.target as HTMLInputElement).value = pad(which === 'hour' ? shownHour.value : minute.value)
}

const units = computed(() => [
  { key: 'hour' as const, label: 'Hour', value: shownHour.value },
  { key: 'minute' as const, label: 'Minute', value: minute.value },
])

const unitClasses = (key: Unit) =>
  unit.value === key
    ? 'bg-primary-container text-on-primary-container'
    : 'bg-surface-container-highest text-on-surface'
</script>

<!-- M3 time picker: the time at the top, then a clock dial, or two fields to type it. -->
<template>
  <div class="flex flex-col items-center gap-6 text-on-surface">
    <div class="flex items-start gap-3">
      <div class="flex items-start gap-1">
        <template v-for="(item, index) in units" :key="item.key">
          <span
            v-if="index"
            aria-hidden="true"
            class="flex h-20 w-5 items-center justify-center font-display text-display-large"
          >
            :
          </span>
          <button
            v-if="mode === 'dial'"
            type="button"
            :aria-label="`${item.label}, ${pad(item.value)}`"
            :aria-pressed="unit === item.key"
            class="state-layer focus-ring transition-morph h-20 w-24 cursor-pointer max-[23rem]:w-20 rounded-field font-display text-display-large tabular-nums"
            :class="unitClasses(item.key)"
            @click="unit = item.key"
          >
            {{ pad(item.value) }}
          </button>
          <label v-else class="flex w-24 flex-col gap-1 max-[23rem]:w-20">
            <input
              type="text"
              inputmode="numeric"
              :aria-label="item.label"
              :value="pad(item.value)"
              class="h-20 w-full rounded-field bg-surface-container-highest text-center font-display text-display-medium tabular-nums caret-primary outline-none focus:bg-primary-container focus:text-on-primary-container focus:inset-ring-2 focus:inset-ring-primary"
              @focus="($event.target as HTMLInputElement).select()"
              @input="onInput(item.key, $event)"
              @blur="onBlur(item.key, $event)"
            />
            <span aria-hidden="true" class="text-body-small text-on-surface-variant">
              {{ item.label }}
            </span>
          </label>
        </template>
      </div>
      <div
        v-if="hour12"
        role="group"
        aria-label="AM or PM"
        class="flex h-20 w-13 flex-col overflow-hidden rounded-corner-md border border-outline"
      >
        <button
          v-for="period in [false, true]"
          :key="String(period)"
          type="button"
          :aria-pressed="pm === period"
          class="state-layer focus-ring flex-1 cursor-pointer text-title-medium font-semibold last:border-t last:border-outline"
          :class="
            pm === period
              ? 'bg-tertiary-container text-on-tertiary-container'
              : 'text-on-surface-variant'
          "
          @click="setPeriod(period)"
        >
          {{ period ? 'PM' : 'AM' }}
        </button>
      </div>
    </div>

    <div
      v-if="mode === 'dial'"
      ref="dial"
      role="slider"
      tabindex="0"
      :aria-label="unit === 'hour' ? 'Hour dial' : 'Minute dial'"
      :aria-valuemin="unit === 'hour' && hour12 ? 1 : 0"
      :aria-valuemax="unit === 'minute' ? 59 : hour12 ? 12 : 23"
      :aria-valuenow="unit === 'hour' ? shownHour : minute"
      class="focus-ring relative size-64 flex-none cursor-pointer touch-none rounded-full bg-surface-container-highest select-none"
      @pointerdown="onPointerdown"
      @pointermove="onPointermove"
      @pointerup="onPointerup"
      @pointercancel="onPointerup"
      @keydown="onKeydown"
    >
      <svg viewBox="0 0 256 256" class="absolute inset-0 text-primary" aria-hidden="true">
        <circle :cx="CENTER" :cy="CENTER" r="4" fill="currentColor" />
        <line
          :x1="CENTER"
          :y1="CENTER"
          :x2="hand.x"
          :y2="hand.y"
          stroke="currentColor"
          stroke-width="2"
        />
        <circle :cx="hand.x" :cy="hand.y" r="20" fill="currentColor" />
        <circle v-if="between" :cx="hand.x" :cy="hand.y" r="3" class="fill-on-primary" />
      </svg>
      <span
        v-for="number in numbers"
        :key="`${unit}-${number.value}`"
        aria-hidden="true"
        class="pointer-events-none absolute flex size-10 -translate-1/2 items-center justify-center rounded-full tabular-nums"
        :class="[
          number.inner ? 'text-body-small' : 'text-body-large',
          number.selected
            ? 'text-on-primary'
            : number.inner
              ? 'text-on-surface-variant'
              : 'text-on-surface',
        ]"
        :style="{ left: `${number.x}px`, top: `${number.y}px` }"
      >
        {{ number.text }}
      </span>
    </div>
  </div>
</template>
