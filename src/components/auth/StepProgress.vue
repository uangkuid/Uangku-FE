<script setup lang="ts">
import { computed } from 'vue'
import AppLinearProgress from '@/components/ui/AppLinearProgress.vue'

const props = defineProps<{
  current: number
  total: number
}>()

const text = computed(() => `Step ${props.current} of ${props.total}`)
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-label-large text-on-surface-variant">{{ text }}</span>
    <AppLinearProgress :value="current" :min="1" :max="total" :label="text" />
  </div>
</template>
