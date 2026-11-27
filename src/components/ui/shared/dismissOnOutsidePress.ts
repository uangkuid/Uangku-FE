import { onUnmounted, watch, type Ref } from 'vue'

/** Closes a popup, such as a menu, when a press lands outside of `root`. */
export function useDismissOnOutsidePress(
  open: Ref<boolean>,
  root: Readonly<Ref<HTMLElement | null>>,
) {
  function onPointerDown(event: PointerEvent) {
    if (!root.value?.contains(event.target as Node)) open.value = false
  }

  watch(open, (isOpen) => {
    if (isOpen) document.addEventListener('pointerdown', onPointerDown)
    else document.removeEventListener('pointerdown', onPointerDown)
  })
  onUnmounted(() => document.removeEventListener('pointerdown', onPointerDown))
}
