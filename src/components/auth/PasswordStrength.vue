<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ password: string }>()

const levels = [
  { label: 'Too weak', bar: 'bg-error', text: 'text-error' },
  { label: 'Weak', bar: 'bg-error', text: 'text-error' },
  { label: 'Fair', bar: 'bg-warning', text: 'text-warning' },
  { label: 'Good', bar: 'bg-primary', text: 'text-primary' },
  { label: 'Strong', bar: 'bg-success', text: 'text-success' },
]

const traits = computed(() => ({
  long: props.password.length >= 8,
  mixed: /[a-z]/.test(props.password) && /[A-Z]/.test(props.password),
  digit: /\d/.test(props.password),
  symbol: /[^A-Za-z0-9]/.test(props.password) && props.password.length >= 10,
}))

/** 0 to 4; a short password never scores more than 1. */
const score = computed(() => {
  const met = Object.values(traits.value).filter(Boolean).length
  return traits.value.long ? met : Math.min(met, 1)
})
const level = computed(() => levels[score.value]!)

const hint = computed(() => {
  if (!traits.value.long) return 'use at least 8 characters'
  if (!traits.value.mixed) return 'mix upper and lower case'
  if (!traits.value.digit) return 'add a number'
  return score.value < 4 ? 'add a symbol and make it 10+ characters' : 'nice, this is hard to guess'
})
</script>

<!-- How hard the password is to guess, and what would make it harder. -->
<template>
  <div class="flex flex-col gap-1.5 px-1 pt-0.5">
    <div aria-hidden="true" class="flex gap-1">
      <span
        v-for="step in 4"
        :key="step"
        class="h-1.5 flex-1 [transition:background-color_var(--motion-default-effects),border-radius_var(--motion-fast-spatial)]"
        :class="[
          step <= Math.max(score, 1) ? level.bar : 'bg-surface-container-highest',
          step <= score ? 'rounded-[3px]' : 'rounded-[6px]',
        ]"
      ></span>
    </div>
    <span class="text-body-small text-on-surface-variant" aria-live="polite">
      Strength: <strong class="font-semibold" :class="level.text">{{ level.label }}</strong> ·
      {{ hint }}
    </span>
  </div>
</template>
