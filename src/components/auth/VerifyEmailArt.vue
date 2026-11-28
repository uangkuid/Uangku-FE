<script setup lang="ts">
import IconCheck from '@/components/icons/IconCheck.vue'
import IconMail from '@/components/icons/IconMail.vue'
</script>

<!-- Decorative illustration of a code arriving by email. -->
<template>
  <div
    class="relative flex w-70 flex-col items-center gap-4.5 rounded-card bg-surface p-7 text-on-surface shadow-elevation-1"
  >
    <div
      class="flex size-16 items-center justify-center rounded-corner-lg-inc bg-primary-container text-primary"
    >
      <IconMail class="size-8" />
    </div>
    <div class="h-2.5 w-7/10 rounded-full bg-surface-container-high"></div>
    <div class="flex gap-1.5">
      <span
        v-for="box in 6"
        :key="box"
        class="h-9 w-7.5 rounded-[10px]"
        :class="box <= 4 ? 'bg-secondary-container' : 'bg-surface-container-high'"
      ></span>
    </div>
    <div
      class="absolute -top-4.5 -right-4.5 flex size-13 items-center justify-center rounded-full bg-success text-on-success"
    >
      <IconCheck class="size-6" stroke-width="2.6" />
    </div>
  </div>
</template>
