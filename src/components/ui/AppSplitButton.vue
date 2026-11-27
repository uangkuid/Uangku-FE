<script setup lang="ts">
import { nextTick, ref, useId, useTemplateRef, watch } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import { useDismissOnOutsidePress } from './dismissOnOutsidePress'

defineProps<{
  label: string
  /** Accessible name of the button that opens the menu. */
  menuLabel: string
  items: { value: string; label: string }[]
}>()

const emit = defineEmits<{
  click: []
  select: [value: string]
}>()

const open = ref(false)
const menuId = useId()
const root = useTemplateRef('root')
const toggle = useTemplateRef('toggle')

const menuItems = () => [...(root.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])]

useDismissOnOutsidePress(open, root)

watch(open, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  menuItems()[0]?.focus()
})

function close() {
  open.value = false
  toggle.value?.focus()
}

function onMenuKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    // Only the menu closes, not whatever surrounds it.
    event.stopPropagation()
    return close()
  }
  if (event.key === 'Tab') return (open.value = false)
  const step = { ArrowDown: 1, ArrowUp: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  const all = menuItems()
  const index = all.indexOf(event.target as HTMLElement)
  all[(index + step + all.length) % all.length]?.focus()
}

function choose(value: string) {
  close()
  emit('select', value)
}
</script>

<!-- M3 Expressive split button (filled, medium). The `icon` slot belongs to the leading button. -->
<template>
  <div ref="root" class="relative flex gap-0.5">
    <button
      type="button"
      class="state-layer focus-ring transition-morph inline-flex h-14 cursor-pointer items-center gap-2.5 rounded-l-[28px] rounded-r-[8px] bg-primary pr-6.5 pl-5.5 text-title-medium font-bold text-on-primary select-none active:rounded-r-[12px] [&_svg]:size-5"
      @click="((open = false), emit('click'))"
    >
      <slot name="icon" />
      {{ label }}
    </button>
    <button
      ref="toggle"
      type="button"
      :aria-label="menuLabel"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="open ? menuId : undefined"
      class="state-layer focus-ring transition-morph inline-flex h-14 w-13 cursor-pointer items-center justify-center bg-primary text-on-primary"
      :class="open ? 'rounded-[28px]' : 'rounded-l-[8px] rounded-r-[28px] active:rounded-l-[12px]'"
      @click="open = !open"
    >
      <IconChevronDown
        class="size-5 [transition:rotate_var(--motion-fast-spatial)]"
        :class="open && 'rotate-180'"
      />
    </button>

    <div
      v-if="open"
      :id="menuId"
      role="menu"
      class="absolute right-0 bottom-full z-20 mb-3 flex w-60 flex-col gap-0.5 rounded-corner-lg-inc bg-surface-container-high p-1.5 shadow-elevation-2"
      @keydown="onMenuKeydown"
    >
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        role="menuitem"
        tabindex="-1"
        class="state-layer focus-ring h-12 cursor-pointer rounded-field px-4 text-left text-body-medium font-medium text-on-surface"
        @click="choose(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
