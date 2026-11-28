<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
import OraButton from '../button/OraButton.vue'
import { useModalFocus } from './useModalFocus'

defineProps<{
  title: string
  confirmDisabled?: boolean
}>()

const emit = defineEmits<{ close: []; confirm: [] }>()

const titleId = useId()
const root = useTemplateRef('root')
useModalFocus(root, () => emit('close'))
</script>

<!--
  The frame of the modal date and time pickers, for `OraOverlay`. Slots: default and `toggle` (the
  button that switches between picking and typing).
-->
<template>
  <div ref="root" class="fixed inset-0 z-50 flex overflow-y-auto p-4">
    <div
      aria-hidden="true"
      data-testid="dialog-scrim"
      class="fixed inset-0 bg-scrim opacity-40 [transition:opacity_var(--motion-slow-effects)] starting:opacity-0 sheet-leaving:opacity-0"
      @click="emit('close')"
    ></div>
    <form
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      tabindex="-1"
      novalidate
      class="relative m-auto flex w-full max-w-90 flex-col gap-4 rounded-corner-xl bg-surface-container-high p-4 shadow-elevation-3 outline-none [transition:scale_var(--motion-fast-spatial),opacity_var(--motion-fast-effects)] starting:scale-90 starting:opacity-0 sheet-leaving:scale-90 sheet-leaving:opacity-0"
      @submit.prevent="confirmDisabled || emit('confirm')"
    >
      <h2 :id="titleId" class="px-2 pt-2 text-label-large text-on-surface-variant">
        {{ title }}
      </h2>
      <div class="flex flex-col items-center gap-4">
        <slot />
      </div>
      <div class="flex items-center gap-2">
        <slot name="toggle" />
        <span class="flex-1"></span>
        <OraButton variant="text" @click="emit('close')">Cancel</OraButton>
        <OraButton variant="text" type="submit" :disabled="confirmDisabled">OK</OraButton>
      </div>
    </form>
  </div>
</template>
