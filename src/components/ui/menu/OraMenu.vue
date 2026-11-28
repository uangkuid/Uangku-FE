<script setup lang="ts" generic="Value extends string">
import { nextTick, ref, useId, useTemplateRef, type Component } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import { useDismissOnOutsidePress } from '../shared/dismissOnOutsidePress'
import { moveFocus } from '../shared/menuKeys'

export interface MenuItem<Value extends string = string> {
  value: Value
  label: string
  icon?: Component
  /** Short text at the end, such as a shortcut. */
  trailing?: string
  /** Marks the item as chosen, with a check. */
  selected?: boolean
  disabled?: boolean
  /** Draws a divider above the item. */
  divider?: boolean
}

const {
  items,
  align = 'start',
  side = 'bottom',
} = defineProps<{
  /** Accessible name of the menu. */
  label: string
  items: MenuItem<Value>[]
  align?: 'start' | 'end'
  side?: 'top' | 'bottom'
}>()

const emit = defineEmits<{ select: [value: Value] }>()

const open = ref(false)
const menuId = useId()
const root = useTemplateRef('root')
useDismissOnOutsidePress(open, root)

const enabledItems = () => [
  ...(root.value?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled])') ?? []),
]

async function toggle() {
  open.value = !open.value
  if (!open.value) return
  await nextTick()
  enabledItems()[0]?.focus()
}

function close() {
  open.value = false
  root.value?.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus()
}

function choose(item: MenuItem<Value>) {
  if (item.disabled) return
  close()
  emit('select', item.value)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    // Only the menu closes, not whatever surrounds it.
    event.stopPropagation()
    return close()
  }
  if (event.key === 'Tab') return (open.value = false)
  moveFocus(event, enabledItems())
}
</script>

<!--
  M3 vertical menu. The `trigger` slot draws the button that opens it: bind `props` to it and call
  `toggle` on click.
-->
<template>
  <div ref="root" class="relative inline-flex flex-none">
    <slot
      name="trigger"
      :toggle="toggle"
      :open="open"
      :props="{
        'aria-haspopup': 'menu' as const,
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
      }"
    />
    <div
      v-if="open"
      :id="menuId"
      role="menu"
      :aria-label="label"
      class="absolute z-20 flex w-max max-w-70 min-w-50 flex-col gap-0.5 rounded-corner-lg-inc bg-surface-container-high p-1.5 shadow-elevation-2 [transition:scale_var(--motion-fast-spatial),opacity_var(--motion-fast-effects)] starting:scale-90 starting:opacity-0"
      :class="[
        align === 'start' ? 'left-0' : 'right-0',
        side === 'bottom' ? 'top-full mt-1 origin-top' : 'bottom-full mb-1 origin-bottom',
      ]"
      @keydown="onKeydown"
    >
      <template v-for="item in items" :key="item.value">
        <div v-if="item.divider" role="separator" class="mx-3 my-1 h-px bg-outline-variant"></div>
        <button
          type="button"
          :role="item.selected === undefined ? 'menuitem' : 'menuitemcheckbox'"
          :aria-checked="item.selected"
          :aria-disabled="item.disabled || undefined"
          tabindex="-1"
          class="focus-ring flex h-12 flex-none items-center gap-3 rounded-field px-3 text-left text-body-medium font-medium"
          :class="[
            item.disabled ? 'text-on-surface/38' : 'state-layer cursor-pointer text-on-surface',
            item.selected && 'bg-secondary-container text-on-secondary-container!',
          ]"
          @click="choose(item)"
        >
          <IconCheck v-if="item.selected" class="size-5 flex-none" />
          <component :is="item.icon" v-else-if="item.icon" class="size-5 flex-none" />
          <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
          <span v-if="item.trailing" class="text-label-large text-on-surface-variant">
            {{ item.trailing }}
          </span>
        </button>
      </template>
    </div>
  </div>
</template>
