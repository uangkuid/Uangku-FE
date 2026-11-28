<script setup lang="ts" generic="Value extends string | number">
import { useAttrs } from 'vue'

// Attributes such as `aria-label` and `id` belong on the <input>; `class` on the root.
defineOptions({ inheritAttrs: false })

defineProps<{
  /** What `v-model` becomes when this button is chosen. */
  value: Value
  /** Shared by the buttons of one group, which then moves between them with the arrow keys. */
  name: string
  disabled?: boolean
}>()

const selected = defineModel<Value>({ required: true })
const attrs = useAttrs()
</script>

<!--
  M3 radio button. Name it with a surrounding <label> or `aria-label`, and put a group in an element
  with `role="radiogroup"` or a <fieldset>.
-->
<template>
  <span
    class="relative inline-flex size-10 flex-none items-center justify-center"
    :class="attrs.class"
  >
    <input
      v-bind="{ ...attrs, class: undefined }"
      v-model="selected"
      type="radio"
      :name="name"
      :value="value"
      :disabled="disabled"
      class="peer absolute -inset-1 z-10 m-0 cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-default"
    />
    <!-- State layer -->
    <span
      class="absolute inset-0 rounded-full opacity-0 [transition:opacity_var(--motion-fast-effects)] peer-hover:opacity-8 peer-focus-visible:opacity-10 peer-active:opacity-10 peer-disabled:hidden"
      :class="selected === value ? 'bg-primary' : 'bg-on-surface'"
    ></span>
    <span
      class="pointer-events-none relative flex size-5 items-center justify-center rounded-full border-2 outline-offset-2 outline-primary [transition:border-color_var(--motion-fast-effects)] peer-focus-visible:outline-3"
      :class="
        disabled
          ? 'border-on-surface/38 text-on-surface/38'
          : selected === value
            ? 'border-primary text-primary'
            : 'border-on-surface-variant'
      "
    >
      <span
        class="size-2.5 rounded-full bg-current [transition:scale_var(--motion-fast-spatial)]"
        :class="selected === value ? 'scale-100' : 'scale-0'"
      ></span>
    </span>
  </span>
</template>
