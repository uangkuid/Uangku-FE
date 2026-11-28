<script setup lang="ts" generic="Value extends string">
import { type Component } from 'vue'
import { onRadioKeydown, radioTabindex } from '../shared/radioGroup'

const { variant = 'primary' } = defineProps<{
  options: { value: Value; label: string; icon?: Component }[]
  /** Accessible name of the tab list. */
  label: string
  /** Id of the panel that the tabs switch. */
  panelId: string
  /** `secondary` tabs divide the content under primary ones. */
  variant?: 'primary' | 'secondary'
}>()

const selected = defineModel<Value>({ required: true })
</script>

<!--
  M3 primary and secondary tabs. The caller draws the panel, with `role="tabpanel"` and the given
  id.
-->
<template>
  <div
    role="tablist"
    :aria-label="label"
    class="flex gap-1 border-b border-outline-variant"
    @keydown="onRadioKeydown"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="option.value === selected"
      :aria-controls="panelId"
      :tabindex="
        radioTabindex(
          options.map((item) => item.value),
          selected,
          index,
        )
      "
      class="state-layer focus-ring relative inline-flex cursor-pointer items-center gap-2 px-3 text-title-small font-semibold sm:px-6 [&_svg]:size-5.5"
      :class="[
        variant === 'primary' ? 'h-14 rounded-t-corner-lg' : 'h-12',
        option.value !== selected
          ? 'text-on-surface-variant'
          : variant === 'primary'
            ? 'text-primary'
            : 'text-on-surface',
      ]"
      @click="selected = option.value"
    >
      <component :is="option.icon" v-if="option.icon" />
      {{ option.label }}
      <span
        aria-hidden="true"
        data-indicator
        class="absolute -bottom-px bg-primary [transition:opacity_var(--motion-default-effects)]"
        :class="[
          variant === 'primary' ? 'inset-x-4 h-0.75 rounded-t-full' : 'inset-x-0 h-0.5',
          option.value === selected ? 'opacity-100' : 'opacity-0',
        ]"
      ></span>
    </button>
  </div>
</template>
