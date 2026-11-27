<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    /** Accessible name. */
    label: string
    min?: number
    max?: number
    /** Height in px. M3 defaults to 4 and allows thicker tracks. */
    thickness?: number
    /** Background utility of the active indicator and the stop indicator. */
    indicatorClass?: string
    /** Background utility of the remaining track. */
    trackClass?: string
  }>(),
  {
    min: 0,
    max: 100,
    thickness: 4,
    indicatorClass: 'bg-primary',
    trackClass: 'bg-secondary-container',
  },
)

const percent = computed(() => Math.min(Math.max((props.value / props.max) * 100, 0), 100))
/** Keeps the 4px stop indicator centered in the end of the track. */
const stopInset = computed(() => `${(props.thickness - 4) / 2}px`)
</script>

<!-- M3 determinate linear progress: active indicator, 4px gap, track and stop indicator. -->
<template>
  <div
    role="progressbar"
    class="flex items-center gap-1"
    :style="{ height: `${thickness}px` }"
    :aria-label="label"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
  >
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
  </div>
</template>
