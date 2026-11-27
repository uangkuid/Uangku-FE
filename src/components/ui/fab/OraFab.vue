<script setup lang="ts">
import type { Component } from 'vue'

type Size = 'default' | 'medium' | 'large'
type Color = 'primary-container' | 'secondary-container' | 'tertiary-container' | 'primary'

const {
  label,
  size = 'default',
  color = 'primary-container',
  extended = false,
  as = 'button',
} = defineProps<{
  /** Accessible name, and the visible text when `extended`. */
  label: string
  size?: Size
  color?: Color
  /** Shows the label next to the icon (extended FAB). */
  extended?: boolean
  /** Element or component to render, e.g. `RouterLink` or `ComingSoonLink` for a link. */
  as?: string | Component
}>()

const sizeClasses: Record<Size, string> = {
  default: 'h-14 min-w-14 rounded-corner-lg active:rounded-[28px] [&_svg]:size-6',
  medium: 'h-20 min-w-20 rounded-corner-lg-inc active:rounded-[40px] [&_svg]:size-7',
  large: 'h-24 min-w-24 rounded-corner-xl active:rounded-[48px] [&_svg]:size-9',
}

const extendedClasses: Record<Size, string> = {
  default: 'gap-2 px-4 text-title-medium',
  medium: 'gap-3 px-6.5 text-title-large',
  large: 'gap-4 px-7 text-headline-small',
}

const colorClasses: Record<Color, string> = {
  'primary-container': 'bg-primary-container text-on-primary-container',
  'secondary-container': 'bg-secondary-container text-on-secondary-container',
  'tertiary-container': 'bg-tertiary-container text-on-tertiary-container',
  primary: 'bg-primary text-on-primary',
}
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :aria-label="label"
    :title="extended ? undefined : label"
    class="state-layer focus-ring transition-morph inline-flex flex-none cursor-pointer items-center justify-center shadow-elevation-1 hover:shadow-elevation-2 [&_svg]:flex-none"
    :class="[sizeClasses[size], colorClasses[color], extended && extendedClasses[size]]"
  >
    <slot />
    <span v-if="extended" class="font-semibold whitespace-nowrap">{{ label }}</span>
  </component>
</template>
