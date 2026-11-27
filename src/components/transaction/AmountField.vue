<script setup lang="ts">
import { computed, ref, useId, useTemplateRef } from 'vue'
import IconAlert from '@/components/icons/IconAlert.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import RollingNumber from './RollingNumber.vue'
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

/** The roll that follows a quick amount; `id` restarts it on the next one. */
const roll = ref<{ id: number; from: string; to: string }>()
let rolls = 0

function onInput(event: Event) {
  const field = event.target as HTMLInputElement
  roll.value = undefined
  amount.value = Number(field.value.replace(/\D/g, '').slice(0, MAX_DIGITS))
  // Rewrite the field even when the value did not change, e.g. after a letter.
  field.value = amount.value ? formatDigits(amount.value) : ''
}

function add(value: number) {
  const from = amount.value
  const to = Math.min(from + value, largest)
  if (to === from) return
  amount.value = to
  roll.value = { id: ++rolls, from: formatDigits(from), to: formatDigits(to) }
}

/* Shared by the input and the roll drawn over it, so that their digits line up. */
const digitClasses =
  'font-display text-display-small font-bold tracking-[-1px] tabular-nums [font-kerning:none] sm:text-[48px] sm:leading-14'

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
        <span class="relative flex min-w-0 flex-1">
          <input
            ref="input"
            :value="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="0"
            :aria-labelledby="labelId"
            :aria-invalid="error ? true : undefined"
            :aria-describedby="error ? errorId : undefined"
            class="w-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-current placeholder:opacity-45"
            :class="[digitClasses, roll && 'text-transparent motion-reduce:text-inherit']"
            @input="onInput"
          />
          <RollingNumber
            v-if="roll"
            :key="roll.id"
            :from="roll.from"
            :to="roll.to"
            class="pointer-events-none absolute inset-x-0 top-0"
            :class="digitClasses"
            @done="roll = undefined"
          />
        </span>
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
      <OraButton
        v-for="quick in quickAmounts"
        :key="quick.value"
        variant="tonal"
        class="bg-surface-container-highest! text-on-surface!"
        @click="add(quick.value)"
      >
        {{ quick.label }}
      </OraButton>
    </div>
  </div>
</template>
