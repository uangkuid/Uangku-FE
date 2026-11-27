<script setup lang="ts">
// Attributes such as `placeholder` and `maxlength` belong on the <textarea>.
defineOptions({ inheritAttrs: false })

const { rows = 2 } = defineProps<{
  id: string
  label: string
  rows?: number
}>()

const model = defineModel<string>({ required: true })
</script>

<!-- A multi-line filled text field, with the label inside the Uangku container. -->
<template>
  <label
    class="flex flex-col gap-1.5 rounded-list-outer bg-surface-container-highest px-5 py-4 inset-ring-primary [transition:box-shadow_var(--motion-fast-effects)] focus-within:inset-ring-3"
  >
    <span :id="`${id}-label`" class="text-[13px] leading-4.5 font-semibold text-on-surface-variant">
      {{ label }}
    </span>
    <textarea
      v-bind="$attrs"
      :id="id"
      v-model="model"
      :rows="rows"
      :aria-labelledby="`${id}-label`"
      class="resize-none bg-transparent text-body-large text-on-surface caret-primary outline-none placeholder:text-on-surface-variant"
    ></textarea>
  </label>
</template>
