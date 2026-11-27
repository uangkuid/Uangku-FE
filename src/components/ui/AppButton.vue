<script setup lang="ts">
import { computed, type Component } from 'vue'
import { buttonShapeClasses, type ButtonShape, type ButtonSize } from './button'

type Variant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text'

const {
  variant = 'filled',
  size = 's',
  shape = 'round',
  selected = undefined,
  as = 'button',
  type = 'button',
} = defineProps<{
  variant?: Variant
  size?: ButtonSize
  shape?: ButtonShape
  /** Makes this a toggle button. The `text` variant has no toggle in M3. */
  selected?: boolean
  /** Element or component to render, e.g. `RouterLink` or `ComingSoonLink` for a link. */
  as?: string | Component
  type?: 'button' | 'submit'
}>()

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'touch-target h-8 gap-1 px-3 text-label-large [&_svg]:size-5',
  s: 'touch-target h-10 gap-2 px-4 text-label-large [&_svg]:size-5',
  m: 'h-14 gap-2 px-6 text-title-medium [&_svg]:size-6',
  l: 'h-24 gap-3 px-12 text-headline-small [&_svg]:size-8',
  xl: 'h-34 gap-4 px-16 text-headline-large [&_svg]:size-10',
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
  const toggle = selected !== undefined
  switch (variant) {
    case 'filled':
      return [
        toggle && !selected
          ? 'bg-surface-container text-on-surface-variant'
          : 'bg-primary text-on-primary',
        'enabled:hover:shadow-elevation-1',
        disabledContainer,
      ]
    case 'tonal':
      return [
        selected
          ? 'bg-secondary text-on-secondary'
          : 'bg-secondary-container text-on-secondary-container',
        'enabled:hover:shadow-elevation-1',
        disabledContainer,
      ]
    case 'elevated':
      return [
        selected ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-primary',
        'shadow-elevation-1 enabled:hover:shadow-elevation-2 disabled:shadow-none',
        disabledContainer,
      ]
    case 'outlined':
      return [
        outlineClasses[size],
        selected
          ? 'border-inverse-surface bg-inverse-surface text-inverse-on-surface'
          : toggle
            ? 'border-outline-variant text-on-surface-variant'
            : 'border-outline-variant text-primary',
        'disabled:text-on-surface/38',
      ]
    default:
      return ['text-primary', 'disabled:text-on-surface/38']
  }
})
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :aria-pressed="selected"
    class="state-layer focus-ring transition-morph inline-flex flex-none cursor-pointer items-center justify-center font-semibold whitespace-nowrap select-none disabled:cursor-default [&_svg]:flex-none"
    :class="[sizeClasses[size], buttonShapeClasses(size, shape, selected), colorClasses]"
  >
    <slot />
  </component>
</template>
