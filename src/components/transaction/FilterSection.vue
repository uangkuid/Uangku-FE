<script setup lang="ts">
import { useId } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'

defineProps<{
  title: string
  /** What the group is set to; empty while it restricts nothing. */
  summary: string
  /** Said instead of an empty summary. */
  placeholder: string
}>()

const open = defineModel<boolean>('open', { required: true })
const panelId = useId()
</script>

<!-- One collapsible group of the transaction filter. -->
<template>
  <section class="flex-none rounded-list-outer bg-surface-container-lowest">
    <h3>
      <button
        type="button"
        class="state-layer focus-ring flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-list-outer py-2.5 pr-3 pl-5 text-left"
        :aria-expanded="open"
        :aria-controls="open ? panelId : undefined"
        @click="open = !open"
      >
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span class="text-title-medium font-semibold">{{ title }}</span>
          <span
            class="truncate text-body-small"
            :class="summary ? 'text-primary' : 'text-on-surface-variant'"
          >
            {{ summary || placeholder }}
          </span>
        </span>
        <span class="flex size-10 flex-none items-center justify-center text-on-surface-variant">
          <IconChevronDown
            class="size-5.5 [transition:rotate_var(--motion-fast-spatial)]"
            :class="open && 'rotate-180'"
          />
        </span>
      </button>
    </h3>
    <div v-if="open" :id="panelId" class="px-3 pb-4">
      <slot />
    </div>
  </section>
</template>
