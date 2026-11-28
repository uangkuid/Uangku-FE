<script setup lang="ts">
import ShapeBlob from '@/components/shapes/ShapeBlob.vue'
</script>

<!--
  Takes a button's place while its work runs: a turning shape (after the M3 loading indicator) and
  what is happening.
-->
<template>
  <div
    role="status"
    class="flex h-14 items-center justify-center gap-3 rounded-[28px] bg-secondary-container text-title-medium font-semibold text-on-secondary-container"
  >
    <ShapeBlob class="size-7 animate-spin text-primary motion-reduce:animate-none" />
    <slot />
  </div>
</template>
