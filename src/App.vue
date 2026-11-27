<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

/* Held until the sheet is gone, so that no scrollbar returns and nudges it while it slides out. */
function lockScroll() {
  document.documentElement.style.overflow = 'hidden'
}

function unlockScroll() {
  document.documentElement.style.overflow = ''
}
</script>

<template>
  <!-- While a route's sheet is open, the page behind it takes no focus or clicks. -->
  <div :inert="route.meta.sheet ? true : undefined">
    <RouterView />
  </div>
  <RouterView v-slot="{ Component }" name="sheet">
    <!--
      Keeps a sheet on screen while it leaves: it styles that with the `sheet-leaving:` variant.
      The duration is that of `--motion-default-spatial`.
    -->
    <Transition
      leave-active-class="pointer-events-none"
      leave-to-class="sheet-leaving"
      :duration="500"
      @before-enter="lockScroll"
      @after-leave="unlockScroll"
    >
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
