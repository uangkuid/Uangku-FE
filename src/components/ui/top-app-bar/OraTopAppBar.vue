<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    /** `medium` and `large` are the flexible bars, with the title under the buttons. */
    size?: 'small' | 'medium' | 'large'
    centered?: boolean
    /** Content has scrolled under the bar: it takes a container color and collapses to small. */
    scrolled?: boolean
    headingTag?: 'h1' | 'h2' | 'h3'
  }>(),
  { subtitle: undefined, size: 'small', headingTag: 'h1' },
)

const expanded = computed(() => props.size !== 'small' && !props.scrolled)
</script>

<!--
  M3 Expressive top app bar. The `leading` slot takes the navigation button and `actions` the
  trailing ones. The caller makes it sticky and tells it when content has scrolled.
-->
<template>
  <header
    class="flex w-full flex-col text-on-surface [transition:background-color_var(--motion-default-effects)]"
    :class="scrolled ? 'bg-surface-container' : 'bg-surface'"
  >
    <div class="flex h-16 items-center gap-1 px-1">
      <div v-if="$slots.leading" class="flex min-w-12 flex-none justify-center">
        <slot name="leading" />
      </div>
      <div
        class="flex min-w-0 flex-1 flex-col px-3"
        :class="centered && 'items-center text-center'"
      >
        <template v-if="!expanded">
          <component :is="headingTag" class="max-w-full truncate text-title-large font-medium">
            {{ title }}
          </component>
          <span
            v-if="subtitle"
            class="max-w-full truncate text-label-medium text-on-surface-variant"
          >
            {{ subtitle }}
          </span>
        </template>
      </div>
      <div class="flex min-w-12 flex-none items-center justify-end">
        <slot name="actions" />
      </div>
    </div>
    <div
      v-if="expanded"
      class="flex flex-col gap-1 px-4 pb-4"
      :class="[size === 'large' ? 'pt-5' : 'pt-1', centered && 'items-center text-center']"
    >
      <component
        :is="headingTag"
        class="font-display font-bold"
        :class="size === 'large' ? 'text-display-small' : 'text-headline-medium'"
      >
        {{ title }}
      </component>
      <span
        v-if="subtitle"
        class="text-on-surface-variant"
        :class="size === 'large' ? 'text-title-medium' : 'text-label-large'"
      >
        {{ subtitle }}
      </span>
    </div>
  </header>
</template>
