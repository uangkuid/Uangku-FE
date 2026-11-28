<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ seed: string }>()

const SIZE = 25

/** Whether a module belongs to one of the three finder squares or the blank ring around them. */
function finder(x: number, y: number) {
  for (const [left, top] of [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ] as const) {
    const dx = x - left
    const dy = y - top
    if (dx < -1 || dx > 7 || dy < -1 || dy > 7) continue
    const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3))
    return ring <= 1 || ring === 3
  }
  return undefined
}

const path = computed(() => {
  let state = [...props.seed].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7)
  let d = ''
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0
      if (finder(x, y) ?? state >>> 31 === 1) d += `M${x} ${y}h1v1h-1z`
    }
  }
  return d
})
</script>

<!--
  A stand-in for a QR code: it looks like one and changes with its seed, but encodes nothing.
  Replace it with a real encoder once invitations exist.
-->
<template>
  <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" fill="currentColor" shape-rendering="crispEdges">
    <path :d="path" />
  </svg>
</template>
