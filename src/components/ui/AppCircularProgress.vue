<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Percentage, 0 to 100. */
    value: number
    /** Accessible name. */
    label: string
    /** Diameter in px. */
    size?: number
    thickness?: number
    /** Visible space between the active indicator and the track, in px. */
    gap?: number
    indicatorClass?: string
    trackClass?: string
  }>(),
  {
    size: 40,
    thickness: 4,
    gap: 4,
    indicatorClass: 'stroke-primary',
    trackClass: 'stroke-secondary-container',
  },
)

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.thickness) / 2)

/** Two arcs from 12 o'clock with a gap at both ends: the value, then what is left. */
const arcs = computed(() => {
  const circumference = 2 * Math.PI * radius.value
  const percent = Math.min(Math.max(props.value, 0), 100)
  const active = (circumference * percent) / 100

  /** Dash pattern of the arc visible between two points of the circle. */
  function arc(from: number, to: number) {
    // A round cap adds half the stroke width at each end, and the gap is split between arcs.
    const inset = (props.gap + props.thickness) / 2
    const dash = to - from - props.gap - props.thickness
    if (dash < -props.thickness) return undefined
    const length = Math.max(dash, 0.1)
    return { dasharray: `${length} ${circumference - length}`, dashoffset: -(from + inset) }
  }

  if (percent === 0 || percent === 100) {
    const full = { dasharray: undefined, dashoffset: undefined }
    return percent === 0 ? { active: undefined, track: full } : { active: full, track: undefined }
  }
  return { active: arc(0, active), track: arc(active, circumference) }
})
</script>

<!-- M3 determinate circular progress. The default slot is centered inside the ring. -->
<template>
  <div
    role="progressbar"
    class="relative flex-none"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-label="label"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="value"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      fill="none"
      :stroke-width="thickness"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle
        v-if="arcs.track"
        :class="trackClass"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-dasharray="arcs.track.dasharray"
        :stroke-dashoffset="arcs.track.dashoffset"
        :transform="`rotate(-90 ${center} ${center})`"
      />
      <circle
        v-if="arcs.active"
        :class="indicatorClass"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-dasharray="arcs.active.dasharray"
        :stroke-dashoffset="arcs.active.dashoffset"
        :transform="`rotate(-90 ${center} ${center})`"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
      <slot />
    </div>
  </div>
</template>
