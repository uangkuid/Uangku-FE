<script setup lang="ts">
import { useId } from 'vue'
import IconWallet from '@/components/icons/IconWallet.vue'
import OraTextField from '@/components/ui/text-field/OraTextField.vue'
import { WALLET_NAME_LIMIT } from '@/stores/wallets'

defineProps<{ error?: string }>()

const name = defineModel<string>({ required: true })
const id = useId()
</script>

<template>
  <div class="relative flex flex-col">
    <OraTextField
      :id="id"
      v-model="name"
      label="Name"
      type="text"
      autocomplete="off"
      placeholder="e.g. Bank BCA, Cash, Dana"
      required
      data-autofocus
      :maxlength="WALLET_NAME_LIMIT"
      :error="error"
      supporting-text="Use a name you’ll recognise, like the bank or app."
    >
      <template #icon><IconWallet /></template>
    </OraTextField>
    <span
      aria-hidden="true"
      class="self-end pt-1 text-body-small text-on-surface-variant tabular-nums"
    >
      {{ name.length }}/{{ WALLET_NAME_LIMIT }}
    </span>
  </div>
</template>
