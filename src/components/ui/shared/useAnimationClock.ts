import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Milliseconds since mount, updated every frame, for motion that CSS cannot express, such as a
 * travelling wave. Under reduced motion it stands at `still` and `running` stays false.
 */
export function useAnimationClock(still = 0) {
  const elapsed = ref(still)
  const running = ref(false)
  let frame = 0

  onMounted(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    running.value = true
    let start: number | undefined
    function tick(now: number) {
      start ??= now
      elapsed.value = now - start
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  })
  onUnmounted(() => cancelAnimationFrame(frame))

  return { elapsed, running }
}
