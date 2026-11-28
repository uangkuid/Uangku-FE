<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
  /** Error message; a non-empty value marks the field as invalid. */
  error?: string
  length?: number
}>()

const code = defineModel<string>({ required: true })

const id = useId()
const errorId = `${id}-error`
const size = computed(() => props.length ?? 6)
/** The box that the next digit fills. */
const active = computed(() => Math.min(code.value.length, size.value - 1))

function onInput(event: Event) {
  const field = event.target as HTMLInputElement
  code.value = field.value.replace(/\D/g, '').slice(0, size.value)
  // The field may hold characters that leave the code as it was, so it is rewritten too.
  field.value = code.value
}
</script>

<!--
  A one-time code drawn as one box per digit. A single invisible input lies over the boxes, so that
  typing, pasting and the browser's code autofill work as usual. The `label` slot names it.
-->
<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-label-large"><slot name="label" /></label>
    <div class="group relative grid grid-flow-col gap-2.5" :style="{ gridAutoColumns: '1fr' }">
      <span
        v-for="(_, index) in size"
        :key="index"
        aria-hidden="true"
        class="flex h-17 items-center justify-center border font-display text-headline-small font-bold tabular-nums [transition:border-radius_var(--motion-fast-spatial),background-color_var(--motion-default-effects),border-color_var(--motion-fast-effects)]"
        :class="[
          index < code.length
            ? 'rounded-corner-lg-inc border-transparent bg-secondary-container text-on-secondary-container'
            : ['rounded-field bg-surface', error ? 'border-error' : 'border-outline'],
          index === active &&
            'group-focus-within:border-primary group-focus-within:inset-ring-2 group-focus-within:inset-ring-primary',
        ]"
      >
        {{ code[index] }}
      </span>
      <input
        :id="id"
        :value="code"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        :maxlength="size"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? errorId : undefined"
        class="absolute inset-0 size-full cursor-text text-headline-small opacity-0"
        @input="onInput"
      />
    </div>
    <span v-if="error" :id="errorId" role="alert" class="text-body-small font-semibold text-error">
      {{ error }}
    </span>
  </div>
</template>
