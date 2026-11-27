<script setup lang="ts">
import type { Component } from 'vue'

const { as = 'button' } = defineProps<{
  label: string
  icon: Component
  /** Horizontal item of the expanded rail, instead of the icon over its label. */
  expanded?: boolean
  /** Element or component to render. A `RouterLink` marks the current page by itself. */
  as?: string | Component
}>()
</script>

<!-- M3 Expressive navigation rail item. The active item carries `aria-current="page"`. -->
<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    class="group focus-ring flex w-full flex-none cursor-pointer items-center text-on-surface-variant"
    :class="
      expanded
        ? 'state-layer transition-morph h-14 gap-2 rounded-[28px] px-4 aria-[current=page]:bg-secondary-container aria-[current=page]:text-on-secondary-container'
        : 'min-h-16 flex-col justify-center gap-1 rounded-corner-lg'
    "
  >
    <!-- Collapsed, the active indicator and its state layer are a pill around the icon. -->
    <span
      class="relative flex flex-none items-center justify-center [&>svg]:size-6 group-aria-[current=page]:[&>svg]:stroke-[2.2]"
      :class="
        expanded
          ? 'size-6'
          : 'h-8 w-14 rounded-corner-lg [transition:background-color_var(--motion-default-effects)] group-aria-[current=page]:bg-secondary-container group-aria-[current=page]:text-on-secondary-container after:absolute after:inset-0 after:rounded-[inherit] after:bg-on-secondary-container after:opacity-0 after:[transition:opacity_var(--motion-fast-effects)] group-hover:after:opacity-8 group-focus-visible:after:opacity-10 group-active:after:opacity-10'
      "
    >
      <component :is="icon" />
    </span>
    <span
      class="whitespace-nowrap group-aria-[current=page]:font-bold"
      :class="
        expanded
          ? 'text-label-large'
          : 'text-center text-label-medium group-aria-[current=page]:text-secondary'
      "
    >
      {{ label }}
    </span>
  </component>
</template>
