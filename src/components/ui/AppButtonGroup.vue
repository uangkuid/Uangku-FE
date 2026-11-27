<script setup lang="ts" generic="Value extends string">
import { onRadioKeydown, radioTabindex } from './radioGroup'

type Size = 's' | 'm'
type Position = 'start' | 'middle' | 'end'

const props = withDefaults(
  defineProps<{
    options: { value: Value; label: string }[]
    selected?: Value
    /** Accessible name of the group. */
    label: string
    /** `radio` picks one value; `toggle` buttons report `aria-pressed` and may also open things. */
    selection?: 'radio' | 'toggle'
    size?: Size
    /** Stretches the buttons over the full width. */
    fill?: boolean
  }>(),
  { selected: undefined, selection: 'radio', size: 's' },
)

/** Also fires for the option that is already selected. */
const emit = defineEmits<{ select: [value: Value] }>()

const sizeClasses: Record<Size, string> = {
  s: 'touch-target h-10 px-5 text-label-large',
  m: 'h-14 px-6 text-title-medium',
}

/* A selected button is fully round; the others keep small corners where they meet. */
const shapeClasses: Record<Size, Record<Position | 'selected', string>> = {
  s: {
    selected: 'rounded-[20px]',
    start: 'rounded-l-[20px] rounded-r-[8px] active:rounded-r-[4px]',
    middle: 'rounded-[8px] active:rounded-[4px]',
    end: 'rounded-l-[8px] rounded-r-[20px] active:rounded-l-[4px]',
  },
  m: {
    selected: 'rounded-[28px]',
    start: 'rounded-l-[28px] rounded-r-[8px] active:rounded-r-[4px]',
    middle: 'rounded-[8px] active:rounded-[4px]',
    end: 'rounded-l-[8px] rounded-r-[28px] active:rounded-l-[4px]',
  },
}

function shape(value: Value, index: number) {
  if (value === props.selected) return shapeClasses[props.size].selected
  const position = index === 0 ? 'start' : index === props.options.length - 1 ? 'end' : 'middle'
  return shapeClasses[props.size][position]
}

function tabindex(index: number) {
  if (props.selection !== 'radio') return undefined
  return radioTabindex(
    props.options.map((option) => option.value),
    props.selected,
    index,
  )
}

function onKeydown(event: KeyboardEvent) {
  if (props.selection === 'radio') onRadioKeydown(event)
}
</script>

<!-- M3 Expressive connected button group. The `icon` slot draws before each label. -->
<template>
  <div
    :role="selection === 'radio' ? 'radiogroup' : 'group'"
    :aria-label="label"
    class="flex flex-wrap gap-0.5"
    @keydown="onKeydown"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      type="button"
      :role="selection === 'radio' ? 'radio' : undefined"
      :aria-checked="selection === 'radio' ? option.value === selected : undefined"
      :aria-pressed="selection === 'toggle' ? option.value === selected : undefined"
      :tabindex="tabindex(index)"
      class="state-layer focus-ring transition-morph inline-flex cursor-pointer items-center justify-center gap-2 font-semibold whitespace-nowrap select-none"
      :class="[
        sizeClasses[size],
        shape(option.value, index),
        option.value === selected
          ? 'bg-primary text-on-primary'
          : 'bg-surface-container-highest text-on-surface',
        fill && 'flex-1 basis-0 px-1! max-sm:gap-1',
      ]"
      @click="emit('select', option.value)"
    >
      <slot name="icon" :option="option" />
      {{ option.label }}
    </button>
  </div>
</template>
