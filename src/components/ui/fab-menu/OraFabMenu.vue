<script setup lang="ts" generic="Value extends string">
import { nextTick, ref, useId, useTemplateRef, type Component } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'
import OraFab from '../fab/OraFab.vue'
import { useDismissOnOutsidePress } from '../shared/dismissOnOutsidePress'
import { moveFocus } from '../shared/menuKeys'

defineProps<{
  /** Accessible name of the FAB and its menu. */
  label: string
  /** Two to six actions, the first one on top. */
  items: { value: Value; label: string; icon: Component }[]
}>()

const emit = defineEmits<{ select: [value: Value] }>()

const open = ref(false)
const menuId = useId()
const root = useTemplateRef('root')
useDismissOnOutsidePress(open, root)

const menuItems = () => [...(root.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])]
const focusFab = () => root.value?.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus()

async function toggle() {
  open.value = !open.value
  await nextTick()
  if (open.value) menuItems()[0]?.focus()
  // The FAB and the close button are different elements.
  else focusFab()
}

async function close() {
  open.value = false
  await nextTick()
  focusFab()
}

function choose(value: Value) {
  close()
  emit('select', value)
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') {
    event.stopPropagation()
    return close()
  }
  if (event.key === 'Tab') return (open.value = false)
  moveFocus(event, menuItems())
}
</script>

<!--
  M3 Expressive FAB menu: the FAB turns into a close button and its actions stack above it. The
  `icon` slot draws the FAB's icon. The caller positions it at the bottom end of the screen.
-->
<template>
  <div ref="root" class="relative flex size-14 flex-none" @keydown="onKeydown">
    <div
      v-if="open"
      :id="menuId"
      role="menu"
      :aria-label="label"
      class="absolute right-0 bottom-full z-20 mb-2 flex flex-col items-end gap-1"
    >
      <button
        v-for="(item, index) in items"
        :key="item.value"
        type="button"
        role="menuitem"
        tabindex="-1"
        class="state-layer focus-ring inline-flex h-14 cursor-pointer items-center gap-2 rounded-[28px] bg-primary-container px-6 text-title-medium font-semibold whitespace-nowrap text-on-primary-container shadow-elevation-1 [transition:translate_var(--motion-fast-spatial),opacity_var(--motion-fast-effects)] starting:translate-y-4 starting:opacity-0 [&_svg]:size-6"
        :style="{ transitionDelay: `${(items.length - 1 - index) * 35}ms` }"
        @click="choose(item.value)"
      >
        <component :is="item.icon" />
        {{ item.label }}
      </button>
    </div>
    <button
      v-if="open"
      type="button"
      :aria-label="`Close ${label}`"
      aria-haspopup="menu"
      aria-expanded="true"
      :aria-controls="menuId"
      class="state-layer focus-ring transition-morph inline-flex size-14 cursor-pointer items-center justify-center rounded-[28px] bg-primary text-on-primary shadow-elevation-3"
      @click="toggle"
    >
      <IconClose class="size-5" />
    </button>
    <OraFab v-else :label="label" aria-haspopup="menu" aria-expanded="false" @click="toggle">
      <slot name="icon" />
    </OraFab>
  </div>
</template>
