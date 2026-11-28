<script setup lang="ts">
import IconLock from '@/components/icons/IconLock.vue'
import IconUser from '@/components/icons/IconUser.vue'
</script>

<!-- Decorative illustration of a locked account card. -->
<template>
  <div
    class="relative flex w-65 flex-col items-center gap-4 rounded-card bg-surface p-7 text-on-surface shadow-elevation-1"
  >
    <div
      class="flex size-16 items-center justify-center rounded-full bg-primary-container text-primary"
    >
      <IconUser width="32" height="32" />
    </div>
    <div class="h-7 w-full rounded-corner-sm bg-surface-container-high"></div>
    <div
      class="flex h-7 w-full items-center gap-1.5 rounded-corner-sm bg-surface-container-high px-3"
    >
      <span v-for="dot in 5" :key="dot" class="size-1.5 rounded-full bg-on-surface-variant"></span>
    </div>
    <div
      class="absolute -bottom-5 -left-5 flex size-14 items-center justify-center rounded-corner-lg bg-inverse-surface text-inverse-on-surface"
    >
      <IconLock stroke-width="2.2" />
    </div>
  </div>
</template>
