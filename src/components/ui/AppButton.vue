<script setup lang="ts">
type Variant = 'filled' | 'outlined' | 'text' | 'icon'

const { variant = 'filled', type = 'button' } = defineProps<{
  variant?: Variant
  type?: 'button' | 'submit'
}>()

const variantClasses: Record<Variant, string> = {
  filled: 'h-14 rounded-[28px] bg-primary px-4 text-title-medium font-semibold text-on-primary',
  outlined:
    'h-14 rounded-[28px] border border-outline-variant px-4 text-title-medium font-semibold text-primary',
  text: 'h-10 rounded-[20px] px-3 text-label-large font-semibold text-primary',
  // No color of its own: the icon takes the surrounding text color.
  icon: 'size-12 rounded-24',
}
</script>

<template>
  <button
    :type="type"
    class="state-layer focus-ring flex flex-none cursor-pointer items-center justify-center gap-2.5"
    :class="variantClasses[variant]"
  >
    <slot />
  </button>
</template>
