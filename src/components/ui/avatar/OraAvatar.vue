<script setup lang="ts">
type Size = 'xs' | 'sm' | 'md'

const { size = 'xs' } = defineProps<{
  initials: string
  size?: Size
}>()

const sizeClasses: Record<Size, string> = {
  xs: 'h-7 w-7.5 text-[12px]',
  sm: 'size-10 text-[14px]',
  md: 'size-14 text-[18px]',
}
</script>

<!-- The design system's avatar. Its colors do not follow the theme; override them with `!`. -->
<template>
  <span
    class="flex flex-none items-center justify-center rounded-full bg-logo-blue leading-4.5 font-bold text-on-logo-blue"
    :class="sizeClasses[size]"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>
