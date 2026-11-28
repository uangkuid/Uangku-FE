<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useOverlayStore } from '@/stores/overlays'

const overlays = useOverlayStore()

/* Held until the overlay is gone, so that no scrollbar returns and nudges it while it slides out. */
function lockScroll() {
  document.documentElement.style.overflow = 'hidden'
}

function unlockScroll() {
  // Another overlay may still be open, or this one opened again while the last one was leaving.
  if (overlays.isOpen) return
  document.documentElement.style.overflow = ''
}

onUnmounted(unlockScroll)
</script>

<!--
  Puts the overlay in its slot over the page, outside whatever is inert, and keeps it on screen while
  it leaves: it styles that with the `sheet-leaving:` variant. The duration is that of
  `--motion-default-spatial`. The slot holds one `v-if` element.
-->
<template>
  <Teleport to="body">
    <Transition
      leave-active-class="pointer-events-none"
      leave-to-class="sheet-leaving"
      :duration="500"
      @before-enter="lockScroll"
      @after-leave="unlockScroll"
    >
      <slot />
    </Transition>
  </Teleport>
</template>
