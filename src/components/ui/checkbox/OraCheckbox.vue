<script setup lang="ts">
import { onMounted, useAttrs, useTemplateRef, watch } from 'vue'

// Attributes such as `aria-label`, `id` and `name` belong on the <input>; `class` on the root.
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  /** Some, but not all, of what this box stands for is chosen. */
  indeterminate?: boolean
  error?: boolean
  disabled?: boolean
}>()

const checked = defineModel<boolean>({ required: true })
const attrs = useAttrs()
const input = useTemplateRef('input')

/* `indeterminate` is a property only, and a click clears it, so it is put back after each change. */
function sync() {
  if (input.value) input.value.indeterminate = Boolean(props.indeterminate)
}
onMounted(sync)
watch(() => [props.indeterminate, checked.value], sync, { flush: 'post' })
</script>

<!-- M3 checkbox. Name it with a surrounding <label>, `aria-label` or `aria-labelledby`. -->
<template>
  <span
    class="relative inline-flex size-10 flex-none items-center justify-center"
    :class="attrs.class"
  >
    <input
      v-bind="{ ...attrs, class: undefined }"
      ref="input"
      v-model="checked"
      type="checkbox"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      class="peer absolute -inset-1 z-10 m-0 cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-default"
    />
    <!-- State layer -->
    <span
      class="absolute inset-0 rounded-full opacity-0 [transition:opacity_var(--motion-fast-effects)] peer-hover:opacity-8 peer-focus-visible:opacity-10 peer-active:opacity-10 peer-disabled:hidden"
      :class="error ? 'bg-error' : checked || indeterminate ? 'bg-primary' : 'bg-on-surface'"
    ></span>
    <span
      class="pointer-events-none relative flex size-4.5 items-center justify-center rounded-[2px] border-2 outline-offset-2 outline-primary [transition:background-color_var(--motion-fast-effects),border-color_var(--motion-fast-effects)] peer-focus-visible:outline-3"
      :class="
        checked || indeterminate
          ? disabled
            ? 'border-transparent bg-on-surface/38 text-surface'
            : error
              ? 'border-error bg-error text-on-error'
              : 'border-primary bg-primary text-on-primary'
          : disabled
            ? 'border-on-surface/38'
            : error
              ? 'border-error'
              : 'border-on-surface-variant'
      "
    >
      <svg
        v-if="checked || indeterminate"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        class="size-4.5 flex-none"
        aria-hidden="true"
      >
        <path :d="indeterminate ? 'M4 9h10' : 'M3.5 9.4 7.2 13l7.3-7.6'" />
      </svg>
    </span>
  </span>
</template>
