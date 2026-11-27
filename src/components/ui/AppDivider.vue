<script setup lang="ts">
defineProps<{ vertical?: boolean }>()
</script>

<!-- M3 divider. Text in the default slot sits in the middle of a horizontal divider. -->
<template>
  <div
    v-if="$slots.default"
    role="separator"
    class="flex items-center gap-3.5 text-on-surface-variant before:h-px before:flex-1 before:bg-outline-variant after:h-px after:flex-1 after:bg-outline-variant"
  >
    <span class="text-label-medium"><slot /></span>
  </div>
  <span
    v-else
    class="flex-none bg-outline-variant"
    :class="vertical ? 'h-8 w-px' : 'h-px self-stretch'"
    aria-hidden="true"
  ></span>
</template>
