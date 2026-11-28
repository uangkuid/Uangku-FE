<script setup lang="ts">
import type { Component } from 'vue'
import OraBadge from '../badge/OraBadge.vue'

const { as = 'button', badge = undefined } = defineProps<{
  label: string
  icon: Component
  /** Icon beside the label, for medium windows, instead of above it. */
  horizontal?: boolean
  /** A count on the icon; `true` shows a small dot. */
  badge?: number | string | boolean
  /** Element or component to render. A `RouterLink` marks the current page by itself. */
  as?: string | Component
}>()
</script>

<!-- An item of `OraNavBar`. The active one carries `aria-current="page"`. -->
<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    class="group focus-ring flex cursor-pointer items-center justify-center rounded-corner-lg text-on-surface-variant"
    :class="horizontal ? 'flex-none px-1' : 'min-w-0 flex-1 flex-col gap-1 py-1.5'"
  >
    <span
      class="relative flex items-center justify-center rounded-full [transition:background-color_var(--motion-default-effects),width_var(--motion-fast-spatial)] group-aria-[current=page]:bg-secondary-container group-aria-[current=page]:text-on-secondary-container after:absolute after:inset-0 after:rounded-[inherit] after:bg-on-secondary-container after:opacity-0 after:[transition:opacity_var(--motion-fast-effects)] group-hover:after:opacity-8 group-focus-visible:after:opacity-10 group-active:after:opacity-10"
      :class="horizontal ? 'h-10 gap-1 px-4' : 'h-8 w-14'"
    >
      <span
        class="relative flex [&>svg]:size-6 group-aria-[current=page]:[&>svg]:stroke-[2.2]"
        :class="horizontal && badge !== undefined && typeof badge !== 'boolean' && 'mr-2.5'"
      >
        <component :is="icon" />
        <OraBadge
          v-if="badge !== undefined && badge !== false"
          :label="badge === true ? undefined : badge"
          class="absolute -top-1"
          :class="badge === true ? '-right-0.5' : '-right-2.5'"
        />
      </span>
      <span
        v-if="horizontal"
        class="text-label-medium whitespace-nowrap group-aria-[current=page]:font-bold"
      >
        {{ label }}
      </span>
    </span>
    <span
      v-if="!horizontal"
      class="max-w-full truncate text-label-medium group-aria-[current=page]:font-bold group-aria-[current=page]:text-secondary"
    >
      {{ label }}
    </span>
  </component>
</template>
