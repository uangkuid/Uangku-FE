<script setup lang="ts">
import { computed } from 'vue'
import { formatRupiah } from '@/utils/rupiah'

const props = defineProps<{ entries: { amount: number }[] }>()

const income = computed(() =>
  props.entries.reduce((sum, entry) => sum + Math.max(entry.amount, 0), 0),
)
const spending = computed(() =>
  props.entries.reduce((sum, entry) => sum - Math.min(entry.amount, 0), 0),
)
</script>

<!-- What came in and went out over the listed transactions. -->
<template>
  <div class="flex flex-wrap gap-2 text-label-large tabular-nums">
    <span
      class="inline-flex h-10 items-center gap-2 rounded-full bg-success-container px-4 text-on-success-container"
    >
      In <b>{{ formatRupiah(income) }}</b>
    </span>
    <span
      class="inline-flex h-10 items-center gap-2 rounded-corner-md bg-error-container px-4 text-on-error-container"
    >
      Out <b>{{ formatRupiah(spending) }}</b>
    </span>
  </div>
</template>
