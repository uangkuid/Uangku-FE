<script setup lang="ts">
import IconDownload from '@/components/icons/IconDownload.vue'
import IconKey from '@/components/icons/IconKey.vue'
</script>

<!-- Decorative illustration of a printed Emergency Kit. -->
<template>
  <div
    class="relative flex w-68 -rotate-3 flex-col gap-3.5 rounded-card bg-surface p-6.5 text-on-surface shadow-elevation-1"
  >
    <div class="flex items-center gap-3">
      <span
        class="flex size-12 items-center justify-center rounded-corner-lg bg-primary text-on-primary"
      >
        <IconKey class="size-6.5" />
      </span>
      <span class="flex flex-1 flex-col gap-1.5">
        <span class="h-2.5 w-4/5 rounded-full bg-on-surface/80"></span>
        <span class="h-2 w-1/2 rounded-full bg-surface-container-highest"></span>
      </span>
    </div>
    <span class="h-2 rounded-full bg-surface-container-high"></span>
    <span class="h-2 w-17/20 rounded-full bg-surface-container-high"></span>
    <span
      class="mt-1 rounded-corner-md bg-secondary-container px-3 py-2.5 text-label-medium font-semibold tracking-[1px] text-on-secondary-container"
    >
      UANGKU-••••-••••-•••
    </span>
    <span
      class="absolute -right-4.5 -bottom-4.5 flex size-14 items-center justify-center rounded-corner-lg bg-inverse-surface text-inverse-on-surface"
    >
      <IconDownload class="size-6" />
    </span>
  </div>
</template>
