<script setup lang="ts">
import { computed, useAttrs } from 'vue'

// Attributes such as `type`, `placeholder` and `autocomplete` belong on the <input>.
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  id: string
  label: string
  /** Error message; a non-empty value marks the field as invalid. */
  error?: string
  required?: boolean
  readonly?: boolean
}>()

const model = defineModel<string>({ required: true })
const attrs = useAttrs()
const errorId = computed(() => `${props.id}-error`)

const borderClasses = computed(() => {
  if (props.error) return 'border-error inset-ring inset-ring-error'
  return props.readonly ? 'border-outline-variant' : 'border-outline'
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-label-large">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-body-small font-medium text-error"
        >*</span
      >
    </label>
    <div
      class="flex h-14 items-center gap-3 rounded-14 border pl-4 text-on-surface transition-[box-shadow,border-color] duration-150 has-[input:focus]:border-primary has-[input:focus]:inset-ring has-[input:focus]:inset-ring-primary"
      :class="[
        borderClasses,
        readonly ? 'bg-surface-container-highest' : 'bg-surface',
        $slots.trailing ? 'pr-1' : 'pr-4',
      ]"
    >
      <span class="flex flex-none" :class="error ? 'text-error' : 'text-on-surface-variant'">
        <slot name="icon" />
      </span>
      <input
        v-bind="attrs"
        :id="id"
        v-model="model"
        class="w-full min-w-0 flex-1 bg-transparent px-0.5 py-px text-body-large outline-none placeholder:text-on-surface-variant"
        :required="required"
        :readonly="readonly"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? errorId : undefined"
      />
      <slot name="trailing" />
    </div>
    <span v-if="error" :id="errorId" role="alert" class="text-body-small font-medium text-error">
      {{ error }}
    </span>
  </div>
</template>
