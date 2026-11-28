<script setup lang="ts">
defineProps<{
  /** Small line above the title. */
  overline: string
  title: string
}>()
</script>

<!-- The heading of a screen. The default slot holds the actions at its end. -->
<template>
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex min-w-0 flex-col gap-0.5">
      <span class="text-label-large text-on-surface-variant">{{ overline }}</span>
      <h1 class="font-display text-display-small font-bold tracking-[-0.5px]">{{ title }}</h1>
    </div>
    <slot />
  </header>
</template>
