<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useId, useTemplateRef, watch } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'
import OraIconButton from '../icon-button/OraIconButton.vue'
import OraSheet from './OraSheet.vue'

const props = defineProps<{
  title: string
  /** Small line above the title that says where the sheet belongs. */
  overline: string
  /** Accessible name of the close button. */
  closeLabel?: string
  /** A dialog is on top: the sheet dims and stops reacting. */
  covered?: boolean
}>()

/** The sheet asks to be closed. */
const emit = defineEmits<{ close: [] }>()

const titleId = useId()
const root = useTemplateRef('root')

let opener: HTMLElement | null = null
let covering: HTMLElement | null = null

const panel = () => root.value?.querySelector<HTMLElement>('[role="dialog"]')

// On `window`, so that it still works once the focused control has left the sheet. Menus and
// dialogs stop the event before it gets here.
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !props.covered) emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  opener = document.activeElement as HTMLElement | null
  const first = root.value?.querySelector<HTMLElement>('[data-autofocus]')
  ;(first ?? panel())?.focus({ preventScroll: true })
})

// Back to what opened the sheet. The page is no longer inert by the time this has left.
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (opener?.isConnected) opener.focus({ preventScroll: true })
})

// Once a dialog on top is gone, focus returns to the control that opened it, if it is still there.
watch(
  () => props.covered,
  async (covered) => {
    if (covered) {
      covering = document.activeElement as HTMLElement | null
      return
    }
    await nextTick()
    ;(covering?.isConnected ? covering : panel())?.focus({ preventScroll: true })
  },
)
</script>

<!--
  A modal side sheet with its scrim, for `OraOverlay`. Escape, the scrim and the close button ask to
  close it. Put `data-autofocus` on the control that takes focus; otherwise the sheet does. Slots:
  default (scrolls), `footer` and `title-end` (beside the title).
-->
<template>
  <div ref="root" class="fixed inset-0 z-40 overflow-clip">
    <!-- Keyboard users dismiss with Escape or the Close button. -->
    <div
      aria-hidden="true"
      data-testid="scrim"
      class="absolute inset-0 bg-scrim opacity-32 [transition:opacity_var(--motion-slow-effects)] starting:opacity-0 sheet-leaving:opacity-0"
      @click="emit('close')"
    ></div>

    <OraSheet
      :title-id="titleId"
      :title="title"
      :overline="overline"
      :covered="covered"
      tabindex="-1"
      class="w-[min(480px,calc(100%-32px))] outline-none [transition:translate_var(--motion-default-spatial)] starting:translate-x-[calc(100%+32px)] sheet-leaving:translate-x-[calc(100%+32px)]"
    >
      <template #title-end><slot name="title-end" /></template>
      <template #action>
        <OraIconButton
          :label="closeLabel ?? 'Close'"
          class="bg-surface-container-high text-on-surface!"
          @click="emit('close')"
        >
          <IconClose />
        </OraIconButton>
      </template>
      <slot />
      <template #footer><slot name="footer" /></template>
    </OraSheet>
  </div>
</template>
