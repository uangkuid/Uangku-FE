<script setup lang="ts">
import IconSnooze from '@/components/icons/IconSnooze.vue'
</script>

<!-- Marks a wallet that is asleep: it takes no new transactions. -->
<template>
  <span
    class="flex flex-none items-center rounded-corner-lg bg-surface-container px-2 py-1 text-on-surface-variant"
    role="img"
    aria-label="Sleeping"
    title="Sleeping wallet"
  >
    <IconSnooze class="size-3.5" />
  </span>
</template>
