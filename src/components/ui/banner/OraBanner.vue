<script setup lang="ts">
type Tone = 'success' | 'info' | 'warning' | 'error'

const { tone = 'info' } = defineProps<{ tone?: Tone }>()

const toneClasses: Record<Tone, string> = {
  success: 'bg-success-container text-on-success-container',
  info: 'bg-info-container text-on-info-container',
  warning: 'bg-warning-container text-on-warning-container',
  error: 'bg-error-container text-on-error-container',
}
</script>

<!--
  An inline status message, Uangku's own (M3 has no banner). Pass `role="status"` or `role="alert"`
  when it should be announced.
-->
<template>
  <div
    class="rounded-corner-lg-inc px-4.5 py-3.5 text-body-medium font-medium"
    :class="toneClasses[tone]"
  >
    <slot />
  </div>
</template>
