<script setup lang="ts">
import { computed } from 'vue'
import LinearProgressMotion from './LinearProgressMotion.vue'

const props = withDefaults(
  defineProps<{
    /** Leave it out for an indeterminate indicator, when the length of the work is unknown. */
    value?: number
    /** Accessible name. */
    label: string
    min?: number
    max?: number
    /** Height in px. M3 defaults to 4 and allows thicker tracks. */
    thickness?: number
    /** The M3 Expressive wave: the active indicator travels in a sine 6px taller than the track. */
    wavy?: boolean
    /** Background utility of the active indicator and the stop indicator. */
    indicatorClass?: string
    /** Background utility of the remaining track. */
    trackClass?: string
  }>(),
  {
    value: undefined,
    min: 0,
    max: 100,
    thickness: 4,
    indicatorClass: 'bg-primary',
    trackClass: 'bg-secondary-container',
  },
)

const percent = computed(() => Math.min(Math.max(((props.value ?? 0) / props.max) * 100, 0), 100))
/** Keeps the 4px stop indicator centered in the end of the track. */
const stopInset = computed(() => `${(props.thickness - 4) / 2}px`)
</script>

<!--
  M3 linear progress: active indicator, 4px gap, track and, when determinate, a stop indicator. Flat
  or wavy, determinate or indeterminate.
-->
<template>
  <div
    role="progressbar"
    class="flex items-center gap-1"
    :style="wavy ? undefined : { height: `${thickness}px` }"
    :aria-label="label"
    :aria-valuemin="value === undefined ? undefined : min"
    :aria-valuemax="value === undefined ? undefined : max"
    :aria-valuenow="value"
  >
    <LinearProgressMotion
      v-if="wavy || value === undefined"
      :fraction="value === undefined ? undefined : percent / 100"
      :wavy="wavy"
      :thickness="thickness"
      :indicator-class="indicatorClass"
      :track-class="trackClass"
    />
    <template v-else>
      <span
        class="h-full flex-none rounded-full [transition:width_var(--motion-default-spatial)]"
        :class="indicatorClass"
        :style="{ width: `${percent}%`, minWidth: `${thickness}px` }"
      ></span>
      <span v-if="percent < 100" class="relative h-full flex-1 rounded-full" :class="trackClass">
        <span
          class="absolute top-1/2 size-1 -translate-y-1/2 rounded-full"
          :class="indicatorClass"
          :style="{ right: stopInset }"
        ></span>
      </span>
    </template>
  </div>
</template>
