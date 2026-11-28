<script setup lang="ts">
import IconClose from '@/components/icons/IconClose.vue'

defineProps<{
  label: string
  selected?: boolean
  disabled?: boolean
}>()

/** The chip's body was pressed, or the chip asks to be removed. */
defineEmits<{ click: []; remove: [] }>()
</script>

<!--
  M3 input chip: something the user entered, such as a recipient or a tag, with a button to remove
  it. Backspace and Delete remove it too. The `leading` slot takes an icon or an avatar.
-->
<template>
  <span
    class="inline-flex h-8 flex-none items-center rounded-corner-sm text-label-large font-semibold [transition:background-color_var(--motion-default-effects)]"
    :class="[
      selected
        ? 'bg-secondary-container text-on-secondary-container'
        : 'border border-outline-variant text-on-surface-variant',
      disabled && 'text-on-surface/38',
    ]"
    @keydown.delete.prevent="!disabled && $emit('remove')"
  >
    <button
      type="button"
      :disabled="disabled"
      :aria-pressed="selected"
      class="state-layer focus-ring inline-flex h-full cursor-pointer items-center gap-2 rounded-l-corner-sm pr-1 pl-3 whitespace-nowrap disabled:cursor-default has-[>[data-leading]]:pl-1"
      @click="$emit('click')"
    >
      <span
        v-if="$slots.leading"
        data-leading
        class="flex flex-none items-center [&>svg]:ml-1 [&>svg]:size-4.5"
      >
        <slot name="leading" />
      </span>
      {{ label }}
    </button>
    <button
      type="button"
      :disabled="disabled"
      :aria-label="`Remove ${label}`"
      class="state-layer focus-ring touch-target mr-1 inline-flex size-6 flex-none cursor-pointer items-center justify-center rounded-full disabled:cursor-default"
      @click="$emit('remove')"
    >
      <IconClose class="size-4.5" />
    </button>
  </span>
</template>
