<script setup lang="ts" generic="Value extends number | [number, number]">
import { computed, ref, useTemplateRef } from 'vue'

type Size = 'xs' | 's' | 'm' | 'l' | 'xl'

const props = withDefaults(
  defineProps<{
    /** Accessible name. A range names its handles after it, with "start" and "end". */
    label: string
    min?: number
    max?: number
    step?: number
    size?: Size
    /** The active track grows from the middle of the range instead of from its start. */
    centered?: boolean
    /** Marks every step on the track. */
    stops?: boolean
    disabled?: boolean
    /** Text of a value, for the bubble over a handle and for screen readers. */
    format?: (value: number) => string
  }>(),
  { min: 0, max: 100, step: 1, size: 'xs', format: (value: number) => String(value) },
)

/** A pair of numbers makes a range slider. */
const model = defineModel<Value>({ required: true })

/* Track height, handle height and outer corner of each M3 Expressive size, in px. */
const sizes: Record<Size, { track: number; handle: number; corner: number }> = {
  xs: { track: 16, handle: 44, corner: 8 },
  s: { track: 24, handle: 44, corner: 8 },
  m: { track: 40, handle: 52, corner: 12 },
  l: { track: 56, handle: 68, corner: 16 },
  xl: { track: 96, handle: 108, corner: 28 },
}

/** Half the 4px handle plus the 6px gap beside it. */
const HANDLE_SPACE = 8

const root = useTemplateRef('root')
/** Index of the handle being dragged. */
const dragging = ref<number>()

const values = computed<number[]>(() =>
  Array.isArray(model.value) ? model.value : [model.value as number],
)
const range = computed(() => values.value.length === 2)
const percent = (value: number) =>
  Math.min(Math.max(((value - props.min) / (props.max - props.min)) * 100, 0), 100)

/** The stretches of the track between its ends and the handles. */
const segments = computed(() => {
  const handles = values.value.map(percent)
  const [first = 0, second = 0] = handles
  let active: [number, number] = [0, first]
  if (range.value) active = [first, second]
  else if (props.centered) active = [Math.min(first, 50), Math.max(first, 50)]

  const cuts = [...new Set([0, 100, ...active, ...handles])].sort((a, b) => a - b)
  const { corner } = sizes[props.size]
  return cuts.slice(1).map((to, index) => {
    const from = cuts[index] ?? 0
    const left = handles.includes(from) ? HANDLE_SPACE : 0
    const right = handles.includes(to) ? HANDLE_SPACE : 0
    const start = from === 0 && !left ? corner : 2
    const end = to === 100 && !right ? corner : 2
    return {
      active: from >= active[0] && to <= active[1],
      style: {
        left: `calc(${from}% + ${left}px)`,
        right: `calc(${100 - to}% + ${right}px)`,
        height: `${sizes[props.size].track}px`,
        borderRadius: `${start}px ${end}px ${end}px ${start}px`,
      },
    }
  })
})

/** Dots on the track: every step when asked, otherwise the end of each inactive stretch. */
const dots = computed(() => {
  const count = (props.max - props.min) / props.step
  let at: number[] = []
  if (props.stops && count <= 100) {
    at = Array.from({ length: Math.floor(count) + 1 }, (_, index) => (index / count) * 100)
  } else {
    if (range.value || props.centered) at.push(0)
    at.push(100)
  }
  const handles = values.value.map(percent)
  return at
    .filter((dot) => handles.every((handle) => Math.abs(handle - dot) > 1))
    .map((dot) => ({
      // 6px in from the ends of the track.
      left: `calc(${dot}% + ${6 - (dot / 100) * 12}px)`,
      active: segments.value.some((segment) => segment.active) && isActive(dot),
    }))
})

function isActive(at: number) {
  const [first = 0, second = 0] = values.value.map(percent)
  if (range.value) return at >= first && at <= second
  if (props.centered) return at >= Math.min(first, 50) && at <= Math.max(first, 50)
  return at <= first
}

/** The nearest step within the range, and between the other handle and the end for a range. */
function set(index: number, raw: number) {
  const steps = Math.round((raw - props.min) / props.step)
  const decimals = String(props.step).split('.')[1]?.length ?? 0
  let value = Number((props.min + steps * props.step).toFixed(decimals))
  const [first = props.min, second = props.max] = values.value
  const low = range.value && index === 1 ? first : props.min
  const high = range.value && index === 0 ? second : props.max
  value = Math.min(Math.max(value, low), high)
  if (value === values.value[index]) return
  const next = range.value ? values.value.map((old, i) => (i === index ? value : old)) : value
  model.value = next as Value
}

