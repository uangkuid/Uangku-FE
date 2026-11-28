<script setup lang="ts">
import { onMounted, useId, useTemplateRef } from 'vue'

defineProps<{ title: string }>()

/** Escape and the scrim ask to close the dialog. */
const emit = defineEmits<{ close: [] }>()

const titleId = useId()
const bodyId = useId()
const root = useTemplateRef('root')

// The first action is the safe one, so it takes focus.
onMounted(() => root.value?.querySelector<HTMLElement>('[data-actions] button')?.focus())

/** Keeps Tab inside the dialog. */
function onTab(event: KeyboardEvent) {
  const focusable = [...(root.value?.querySelectorAll<HTMLElement>('button, a[href], input') ?? [])]
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const [edge, next] = event.shiftKey ? [first, last] : [last, first]
  if (document.activeElement !== edge) return
  event.preventDefault()
  next?.focus()
}
</script>

<!--
  M3 basic dialog for a decision, for `OraOverlay`. Slots: `hero` (above the headline), default (the
  supporting text) and `actions`, the dismissing one first.
-->
<template>
  <div
    ref="root"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-6"
    @keydown.esc.stop="emit('close')"
    @keydown.tab="onTab"
  >
    <div
      aria-hidden="true"
      data-testid="dialog-scrim"
      class="fixed inset-0 bg-scrim opacity-40 [transition:opacity_var(--motion-slow-effects)] starting:opacity-0 sheet-leaving:opacity-0"
      @click="emit('close')"
    ></div>
    <div
      role="alertdialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="bodyId"
      tabindex="-1"
      class="relative flex w-full max-w-105 flex-col gap-4 rounded-corner-xl bg-surface-container-high p-6 shadow-elevation-3 outline-none [transition:scale_var(--motion-fast-spatial),opacity_var(--motion-fast-effects)] starting:scale-90 starting:opacity-0 sheet-leaving:scale-90 sheet-leaving:opacity-0"
    >
      <slot name="hero" />
      <h2 :id="titleId" class="font-display text-headline-small font-bold">{{ title }}</h2>
      <p :id="bodyId" class="text-body-medium text-on-surface-variant"><slot /></p>
      <div data-actions class="mt-2 flex gap-3 *:flex-1!">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
