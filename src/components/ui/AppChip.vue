<script setup lang="ts">
defineProps<{ selected: boolean }>()
</script>

<!-- M3 filter chip in the Uangku shape: a pill that squares off when selected. -->
<template>
  <button
    type="button"
    :aria-pressed="selected"
    class="state-layer focus-ring transition-morph touch-target inline-flex h-10 flex-none cursor-pointer items-center gap-2 px-4 text-label-large font-semibold whitespace-nowrap select-none active:rounded-corner-sm"
    :class="
      selected
        ? 'rounded-corner-md bg-secondary-container text-on-secondary-container inset-ring-2 inset-ring-primary'
        : 'rounded-[20px] bg-surface-container-highest text-on-surface'
    "
  >
    <slot />
  </button>
</template>
