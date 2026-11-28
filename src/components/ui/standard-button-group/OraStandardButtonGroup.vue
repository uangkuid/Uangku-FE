<script setup lang="ts">
const { size = 's' } = defineProps<{
  /** Accessible name of the group. */
  label: string
  /** Size of the buttons inside, which sets the space between them. */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
}>()

const gapClasses = { xs: 'gap-4.5', s: 'gap-3', m: 'gap-2', l: 'gap-2', xl: 'gap-2' }
</script>

<!--
  M3 Expressive standard button group: separate buttons, icon buttons or both, in the default slot.
  The pressed one widens and pushes its neighbours.
-->
<template>
  <div
    role="group"
    :aria-label="label"
    class="flex flex-wrap items-center *:[transition:padding_var(--motion-fast-spatial),width_var(--motion-fast-spatial),border-radius_var(--motion-fast-spatial),background-color_var(--motion-default-effects),color_var(--motion-default-effects)] [&>*:enabled:active]:px-8"
    :class="gapClasses[size]"
  >
    <slot />
  </div>
</template>
