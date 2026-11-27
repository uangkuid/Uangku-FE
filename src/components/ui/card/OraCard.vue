<script setup lang="ts">
type Variant = 'filled' | 'elevated' | 'outlined' | 'primary' | 'tertiary'

const { variant = 'filled', as = 'section' } = defineProps<{
  variant?: Variant
  as?: string
}>()

const variantClasses: Record<Variant, string> = {
  filled: 'bg-surface-container-low',
  elevated: 'bg-surface-container-low shadow-elevation-1',
  outlined: 'border border-outline-variant bg-surface-container-lowest',
  // Color roles for the cards that carry the most emphasis.
  primary: 'bg-primary text-on-primary',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}
</script>

<!-- Padding and layout come from the `class` of the caller. -->
<template>
  <component :is="as" class="flex min-w-0 flex-col rounded-card" :class="variantClasses[variant]">
    <slot />
  </component>
</template>
