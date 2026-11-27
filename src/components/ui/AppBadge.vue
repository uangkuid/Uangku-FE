<script setup lang="ts">
defineProps<{
  /** Count or short text. Without it the badge is a small dot. */
  label?: number | string
}>()
</script>

<!-- M3 badge. Position it over its icon with the `class` of the caller. -->
<template>
  <span
    class="pointer-events-none inline-flex flex-none items-center justify-center rounded-full bg-error text-on-error"
    :class="label === undefined ? 'size-1.5' : 'h-4 min-w-4 px-1 text-label-small'"
  >
    {{ label }}
  </span>
</template>
