<script setup lang="ts">
import IconCheck from '@/components/icons/IconCheck.vue'
import IconClose from '@/components/icons/IconClose.vue'

defineProps<{ disabled?: boolean }>()

const checked = defineModel<boolean>({ required: true })
</script>

<!--
  M3 switch with icons in its thumb. Name it with `aria-labelledby`, and add `aria-describedby` for
  a hint.
-->
<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    :disabled="disabled"
    class="group focus-ring touch-target relative inline-flex h-8 w-13 flex-none cursor-pointer items-center rounded-full border-2 [transition:background-color_var(--motion-default-effects),border-color_var(--motion-default-effects)] disabled:cursor-not-allowed"
    :class="
      disabled
        ? checked
          ? 'border-transparent bg-on-surface/12'
          : 'border-on-surface/12 bg-surface-container-highest/12'
        : checked
          ? 'border-primary bg-primary'
          : 'border-outline bg-surface-container-highest'
    "
    @click="checked = !checked"
  >
    <span
      class="pointer-events-none absolute top-1/2 flex -translate-1/2 items-center justify-center rounded-full [transition:left_var(--motion-fast-spatial),width_var(--motion-fast-spatial),height_var(--motion-fast-spatial),background-color_var(--motion-default-effects)] after:absolute after:-inset-2 after:rounded-full after:bg-current after:opacity-0 group-enabled:group-hover:after:opacity-8 group-focus-visible:after:opacity-10 group-enabled:group-active:size-7"
      :class="[
        checked ? 'left-[calc(100%-14px)] size-6' : 'left-3.5 size-4',
        disabled
          ? checked
            ? 'bg-surface text-on-surface/38'
            : 'bg-on-surface/38 text-surface-container-highest'
          : checked
            ? 'bg-on-primary text-on-primary-container'
            : 'bg-outline text-surface-container-highest',
      ]"
    >
      <IconCheck v-if="checked" class="size-4" stroke-width="3" />
      <IconClose v-else class="size-3" stroke-width="3" />
    </span>
  </button>
</template>
