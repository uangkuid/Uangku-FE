<script setup lang="ts">
import IconSearch from '@/components/icons/IconSearch.vue'

type Variant = 'outlined' | 'filled'

// Attributes such as `placeholder` belong on the <input>.
defineOptions({ inheritAttrs: false })

const { variant = 'outlined' } = defineProps<{
  /** Accessible name; the field shows only its placeholder. */
  label: string
  variant?: Variant
}>()

const model = defineModel<string>({ required: true })

const variantClasses: Record<Variant, string> = {
  outlined:
    'rounded-corner-lg border border-outline bg-surface px-4 text-on-surface has-[input:focus]:border-primary has-[input:focus]:inset-ring-2 has-[input:focus]:inset-ring-primary',
  filled:
    'rounded-[28px] bg-surface-container-high px-5 text-on-surface-variant has-[input:focus]:inset-ring-2 has-[input:focus]:inset-ring-primary',
}
</script>

<!-- A search input, outlined like the text fields or filled like an M3 search bar. -->
<template>
  <label
    class="flex h-14 items-center gap-3 [transition:border-color_var(--motion-fast-effects),box-shadow_var(--motion-fast-effects)]"
    :class="[variantClasses[variant], $attrs.class]"
  >
    <IconSearch class="size-6 flex-none" />
    <span class="sr-only">{{ label }}</span>
    <input
      v-bind="{ ...$attrs, class: undefined }"
      v-model="model"
      type="search"
      class="w-full min-w-0 flex-1 bg-transparent text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
    />
  </label>
</template>
