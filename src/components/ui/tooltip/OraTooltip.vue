<script setup lang="ts">
import { onUnmounted, ref, useId } from 'vue'

const { side = 'top', delay = 400 } = defineProps<{
  /** Supporting text. */
  text: string
  /** Headline of a rich tooltip. */
  title?: string
  side?: 'top' | 'bottom'
  /** Rest of the pointer before it shows, in ms. Keyboard focus shows it at once. */
  delay?: number
}>()

const id = useId()
const open = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function show(after = 0) {
  clearTimeout(timer)
  if (!after) open.value = true
  else timer = setTimeout(() => (open.value = true), after)
}

/** A short grace lets the pointer cross to a rich tooltip. */
function hide(after = 0) {
  clearTimeout(timer)
  if (!after) open.value = false
  else timer = setTimeout(() => (open.value = false), after)
}

function onFocusout(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (!(event.currentTarget as Node).contains(next)) hide()
}

function onEscape(event: KeyboardEvent) {
  if (!open.value) return
  // Only the tooltip closes, not whatever surrounds it.
  event.stopPropagation()
  hide()
}

onUnmounted(() => clearTimeout(timer))
</script>

<!--
  M3 tooltip: plain, or rich with a `title` or an `actions` slot. The default slot is what it
  describes; bind `describedBy` to its `aria-describedby`.
-->
<template>
  <span
    class="relative inline-flex flex-none"
    @mouseenter="show(delay)"
    @mouseleave="hide(150)"
    @focusin="show()"
    @focusout="onFocusout"
    @keydown.esc="onEscape"
  >
    <slot :described-by="id" />
    <span
      class="absolute left-1/2 z-30 -translate-x-1/2 [transition:opacity_var(--motion-fast-effects),scale_var(--motion-fast-spatial),visibility_var(--motion-fast-effects)]"
      :class="[
        side === 'top' ? 'bottom-full pb-1' : 'top-full pt-1',
        open ? 'visible scale-100 opacity-100' : 'invisible scale-90 opacity-0',
      ]"
    >
      <span
        v-if="title || $slots.actions"
        class="flex w-max max-w-80 flex-col items-start gap-1 rounded-corner-md bg-surface-container px-4 pt-3 shadow-elevation-2"
        :class="$slots.actions ? 'pb-2' : 'pb-4'"
      >
        <span v-if="title" class="text-title-small text-on-surface-variant">{{ title }}</span>
        <span :id="id" role="tooltip" class="text-body-medium text-on-surface-variant">
          {{ text }}
        </span>
        <span v-if="$slots.actions" class="-ml-4 flex gap-2 pt-2">
          <slot name="actions" />
        </span>
      </span>
      <span
        v-else
        :id="id"
        role="tooltip"
        class="block w-max max-w-50 rounded-corner-xs bg-inverse-surface px-2 py-1 text-center text-body-small text-inverse-on-surface"
      >
        {{ text }}
      </span>
    </span>
  </span>
</template>
