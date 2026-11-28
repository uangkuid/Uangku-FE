<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { moveFocus } from '../shared/menuKeys'

const {
  variant = 'floating',
  color = 'standard',
  vertical = false,
} = defineProps<{
  /** Accessible name. */
  label: string
  /** `docked` spans the bottom of the window; `floating` is a pill over the content. */
  variant?: 'docked' | 'floating'
  color?: 'standard' | 'vibrant'
  /** Floating toolbars only. */
  vertical?: boolean
}>()

const bar = useTemplateRef('bar')

function onKeydown(event: KeyboardEvent) {
  const controls = [
    ...(bar.value?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]') ?? []),
  ]
  if (!controls.includes(event.target as HTMLElement)) return
  moveFocus(event, controls, vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'])
}
</script>

<!--
  M3 Expressive toolbar of actions for the current screen. The caller positions it. A floating one
  may pair with a FAB in the `fab` slot. `vibrant` recolors the standard buttons inside it.
-->
<template>
  <div
    class="flex items-center gap-2"
    :class="[variant === 'docked' ? 'w-full' : 'w-max', vertical && 'flex-col']"
  >
    <div
      ref="bar"
      role="toolbar"
      :aria-label="label"
      :aria-orientation="vertical ? 'vertical' : 'horizontal'"
      class="flex items-center"
      :class="[
        variant === 'docked'
          ? 'h-16 w-full justify-between px-4'
          : ['gap-1 rounded-full p-2 shadow-elevation-3', vertical ? 'w-16 flex-col' : 'h-16'],
        color === 'vibrant'
          ? 'bg-primary-container text-on-primary-container [--on-surface-variant:var(--on-primary-container)]'
          : 'bg-surface-container text-on-surface-variant',
      ]"
      @keydown="onKeydown"
    >
      <slot />
    </div>
    <slot name="fab" />
  </div>
</template>
