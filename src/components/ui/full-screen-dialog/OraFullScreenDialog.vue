<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'
import OraButton from '../button/OraButton.vue'
import OraIconButton from '../icon-button/OraIconButton.vue'
import { useModalFocus } from '../shared/useModalFocus'

defineProps<{
  title: string
  /** Label of the confirming button in the header. */
  action?: string
  actionDisabled?: boolean
}>()

const emit = defineEmits<{ close: []; action: [] }>()

const titleId = useId()
const root = useTemplateRef('root')
useModalFocus(root, () => emit('close'))
</script>

<!--
  M3 full-screen dialog, for `OraOverlay`: a task that needs the whole window, on narrow screens.
  The header closes it or confirms it; the default slot scrolls.
-->
<template>
  <div
    ref="root"
    class="fixed inset-0 z-50 [transition:translate_var(--motion-default-spatial),opacity_var(--motion-default-effects)] starting:translate-y-12 starting:opacity-0 sheet-leaving:translate-y-12 sheet-leaving:opacity-0"
  >
    <section
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      tabindex="-1"
      class="flex h-full flex-col bg-surface text-on-surface outline-none"
    >
      <header class="flex h-14 flex-none items-center gap-2 px-2">
        <OraIconButton label="Close" class="text-on-surface!" @click="emit('close')">
          <IconClose />
        </OraIconButton>
        <h2 :id="titleId" class="min-w-0 flex-1 truncate text-title-large font-medium">
          {{ title }}
        </h2>
        <OraButton v-if="action" variant="text" :disabled="actionDisabled" @click="emit('action')">
          {{ action }}
        </OraButton>
      </header>
      <div class="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <slot />
      </div>
    </section>
  </div>
</template>
