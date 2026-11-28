<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useAnimationClock } from '../shared/useAnimationClock'
import { samples, strokeOutline } from '../shared/wave'

const props = defineProps<{
  /** 0 to 1. Without it the indicator is indeterminate. */
  fraction?: number
  wavy: boolean
  thickness: number
  indicatorClass: string
  trackClass: string
}>()

const GAP = 4
const AMPLITUDE = 3
/** One turn of the indeterminate animation, in ms. */
const CYCLE = 1750

const root = useTemplateRef('root')
const width = ref(240)
let observer: ResizeObserver | undefined

onMounted(() => {
  const element = root.value
  if (!element || typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(() => (width.value = element.clientWidth || width.value))
  observer.observe(element)
})
onUnmounted(() => observer?.disconnect())

// A still frame in which both lines show, for reduced motion.
const { elapsed, running } = useAnimationClock(CYCLE * 0.5)

// The determinate indicator eases toward a new value instead of jumping.
const eased = ref(props.fraction ?? 0)
watch(elapsed, (now, before) => {
  if (props.fraction === undefined) return
  const share = Math.min((now - before) / 120, 1)
  eased.value += (props.fraction - eased.value) * share
})

const height = computed(() => props.thickness + (props.wavy ? AMPLITUDE * 2 : 0))
const determinate = computed(() => props.fraction !== undefined)

/** Where a line's end is, 0 to 1, when it sets off at `delay` and travels for `duration` ms. */
function travel(time: number, delay: number, duration: number) {
  const t = Math.min(Math.max((time - delay) / duration, 0), 1)
  return t * t * (3 - 2 * t)
}

/** The active stretches in px, from left to right. */
const active = computed(() => {
  const w = width.value
  if (props.fraction !== undefined) {
    const fraction = running.value ? eased.value : props.fraction
    return [{ from: 0, to: Math.max(fraction * w, props.thickness) }]
  }
  const time = elapsed.value % CYCLE
  return [
    { from: travel(time, 650 + 250, 850) * w, to: travel(time, 650, 850) * w },
    { from: travel(time, 250, 1000) * w, to: travel(time, 0, 1000) * w },
  ]
    .filter((line) => line.to - line.from > 0.5)
    .sort((a, b) => a.from - b.from)
})

/** What the active stretches leave of the track, with a gap beside each of them. */
const track = computed(() => {
  const rest: { from: number; to: number }[] = []
  let from = 0
  for (const line of active.value) {
    rest.push({ from, to: line.from - GAP })
    from = line.to + GAP
  }
  rest.push({ from, to: width.value })
  return rest.filter((part) => part.to - part.from > 0.5)
})

const wavePath = computed(() => {
  const wavelength = determinate.value ? 40 : 20
  const phase = elapsed.value / 1000
  // M3 flattens the wave of a determinate indicator that has barely begun or is nearly done.
  const flat =
    props.fraction !== undefined && (props.fraction <= 0.1 || props.fraction >= 0.95) ? 0 : 1
  const radius = props.thickness / 2
  return active.value
    .map((line) => {
      const start = line.from + radius
      const end = Math.max(line.to - radius, start + 0.1)
      const points = samples(start, end, (x) => [
        x,
        height.value / 2 + flat * AMPLITUDE * Math.sin(2 * Math.PI * (x / wavelength - phase)),
      ])
      return strokeOutline(points, props.thickness)
    })
    .join('')
})

const showStop = computed(
  () => determinate.value && track.value.some((part) => part.to === width.value),
)
</script>

<!-- The linear indicator when it moves by itself: wavy, indeterminate or both. -->
<template>
  <div ref="root" class="relative w-full overflow-hidden" :style="{ height: `${height}px` }">
    <span
      v-if="wavy"
      data-part="active"
      class="absolute inset-0"
      :class="indicatorClass"
      :style="{ clipPath: `path('${wavePath}')` }"
    ></span>
    <template v-else>
      <span
        v-for="(line, index) in active"
        :key="index"
        data-part="active"
        class="absolute top-0 h-full rounded-full"
        :class="indicatorClass"
        :style="{ left: `${line.from}px`, width: `${line.to - line.from}px` }"
      ></span>
    </template>
    <span
      v-for="(part, index) in track"
      :key="index"
      data-part="track"
      class="absolute top-1/2 -translate-y-1/2 rounded-full"
      :class="trackClass"
      :style="{
        left: `${part.from}px`,
        width: `${part.to - part.from}px`,
        height: `${thickness}px`,
      }"
    ></span>
    <span
      v-if="showStop"
      class="absolute top-1/2 size-1 -translate-y-1/2 rounded-full"
      :class="indicatorClass"
      :style="{ right: `${(thickness - 4) / 2}px` }"
    ></span>
  </div>
</template>
