<script setup lang="ts">
import IconPlus from '@/components/icons/IconPlus.vue'

defineProps<{ label: string }>()
</script>

<!-- The dashed tile at the end of a wallet grid. -->
<template>
  <button
    type="button"
    aria-haspopup="dialog"
    class="state-layer focus-ring transition-morph flex min-h-45 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-corner-xl border-2 border-dashed border-outline-variant p-5 text-primary active:rounded-corner-lg"
  >
    <span
      class="flex size-13 items-center justify-center rounded-corner-lg bg-primary-container text-on-primary-container"
    >
      <IconPlus class="size-6" />
    </span>
    <span class="text-[15px] font-semibold">{{ label }}</span>
  </button>
</template>
