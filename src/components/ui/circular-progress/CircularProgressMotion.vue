<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAnimationClock } from '../shared/useAnimationClock'
import { polyline, samples, type Point } from '../shared/wave'

const props = defineProps<{
  /** 0 to 1. Without it the indicator is indeterminate. */
  fraction?: number
  wavy: boolean
  size: number
  thickness: number
  gap: number
  indicatorClass: string
  trackClass: string
}>()

const AMPLITUDE = 1.6
const WAVELENGTH = 15
const TURN = 2 * Math.PI

// A still frame with a visible arc, for reduced motion.
const { elapsed, running } = useAnimationClock(1000)

const eased = ref(props.fraction ?? 0)
watch(elapsed, (now, before) => {
  if (props.fraction === undefined) return
  const share = Math.min((now - before) / 120, 1)
  eased.value += (props.fraction - eased.value) * share
})

const paths = computed(() => {
  const center = props.size / 2
  const amplitude = props.wavy ? AMPLITUDE : 0
  const radius = (props.size - props.thickness) / 2 - amplitude
  const waves = Math.max(Math.round((TURN * radius) / WAVELENGTH), 1)
  const phase = (elapsed.value / 1000) * TURN

  const determinate = props.fraction !== undefined
  const fraction = running.value ? eased.value : (props.fraction ?? 0)
  // Indeterminate: the arc grows and shrinks between 10% and 75% while the whole ring turns.
  const sweep = determinate
    ? fraction
    : 0.1 + 0.65 * (0.5 - 0.5 * Math.cos((elapsed.value / 1800) * TURN))
  const start = -TURN / 4 + (determinate ? 0 : (elapsed.value / 1400) * TURN)
  const end = start + sweep * TURN

  const flat = determinate && (fraction <= 0.1 || fraction >= 0.95) ? 0 : 1

  function arc(from: number, to: number, height: number) {
    const point = (angle: number): Point => {
      const r = radius + height * Math.sin(waves * angle - phase)
      return [center + r * Math.cos(angle), center + r * Math.sin(angle)]
    }
    return polyline(samples(from, to, point, 1.5 / radius))
  }

  if (determinate && fraction >= 0.999) return { active: arc(start, start + TURN, 0) }
  if (determinate && fraction <= 0.001) return { track: arc(start, start + TURN, 0) }

  // Room between the two arcs: the visible gap, plus the round caps.
  const space = (props.gap + props.thickness) / radius
  const trackFrom = end + space
  const trackTo = start + TURN - space
  return {
    active: arc(start, end, flat * amplitude),
    track: trackTo > trackFrom ? arc(trackFrom, trackTo, 0) : undefined,
  }
})
</script>

<!-- The circular indicator when it moves by itself: wavy, indeterminate or both. -->
<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    fill="none"
    :stroke-width="thickness"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-if="paths.track" data-part="track" :class="trackClass" :d="paths.track" />
    <path v-if="paths.active" data-part="active" :class="indicatorClass" :d="paths.active" />
  </svg>
</template>
