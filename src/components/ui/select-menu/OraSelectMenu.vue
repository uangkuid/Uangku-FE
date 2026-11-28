<script setup lang="ts" generic="Value extends string | number">
import { nextTick, ref, useTemplateRef } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import OraButton from '../button/OraButton.vue'
import { useDismissOnOutsidePress } from '../shared/dismissOnOutsidePress'

const { size = 's' } = defineProps<{
  /** What is being chosen, e.g. "Year". It names the button and the list. */
  label: string
  options: Value[]
  selected: Value
  size?: 's' | 'm'
}>()

const emit = defineEmits<{ select: [value: Value] }>()

const open = ref(false)
const root = useTemplateRef('root')
useDismissOnOutsidePress(open, root)

async function focusIn(selector: string) {
  await nextTick()
  root.value?.querySelector<HTMLElement>(selector)?.focus()
}

function toggle() {
  open.value = !open.value
  if (open.value) focusIn('[role="option"][aria-selected="true"], [role="option"]')
}

function close() {
  open.value = false
  focusIn('[aria-haspopup="listbox"]')
}

function choose(value: Value) {
  emit('select', value)
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    // Only the list closes, not whatever surrounds it.
    event.stopPropagation()
    return close()
  }
  const step = { ArrowDown: 1, ArrowUp: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  const all = [...(root.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])]
  const index = all.indexOf(event.target as HTMLElement)
  all[(index + step + all.length) % all.length]?.focus()
}

function onFocusout(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !(event.currentTarget as Node).contains(next)) open.value = false
}
</script>

<!-- A button that shows the value in use and opens a short list of the others. -->
<template>
  <div ref="root" class="relative flex-none" @focusout="onFocusout">
    <OraButton
      variant="tonal"
      :size="size"
      class="gap-1! bg-surface-container-high! text-on-surface!"
      :class="size === 'm' ? 'pr-4.5! pl-5.5!' : 'pr-2.5! pl-3.5!'"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="`${label}, ${selected}`"
      @click="toggle"
    >
      {{ selected }}
      <IconChevronDown :class="open && 'rotate-180'" />
    </OraButton>
    <div
      v-if="open"
      role="listbox"
      :aria-label="label"
      class="absolute right-0 z-20 flex w-30 flex-col gap-0.5 rounded-corner-lg-inc bg-surface-container-high p-1.5 shadow-elevation-2"
      :class="size === 'm' ? 'top-15.5' : 'top-11.5'"
      @keydown="onKeydown"
    >
      <button
        v-for="option in options"
        :key="option"
        type="button"
        role="option"
        :aria-selected="option === selected"
        class="state-layer focus-ring h-10 flex-none cursor-pointer rounded-field text-label-large font-semibold"
        :class="
          option === selected
            ? 'bg-secondary-container text-on-secondary-container'
            : 'text-on-surface'
        "
        @click="choose(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
