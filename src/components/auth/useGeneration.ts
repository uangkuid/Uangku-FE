import { ref, watch } from 'vue'

/** How long the prototype pretends to work. */
export const GENERATION_MS = 1400

/**
 * The steps of generating a key on this device. There is no cryptography yet, so it only takes a
 * moment. Leaving the page or calling `reset` cancels it.
 */
export function useGeneration() {
  const phase = ref<'idle' | 'busy' | 'done'>('idle')

  watch(phase, (current, _, onCleanup) => {
    if (current !== 'busy') return
    const timer = setTimeout(() => (phase.value = 'done'), GENERATION_MS)
    onCleanup(() => clearTimeout(timer))
  })

  return {
    phase,
    start: () => (phase.value = 'busy'),
    reset: () => (phase.value = 'idle'),
  }
}
