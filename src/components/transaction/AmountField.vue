<script setup lang="ts">
import { computed, useId, useTemplateRef } from 'vue'
import IconAlert from '@/components/icons/IconAlert.vue'
import AppButton from '@/components/ui/AppButton.vue'
import type { TransactionType } from '@/data/newTransaction'
import { formatDigits } from '@/utils/rupiah'

defineProps<{
  type: TransactionType
  quickAmounts: { label: string; value: number }[]
  error?: string
}>()

/** Whole Rupiah; `0` leaves the field empty. */
const amount = defineModel<number>({ required: true })

const MAX_DIGITS = 12
const largest = 10 ** MAX_DIGITS - 1

const labelId = useId()
const errorId = useId()
const input = useTemplateRef('input')
const text = computed(() => (amount.value ? formatDigits(amount.value) : ''))

const tones: Record<TransactionType, { sign: string; classes: string }> = {
  expense: { sign: '−', classes: 'bg-error-container text-on-error-container' },
  income: { sign: '+', classes: 'bg-success-container text-on-success-container' },
  transfer: { sign: '', classes: 'bg-primary-container text-on-primary-container' },
}

function onInput(event: Event) {
  const field = event.target as HTMLInputElement
  amount.value = Number(field.value.replace(/\D/g, '').slice(0, MAX_DIGITS))
  // Rewrite the field even when the value did not change, e.g. after a letter.
  field.value = amount.value ? formatDigits(amount.value) : ''
}

function add(value: number) {
  amount.value = Math.min(amount.value + value, largest)
}

defineExpose({ focus: () => input.value?.focus({ preventScroll: true }) })
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <label
      class="flex cursor-text flex-col gap-1 rounded-corner-xl px-6 py-5 [transition:background-color_var(--motion-default-effects),box-shadow_var(--motion-fast-effects)]"
      :class="[
        tones[type].classes,
        error ? 'inset-ring-3 inset-ring-error' : 'inset-ring-primary focus-within:inset-ring-3',
      ]"
    >
      <span :id="labelId" class="text-[13px] leading-4.5 font-semibold">Amount</span>
      <span class="flex items-baseline gap-2.5">
        <span class="font-display text-headline-medium font-bold">{{ tones[type].sign }}Rp</span>
        <input
          ref="input"
          :value="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder="0"
          :aria-labelledby="labelId"
          :aria-invalid="error ? true : undefined"
          :aria-describedby="error ? errorId : undefined"
          class="w-full min-w-0 flex-1 bg-transparent font-display text-display-small font-bold tracking-[-1px] tabular-nums outline-none placeholder:text-current placeholder:opacity-45 sm:text-[48px] sm:leading-14"
          @input="onInput"
        />
      </span>
    </label>
    <span
      v-if="error"
      :id="errorId"
      role="alert"
      class="flex items-center gap-1.5 px-3 text-[13px] leading-4.5 font-semibold text-error"
    >
      <IconAlert class="size-4 flex-none" />
      {{ error }}
    </span>
    <div class="flex flex-wrap gap-2">
      <AppButton
        v-for="quick in quickAmounts"
        :key="quick.value"
        variant="tonal"
        class="bg-surface-container-highest! text-on-surface!"
        @click="add(quick.value)"
      >
        {{ quick.label }}
      </AppButton>
    </div>
  </div>
</template>
