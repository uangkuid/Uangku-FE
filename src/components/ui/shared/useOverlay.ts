import { onScopeDispose, reactive, shallowRef } from 'vue'
import { useOverlayStore } from '@/stores/overlays'

/**
 * Open state of one overlay (a side sheet or a dialog), registered with the overlay store while it
 * is open. Closing takes effect at once, so a navigation may follow in the same tick.
 *
 * `payload` is what the overlay is about, e.g. the transaction a detail sheet shows.
 */
export function useOverlay<Payload = true>() {
  const store = useOverlayStore()
  const payload = shallowRef<Payload>()
  const isOpen = shallowRef(false)
  let remove: (() => void) | undefined

  function close() {
    remove?.()
    remove = undefined
    isOpen.value = false
  }

  /** Opens the overlay, or swaps the payload of the one already open. */
  function open(...[value]: Payload extends true ? [] : [value: Payload]) {
    payload.value = value
    isOpen.value = true
    remove ??= store.push(close)
  }

  onScopeDispose(close)

  return reactive({ isOpen, payload, open, close })
}
