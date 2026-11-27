<script setup lang="ts">
import { computed, type Component } from 'vue'
import { buttonShapeClasses, type ButtonShape, type ButtonSize } from '../shared/button'

type Variant = 'standard' | 'filled' | 'tonal' | 'outlined'
type Width = 'narrow' | 'default' | 'wide'

const {
  label,
  variant = 'standard',
  size = 's',
  width = 'default',
  shape = 'round',
  selected = undefined,
  as = 'button',
} = defineProps<{
  /** Accessible name; the button shows only an icon. */
  label: string
  variant?: Variant
  size?: ButtonSize
  width?: Width
  shape?: ButtonShape
  /** Makes this a toggle button. */
  selected?: boolean
  /** Element or component to render, e.g. `RouterLink` or `ComingSoonLink` for a link. */
  as?: string | Component
}>()

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'touch-target h-8 [&_svg]:size-5',
  s: 'touch-target h-10 [&_svg]:size-6',
  m: 'h-14 [&_svg]:size-6',
  l: 'h-24 [&_svg]:size-8',
  xl: 'h-34 [&_svg]:size-10',
}

const widthClasses: Record<ButtonSize, Record<Width, string>> = {
  xs: { narrow: 'w-7', default: 'w-8', wide: 'w-10' },
  s: { narrow: 'w-8', default: 'w-10', wide: 'w-13' },
  m: { narrow: 'w-12', default: 'w-14', wide: 'w-18' },
  l: { narrow: 'w-16', default: 'w-24', wide: 'w-32' },
  xl: { narrow: 'w-26', default: 'w-34', wide: 'w-46' },
}

const outlineClasses: Record<ButtonSize, string> = {
  xs: 'border',
  s: 'border',
  m: 'border',
  l: 'border-2',
  xl: 'border-3',
}

const disabledContainer = 'disabled:bg-on-surface/10 disabled:text-on-surface/38'

const colorClasses = computed(() => {
  const unselected = selected === false
  switch (variant) {
    case 'filled':
      return [
        unselected ? 'bg-surface-container text-on-surface-variant' : 'bg-primary text-on-primary',
        disabledContainer,
      ]
    case 'tonal':
      return [
        selected
          ? 'bg-secondary text-on-secondary'
          : 'bg-secondary-container text-on-secondary-container',
        disabledContainer,
      ]
    case 'outlined':
      return [
        outlineClasses[size],
        selected
          ? 'border-inverse-surface bg-inverse-surface text-inverse-on-surface'
          : 'border-outline-variant text-on-surface-variant',
        'disabled:text-on-surface/38',
      ]
    default:
      return [selected ? 'text-primary' : 'text-on-surface-variant', 'disabled:text-on-surface/38']
  }
})
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :aria-label="label"
    :aria-pressed="selected"
    class="state-layer focus-ring transition-morph inline-flex flex-none cursor-pointer items-center justify-center disabled:cursor-default"
    :class="[
      sizeClasses[size],
      widthClasses[size][width],
      buttonShapeClasses(size, shape, selected),
      colorClasses,
    ]"
  >
    <slot />
  </component>
</template>
