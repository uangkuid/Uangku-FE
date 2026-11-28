<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { useModalFocus } from '../shared/useModalFocus'

defineProps<{ title: string }>()

/** The sheet asks to be closed. */
const emit = defineEmits<{ close: [] }>()

const titleId = useId()
const root = useTemplateRef('root')
useModalFocus(root, () => emit('close'))

/** How far a drag of the handle has pulled the sheet down, in px. */
const offset = ref(0)
const startY = ref<number>()
let dragged = false

function onPointerdown(event: PointerEvent) {
  startY.value = event.clientY
  dragged = false
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

function onPointermove(event: PointerEvent) {
  if (startY.value === undefined) return
  offset.value = Math.max(event.clientY - startY.value, 0)
  if (offset.value > 4) dragged = true
}

function onPointerup() {
  if (startY.value === undefined) return
  startY.value = undefined
  if (offset.value > 96) emit('close')
  else offset.value = 0
}

// A press without a drag closes the sheet, which is also how the keyboard uses the handle.
function onClick() {
  if (!dragged) emit('close')
  dragged = false
}
</script>

<!--
  M3 modal bottom sheet, for `OraOverlay`. Escape, the scrim, the drag handle and a drag downward
  ask to close it. Slots: default (scrolls) and `footer`.
-->
<template>
  <div ref="root" class="fixed inset-0 z-40 flex items-end justify-center overflow-clip">
    <!-- Keyboard users dismiss with Escape or the handle. -->
    <div
      aria-hidden="true"
      data-testid="scrim"
      class="absolute inset-0 bg-scrim opacity-32 [transition:opacity_var(--motion-slow-effects)] starting:opacity-0 sheet-leaving:opacity-0"
      @click="emit('close')"
    ></div>

    <section
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      tabindex="-1"
      class="relative flex max-h-[calc(100%-72px)] w-full max-w-160 flex-col overflow-hidden rounded-t-corner-xl bg-surface-container-low shadow-elevation-3 outline-none [transition:translate_var(--motion-default-spatial),transform_var(--motion-default-spatial)] starting:translate-y-full sheet-leaving:translate-y-full"
      :style="offset ? { transform: `translateY(${offset}px)` } : undefined"
      :class="startY !== undefined && 'transition-none!'"
    >
      <button
        type="button"
        aria-label="Close sheet"
        class="focus-ring group mx-auto flex h-12 w-24 flex-none cursor-grab touch-none items-center justify-center rounded-corner-md active:cursor-grabbing"
        @pointerdown="onPointerdown"
        @pointermove="onPointermove"
        @pointerup="onPointerup"
        @pointercancel="onPointerup"
        @click="onClick"
      >
        <span
          class="h-1 w-8 rounded-full bg-on-surface-variant/40 [transition:background-color_var(--motion-fast-effects)] group-hover:bg-on-surface-variant"
        ></span>
      </button>
      <h2 :id="titleId" class="px-6 pb-3 font-display text-headline-small font-bold">
        {{ title }}
      </h2>
      <div class="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <slot />
      </div>
      <slot name="footer" />
    </section>
  </div>
</template>
