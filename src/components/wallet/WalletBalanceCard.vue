<script setup lang="ts">
import IconEye from '@/components/icons/IconEye.vue'
import ShapeBurst from '@/components/shapes/ShapeBurst.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import { formatRupiah, formatSignedRupiah } from '@/utils/rupiah'

defineProps<{
  balance: number
  income: number
  spending: number
}>()

/** Hides the amounts from onlookers. */
const hidden = defineModel<boolean>('hidden', { required: true })
</script>

<template>
  <section
    aria-label="Balance"
    class="relative flex flex-wrap items-end gap-6 overflow-hidden rounded-card bg-primary-container px-8 py-7 text-on-primary-container"
  >
    <ShapeBurst class="absolute -top-22.5 -right-15 size-65 text-inverse-primary opacity-45" />
    <div class="relative flex flex-[1_1_280px] flex-col gap-1">
      <span class="text-title-small font-semibold">Balance</span>
      <div class="flex flex-wrap items-center gap-3">
        <span
          class="font-display text-headline-large font-bold tracking-[-0.5px] tabular-nums sm:text-display-medium sm:font-bold"
        >
          {{ hidden ? 'Rp ••••••' : formatRupiah(balance) }}
        </span>
        <OraIconButton
          :label="hidden ? 'Show balance' : 'Hide balance'"
          :selected="hidden"
          class="bg-on-primary-container/10 text-on-primary-container!"
          @click="hidden = !hidden"
        >
          <IconEye :off="hidden" />
        </OraIconButton>
      </div>
    </div>
    <dl class="relative flex flex-wrap gap-2 text-on-surface">
      <div
        class="flex min-w-38 flex-col gap-0.5 rounded-corner-lg-inc bg-surface-container-lowest px-4 py-3"
      >
        <dt class="text-label-medium text-on-surface-variant">In this month</dt>
        <dd class="text-title-medium font-semibold text-success tabular-nums">
          {{ hidden ? '••••••' : formatSignedRupiah(income) }}
        </dd>
      </div>
      <div
        class="flex min-w-38 flex-col gap-0.5 rounded-corner-md bg-surface-container-lowest px-4 py-3"
      >
        <dt class="text-label-medium text-on-surface-variant">Out this month</dt>
        <dd class="text-title-medium font-semibold text-error tabular-nums">
          {{ hidden ? '••••••' : formatSignedRupiah(-spending) }}
        </dd>
      </div>
    </dl>
  </section>
</template>
