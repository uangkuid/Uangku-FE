<script setup lang="ts">
import { computed } from 'vue'
import IconWallet from '@/components/icons/IconWallet.vue'
import ShapeScallop from '@/components/shapes/ShapeScallop.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import OraSleepingIcon from '@/components/ui/sleeping-icon/OraSleepingIcon.vue'
import { formatRupiah } from '@/utils/rupiah'

const props = defineProps<{
  name: string
  balance: number
  family: boolean
  sleeping?: boolean
}>()

const status = computed(() => {
  if (props.sleeping) return 'Asleep'
  return props.family ? 'Family wallet' : 'Personal wallet'
})
</script>

<!-- How the wallet in a form is going to look. Decorative: the fields say the same. -->
<template>
  <div
    aria-hidden="true"
    class="relative flex min-h-33 flex-none flex-col justify-between gap-5 overflow-hidden rounded-corner-xl p-5 [transition:background-color_var(--motion-slow-effects),color_var(--motion-slow-effects)]"
    :class="
      sleeping
        ? 'bg-surface-container-highest text-on-surface-variant'
        : family
          ? 'bg-tertiary-container text-on-tertiary-container'
          : 'bg-primary-container text-on-primary-container'
    "
  >
    <ShapeScallop class="absolute -top-17.5 -right-15 size-50 opacity-22" />
    <span class="relative flex min-w-0 items-center gap-2.5">
      <span
        class="flex size-9 flex-none items-center justify-center rounded-corner-md bg-current/14"
      >
        <IconWallet class="size-5" />
      </span>
      <span class="truncate text-title-small font-semibold" :class="!name && 'opacity-60'">
        {{ name || 'Wallet name' }}
      </span>
      <FamilyIcon v-if="family" />
      <OraSleepingIcon v-if="sleeping" />
    </span>
    <span class="relative flex items-baseline justify-between gap-3">
      <span class="font-display text-headline-small font-bold tabular-nums">
        {{ formatRupiah(balance) }}
      </span>
      <span class="text-label-medium font-semibold">{{ status }}</span>
    </span>
  </div>
</template>
