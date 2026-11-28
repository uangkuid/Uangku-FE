<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'

// Attributes such as `type`, `placeholder` and `autocomplete` belong on the <input>.
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    /**
     * `stacked` is the Uangku field with its label above. `outlined` and `filled` are the M3 fields
     * whose label rests in the field and floats up on focus or input.
     */
    variant?: 'stacked' | 'outlined' | 'filled'
    /** Hint below the field. An error message replaces it. */
    supportingText?: string
    /** Error message; a non-empty value marks the field as invalid. */
    error?: string
    required?: boolean
    readonly?: boolean
    disabled?: boolean
  }>(),
  { variant: 'stacked', supportingText: undefined, error: undefined },
)

const model = defineModel<string>({ required: true })
const attrs = useAttrs()
const slots = useSlots()
const errorId = computed(() => `${props.id}-error`)
const supportingId = computed(() => `${props.id}-supporting`)
const describedBy = computed(() => {
  if (props.error) return errorId.value
  return props.supportingText ? supportingId.value : undefined
})

const focused = ref(false)
// These inputs always show their format, which a resting label would cover.
const formatted = ['date', 'time', 'datetime-local', 'month', 'week']
const floated = computed(
  () => focused.value || model.value !== '' || formatted.includes(String(attrs.type)),
)

/* Stacked outline per state: 1px at rest and on hover, 3px (border plus inset ring) with focus. */
const stateClasses = computed(() => {
  if (props.disabled) return 'border-on-surface/12 text-on-surface/38'
  if (props.error) {
    return 'border-error not-has-[input:focus]:hover:border-on-error-container has-[input:focus]:inset-ring-2 has-[input:focus]:inset-ring-error'
  }
  const focus =
    'has-[input:focus]:border-primary has-[input:focus]:inset-ring-2 has-[input:focus]:inset-ring-primary'
  return props.readonly
    ? `border-outline-variant bg-surface-container-highest ${focus}`
    : `border-outline not-has-[input:focus]:hover:border-on-surface ${focus}`
})

/** The outline of the floating `outlined` field, drawn on a fieldset so the label notches it. */
const outlineClasses = computed(() => {
  if (props.disabled) return 'border border-on-surface/12'
  if (props.error) {
    return focused.value ? 'border-3 border-error' : 'border border-error'
  }
  if (focused.value) return 'border-3 border-primary'
  return props.readonly
    ? 'border border-outline-variant'
    : 'border border-outline group-hover:border-on-surface'
})

/** The container and active indicator of the floating `filled` field. */
const filledClasses = computed(() => {
  const container = 'rounded-t-field border-b bg-surface-container-highest'
  if (props.disabled) return `${container} border-on-surface/38 bg-on-surface/4!`
  if (props.error) {
    return `${container} border-error ${focused.value ? 'shadow-[inset_0_-2px_0_var(--error)]' : ''}`
  }
  return focused.value
    ? `${container} border-primary shadow-[inset_0_-2px_0_var(--primary)]`
    : `${container} border-on-surface-variant`
})

const labelClasses = computed(() => {
  let position: string
  if (!floated.value) {
    position = `top-4 text-body-large ${slots.icon ? 'left-13' : 'left-4'}`
  } else if (props.variant === 'outlined') {
    position = '-top-2 left-5.5 text-body-small'
  } else {
    position = `top-2 text-body-small ${slots.icon ? 'left-13' : 'left-4'}`
  }
  let color = 'text-on-surface-variant'
  if (props.disabled) color = 'text-on-surface/38'
  else if (props.error) color = 'text-error'
  else if (focused.value) color = 'text-primary'
  return [position, color]
})
</script>

<template>
  <div class="flex flex-col" :class="variant === 'stacked' ? 'gap-2' : 'gap-1'">
    <label
      v-if="variant === 'stacked'"
      :for="id"
      class="text-label-large"
      :class="{ 'text-on-surface/38': disabled }"
    >
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-body-small font-medium text-error"
        >*</span
      >
    </label>
    <div
      class="relative flex h-14 items-center gap-3 text-on-surface"
      :class="[
        $slots.trailing ? 'pr-2' : 'pr-4',
        variant === 'stacked'
          ? [
              'rounded-field border pl-4 [transition:border-color_var(--motion-fast-effects),box-shadow_var(--motion-fast-effects)]',
              stateClasses,
            ]
          : [
              'group',
              $slots.icon ? 'pl-3' : 'pl-3.5',
              variant === 'filled' && [
                filledClasses,
                '[transition:border-color_var(--motion-fast-effects),box-shadow_var(--motion-fast-effects)]',
              ],
              disabled && 'text-on-surface/38',
            ],
      ]"
    >
      <fieldset
        v-if="variant === 'outlined'"
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 -top-2 bottom-0 m-0 min-w-0 rounded-field px-4 [transition:border-color_var(--motion-fast-effects)]"
        :class="outlineClasses"
      >
        <legend
          class="invisible h-4 overflow-hidden p-0 text-body-small whitespace-nowrap"
          :class="floated ? 'max-w-full px-1!' : 'max-w-0'"
        >
          {{ label }}{{ required ? ' *' : '' }}
        </legend>
      </fieldset>
      <span
        v-if="variant === 'stacked' || $slots.icon"
        class="flex flex-none [&>svg]:size-6"
        :class="error ? 'text-error' : !disabled && 'text-on-surface-variant'"
      >
        <slot name="icon" />
      </span>
      <input
        v-bind="attrs"
        :id="id"
        v-model="model"
        class="w-full min-w-0 flex-1 bg-transparent px-0.5 py-px text-body-large caret-primary outline-none disabled:placeholder:text-on-surface/38"
        :class="[
          variant === 'filled' && 'self-end pb-2',
          variant !== 'stacked' && !floated
            ? 'placeholder:text-transparent'
            : 'placeholder:text-on-surface-variant',
        ]"
        :required="required"
        :readonly="readonly"
        :disabled="disabled"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        @focus="focused = true"
        @blur="focused = false"
      />
      <!-- After the input in the DOM; positioned over the field. -->
      <label
        v-if="variant !== 'stacked'"
        :for="id"
        class="pointer-events-none absolute max-w-[calc(100%-32px)] truncate [transition:top_var(--motion-fast-spatial),left_var(--motion-fast-spatial),font-size_var(--motion-fast-spatial),color_var(--motion-fast-effects)]"
        :class="labelClasses"
      >
        {{ label }}<span v-if="required" aria-hidden="true"> *</span>
      </label>
      <slot name="trailing" />
    </div>
    <span
      v-if="error"
      :id="errorId"
      role="alert"
      class="text-body-small font-medium text-error"
      :class="variant !== 'stacked' && 'px-4'"
    >
      {{ error }}
    </span>
    <span
      v-else-if="supportingText"
      :id="supportingId"
      class="text-body-small text-on-surface-variant"
      :class="variant !== 'stacked' && 'px-4'"
    >
      {{ supportingText }}
    </span>
  </div>
</template>
