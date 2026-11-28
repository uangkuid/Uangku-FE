<script setup lang="ts" generic="Value extends string">
import { type Component } from 'vue'
import { onRadioKeydown, radioTabindex } from '../shared/radioGroup'

defineProps<{
  options: { value: Value; label: string; icon?: Component }[]
  /** Accessible name of the tab list. */
  label: string
  /** Id of the panel that the tabs switch. */
  panelId: string
}>()

const selected = defineModel<Value>({ required: true })
</script>

<!-- M3 primary tabs. The caller draws the panel, with `role="tabpanel"` and the given id. -->
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
      class="state-layer focus-ring relative inline-flex h-14 cursor-pointer items-center gap-2 rounded-t-corner-lg px-3 text-title-small font-semibold sm:px-6 [&_svg]:size-5.5"
      :class="option.value === selected ? 'text-primary' : 'text-on-surface-variant'"
      @click="selected = option.value"
    >
      <component :is="option.icon" v-if="option.icon" />
      {{ option.label }}
      <span
        aria-hidden="true"
        class="absolute inset-x-4 -bottom-px h-0.75 rounded-t-full bg-primary [transition:opacity_var(--motion-default-effects)]"
        :class="option.value === selected ? 'opacity-100' : 'opacity-0'"
      ></span>
    </button>
  </div>
</template>