function valueAt(event: PointerEvent) {
  const box = root.value!.getBoundingClientRect()
  const share = box.width ? (event.clientX - box.left) / box.width : 0
  return props.min + share * (props.max - props.min)
}

function onPointerdown(event: PointerEvent) {
  if (props.disabled || event.button > 0) return
  event.preventDefault()
  const value = valueAt(event)
  const [first = 0, second = 0] = values.value
  // The nearer handle moves; when both sit together, the side of the press decides.
  let index = 0
  if (range.value) {
    const toFirst = Math.abs(value - first)
    const toSecond = Math.abs(value - second)
    if (toSecond < toFirst || (toSecond === toFirst && value > second)) index = 1
  }
  dragging.value = index
  root.value?.setPointerCapture?.(event.pointerId)
  root.value?.querySelectorAll<HTMLElement>('[role="slider"]')[index]?.focus()
  set(index, value)
}

function onPointermove(event: PointerEvent) {
  if (dragging.value !== undefined) set(dragging.value, valueAt(event))
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (props.disabled) return
  const value = values.value[index] ?? props.min
  const page = Math.max(props.step, (props.max - props.min) / 10)
  const targets: Record<string, number> = {
    ArrowRight: value + props.step,
    ArrowUp: value + props.step,
    ArrowLeft: value - props.step,
    ArrowDown: value - props.step,
    PageUp: value + page,
    PageDown: value - page,
    Home: props.min,
    End: props.max,
  }
  const target = targets[event.key]
  if (target === undefined) return
  event.preventDefault()
  set(index, target)
}

function handleName(index: number) {
  return range.value ? `${props.label}, ${index ? 'end' : 'start'}` : props.label
}
</script>

<!-- M3 Expressive slider: standard, centered or, with a pair of numbers, a range. -->
<template>
  <div
    ref="root"
    class="relative w-full touch-none select-none"
    :class="disabled ? 'cursor-default' : 'cursor-pointer'"
    :style="{ height: `${Math.max(sizes[size].handle, 48)}px` }"
    @pointerdown="onPointerdown"
    @pointermove="onPointermove"
    @pointerup="dragging = undefined"
    @pointercancel="dragging = undefined"
  >
    <span
      v-for="(segment, index) in segments"
      :key="index"
      data-part="segment"
      class="absolute top-1/2 -translate-y-1/2"
      :class="
        segment.active
          ? disabled
            ? 'bg-on-surface/38'
            : 'bg-primary'
          : disabled
            ? 'bg-on-surface/12'
            : 'bg-secondary-container'
      "
      :style="segment.style"
    ></span>
    <span
      v-for="dot in dots"
      :key="dot.left"
      class="absolute top-1/2 size-1 -translate-1/2 rounded-full"
      :class="dot.active ? 'bg-on-primary' : disabled ? 'bg-on-surface/38' : 'bg-primary'"
      :style="{ left: dot.left }"
    ></span>
    <span
      v-for="(value, index) in values"
      :key="index"
      role="slider"
      :tabindex="disabled ? -1 : 0"
      :aria-label="handleName(index)"
      :aria-valuemin="range && index === 1 ? values[0] : min"
      :aria-valuemax="range && index === 0 ? values[1] : max"
      :aria-valuenow="value"
      :aria-valuetext="format(value)"
      :aria-disabled="disabled || undefined"
      class="group absolute top-1/2 flex w-5 -translate-1/2 justify-center outline-none"
      :style="{ left: `${percent(value)}%`, height: `${sizes[size].handle}px` }"
      @keydown="onKeydown($event, index)"
    >
      <span
        class="h-full rounded-full outline-offset-2 outline-primary [transition:width_var(--motion-fast-spatial)] group-focus-visible:outline-3"
        :class="[
          disabled ? 'bg-on-surface/38' : 'bg-primary',
          dragging === index ? 'w-0.5' : 'w-1',
        ]"
      ></span>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute bottom-full mb-1 min-w-12 rounded-full bg-inverse-surface px-4 py-3 text-center text-label-large whitespace-nowrap text-inverse-on-surface [transition:scale_var(--motion-fast-spatial),opacity_var(--motion-fast-effects)] group-focus-visible:scale-100 group-focus-visible:opacity-100"
        :class="dragging === index ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
      >
        {{ format(value) }}
      </span>
    </span>
  </div>
</template>
