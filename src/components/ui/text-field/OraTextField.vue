<script setup lang="ts">
import { computed, useAttrs } from 'vue'

// Attributes such as `type`, `placeholder` and `autocomplete` belong on the <input>.
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  id: string
  label: string
  /** Hint below the field. An error message replaces it. */
  supportingText?: string
  /** Error message; a non-empty value marks the field as invalid. */
  error?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
}>()

const model = defineModel<string>({ required: true })
const attrs = useAttrs()
const errorId = computed(() => `${props.id}-error`)
const supportingId = computed(() => `${props.id}-supporting`)
const describedBy = computed(() => {
  if (props.error) return errorId.value
  return props.supportingText ? supportingId.value : undefined
})

/* Outline per state: 1px at rest and on hover, 3px (border plus inset ring) with focus. */
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
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-label-large" :class="{ 'text-on-surface/38': disabled }">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-body-small font-medium text-error"
        >*</span
      >
    </label>
    <div
      class="flex h-14 items-center gap-3 rounded-field border pl-4 text-on-surface [transition:border-color_var(--motion-fast-effects),box-shadow_var(--motion-fast-effects)]"
      :class="[stateClasses, $slots.trailing ? 'pr-2' : 'pr-4']"
    >
      <span
        class="flex flex-none [&>svg]:size-6"
        :class="error ? 'text-error' : !disabled && 'text-on-surface-variant'"
      >
        <slot name="icon" />
      </span>
      <input
        v-bind="attrs"
        :id="id"
        v-model="model"
        class="w-full min-w-0 flex-1 bg-transparent px-0.5 py-px text-body-large caret-primary outline-none placeholder:text-on-surface-variant disabled:placeholder:text-on-surface/38"
        :required="required"
        :readonly="readonly"
        :disabled="disabled"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
      />
      <slot name="trailing" />
    </div>
    <span v-if="error" :id="errorId" role="alert" class="text-body-small font-medium text-error">
      {{ error }}
    </span>
    <span
      v-else-if="supportingText"
      :id="supportingId"
      class="text-body-small text-on-surface-variant"
    >
      {{ supportingText }}
    </span>
  </div>
</template>
