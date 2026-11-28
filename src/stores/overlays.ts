import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'

interface Layer {
  close: () => void
}

/**
 * The overlays that are open over the current screen, the one on top last. While there is one,
 * `App.vue` makes the page inert and Back closes the top layer instead of navigating.
 */
export const useOverlayStore = defineStore('overlays', () => {
  const layers = shallowRef<Layer[]>([])
  const isOpen = computed(() => layers.value.length > 0)

  /** Adds a layer and returns the function that removes it, which `close` should end up calling. */
  function push(close: () => void) {
    const layer = { close }
    layers.value = [...layers.value, layer]
    return () => {
      layers.value = layers.value.filter((other) => other !== layer)
    }
  }

  function closeTop() {
    layers.value[layers.value.length - 1]?.close()
  }

  return { isOpen, push, closeTop }
})
