<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * `filter` toggles a choice. `assist` starts a smart action and `suggestion` offers a reply or
     * a query; neither has a selected state.
     */
    variant?: 'filter' | 'assist' | 'suggestion'
    /** Filter chips only. */
    selected?: boolean
    /** Assist and suggestion chips only: a shadow instead of the outline. */
    elevated?: boolean
    disabled?: boolean
    /** Element or component to render, e.g. `RouterLink` or `ComingSoonLink` for a link. */
    as?: string | Component
  }>(),
  { variant: 'filter', as: 'button' },
)

const classes = computed(() => {
  if (props.variant === 'filter') {
    return [
      'h-10 gap-2 px-4 active:rounded-corner-sm',
      props.selected
        ? 'rounded-corner-md bg-secondary-container text-on-secondary-container inset-ring-2 inset-ring-primary'
        : 'rounded-[20px] bg-surface-container-highest text-on-surface',
    ]
  }
  return [
    'h-8 gap-2 rounded-corner-sm px-4 has-[>[data-icon]]:pl-2',
    props.variant === 'assist' ? 'text-on-surface' : 'text-on-surface-variant',
    props.elevated
      ? 'bg-surface-container-low shadow-elevation-1 enabled:hover:shadow-elevation-2'
      : 'border border-outline-variant',
  ]
})
</script>

<!--
  M3 chips. The filter chip has the Uangku shape: a pill that squares off when selected. Assist and
  suggestion chips follow M3, with an optional leading `icon` slot. A removable chip is
  `OraInputChip`.
-->
<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :disabled="disabled"
    :aria-pressed="variant === 'filter' ? Boolean(selected) : undefined"
    class="state-layer focus-ring transition-morph touch-target inline-flex flex-none cursor-pointer items-center text-label-large font-semibold whitespace-nowrap select-none disabled:cursor-default disabled:text-on-surface/38 disabled:shadow-none"
    :class="classes"
  >
    <span v-if="$slots.icon" data-icon class="flex flex-none text-primary [&>svg]:size-4.5">
      <slot name="icon" />
    </span>
    <slot />
  </component>
</template>
