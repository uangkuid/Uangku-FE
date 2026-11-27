<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
}>()

const text = computed(() => `Step ${props.current} of ${props.total}`)
const filled = computed(() => `${(props.current / props.total) * 100}%`)
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-label-large text-on-surface-variant">{{ text }}</span>
    <div
      class="flex h-1 items-center gap-1"
      role="progressbar"
      aria-valuemin="1"
      :aria-valuemax="total"
      :aria-valuenow="current"
      :aria-label="text"
    >
      <span class="h-1 rounded-xs bg-primary" :style="{ width: filled }"></span>
      <span class="h-1 flex-1 rounded-xs bg-secondary-container"></span>
      <span class="h-1 w-1 rounded-xs bg-primary"></span>
    </div>
  </div>
</template>
