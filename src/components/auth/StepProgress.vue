<script setup lang="ts">
import { computed } from 'vue'
import OraLinearProgress from '@/components/ui/linear-progress/OraLinearProgress.vue'

const props = defineProps<{
  current: number
  total: number
}>()

const text = computed(() => `Step ${props.current} of ${props.total}`)
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-label-large text-on-surface-variant">{{ text }}</span>
    <OraLinearProgress :value="current" :min="1" :max="total" :label="text" />
  </div>
</template>
