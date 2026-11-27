<script setup lang="ts">
import AppButton from './AppButton.vue'

defineProps<{
  /** Label of the action button. */
  action?: string
}>()

defineEmits<{ action: [] }>()
</script>

<!-- M3 snackbar. The caller positions it and decides when it leaves; `icon` leads the message. -->
<template>
  <div
    role="status"
    class="flex items-center gap-3 rounded-corner-lg-inc bg-inverse-surface py-2 pr-4 pl-5 text-inverse-on-surface shadow-elevation-3"
  >
    <span v-if="$slots.icon" class="flex flex-none text-inverse-primary [&>svg]:size-5">
      <slot name="icon" />
    </span>
    <span class="min-w-0 flex-1 py-1.5 text-body-medium"><slot /></span>
    <AppButton
      v-if="action"
      variant="text"
      class="font-bold text-inverse-primary!"
      @click="$emit('action')"
    >
      {{ action }}
    </AppButton>
  </div>
</template>
