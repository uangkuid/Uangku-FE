<script setup lang="ts">
import { computed, type Component } from 'vue'

// Listeners and attributes such as `to` belong on the item's content, not on the <li>.
defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<{
  /** A `div` is static. Pass `button`, `RouterLink` or `ComingSoonLink` for an action. */
  as?: string | Component
}>()

const interactive = computed(() => as !== 'div')
</script>

<!--
  Slots: `leading` (icon or avatar), `headline`, `supporting` and `trailing`. On narrow screens the
  trailing slot moves below the text.
-->
<template>
  <li class="group flex flex-col">
    <component
      :is="as"
      :type="as === 'button' ? 'button' : undefined"
      v-bind="$attrs"
      class="transition-morph grid min-h-18 items-center gap-x-3 gap-y-1 rounded-list-inner bg-surface-container-lowest px-3 py-3.5 text-left group-first:rounded-t-list-outer group-last:rounded-b-list-outer sm:gap-x-4 sm:px-4.5"
      :class="[
        $slots.leading
          ? 'grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto]'
          : 'grid-cols-[minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_auto]',
        interactive && 'state-layer focus-ring cursor-pointer active:rounded-list-outer',
      ]"
    >
      <slot name="leading" />
      <span class="flex min-w-0 flex-col gap-0.5">
        <span class="text-[15px] leading-5.5 font-semibold">
          <slot name="headline" />
        </span>
        <span
          v-if="$slots.supporting"
          class="flex flex-wrap items-center gap-1.5 text-[12px] leading-4.5 text-on-surface-variant"
        >
          <slot name="supporting" />
        </span>
      </span>
      <span
        v-if="$slots.trailing"
        class="sm:col-start-auto sm:text-right"
        :class="{ 'col-start-2': $slots.leading }"
      >
        <slot name="trailing" />
      </span>
    </component>
  </li>
</template>
