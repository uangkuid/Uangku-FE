<script setup lang="ts">
defineProps<{
  /** Accessible name of the navigation. */
  label: string
}>()
</script>

<!--
  M3 Expressive navigation bar for narrow windows, holding three to five `OraNavBarItem`s. The
  caller fixes it to the bottom edge.
-->
<template>
  <nav :aria-label="label" class="flex min-h-16 w-full justify-center gap-1.5 bg-surface-container">
    <slot />
  </nav>
</template>
