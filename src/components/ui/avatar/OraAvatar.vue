<script setup lang="ts">
defineProps<{ initials: string }>()
</script>

<!-- The design system's extra-small avatar. Its colors do not follow the theme. -->
<template>
  <span
    class="flex h-7 w-7.5 flex-none items-center justify-center rounded-full bg-logo-blue text-[12px] leading-4.5 font-bold text-on-logo-blue"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>
