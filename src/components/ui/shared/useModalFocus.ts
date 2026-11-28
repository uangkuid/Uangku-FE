import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Focus and Escape of a modal sheet or dialog. On mount focus goes to the `data-autofocus` control,
 * or else to the `role="dialog"` panel; Escape asks to close; and on unmount focus returns to what
 * had it before. Menus and nested dialogs stop the Escape before it gets here.
 */
export function useModalFocus(root: Readonly<Ref<HTMLElement | null>>, close: () => void) {
  let opener: HTMLElement | null = null

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') close()
  }

  onMounted(() => {
    // On `window`, so that it still works once the focused control has left the panel.
    window.addEventListener('keydown', onKeydown)
    opener = document.activeElement as HTMLElement | null
    const target =
      root.value?.querySelector<HTMLElement>('[data-autofocus]') ??
      root.value?.querySelector<HTMLElement>('[role="dialog"]')
    target?.focus({ preventScroll: true })
  })

  // The page is no longer inert by the time the overlay has left.
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    if (opener?.isConnected) opener.focus({ preventScroll: true })
  })
}
