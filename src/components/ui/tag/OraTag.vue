<script setup lang="ts">
type Color = 'secondary' | 'primary'
type Size = 's' | 'm'

const { color = 'secondary', size = 's' } = defineProps<{
  color?: Color
  size?: Size
}>()

const colorClasses: Record<Color, string> = {
  secondary: 'bg-secondary-container text-on-secondary-container',
  primary: 'bg-primary-container text-on-primary-container',
}

const sizeClasses: Record<Size, string> = {
  s: 'h-5.5 px-2.5 text-label-small font-semibold',
  m: 'h-7 px-3 text-label-medium font-bold',
}
</script>

<!--
  A short, static piece of metadata. M3 chips are interactive and badges mark icons, so this label
  is Uangku's own.
-->
<template>
  <span
    class="inline-flex flex-none items-center rounded-full"
    :class="[colorClasses[color], sizeClasses[size]]"
  >
    <slot />
  </span>
</template>
