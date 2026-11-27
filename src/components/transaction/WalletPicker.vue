<script setup lang="ts">
import { computed, useId } from 'vue'
import IconFamily from '@/components/icons/IconFamily.vue'
import OraChip from '@/components/ui/chip/OraChip.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import type { Wallet } from '@/data/home'

const props = defineProps<{
  label: string
  wallets: Pick<Wallet, 'name' | 'family'>[]
  /** Warns who else will see the transaction when a family wallet is picked. */
  familyName?: string
}>()

/** Name of the picked wallet. */
const picked = defineModel<string>({ required: true })

const labelId = useId()
const shared = computed(() =>
  props.wallets.some((wallet) => wallet.name === picked.value && wallet.family),
)
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <span :id="labelId" class="text-title-small font-semibold">{{ label }}</span>
    <div role="group" :aria-labelledby="labelId" class="flex flex-wrap gap-2">
      <OraChip
        v-for="wallet in wallets"
        :key="wallet.name"
        :selected="wallet.name === picked"
        @click="picked = wallet.name"
      >
        {{ wallet.name }}
        <FamilyIcon v-if="wallet.family" />
      </OraChip>
    </div>
    <span
      v-if="familyName && shared"
      class="flex items-center gap-2 rounded-corner-lg bg-tertiary-container px-3.5 py-2.5 text-body-small font-medium text-on-tertiary-container"
    >
      <IconFamily class="size-4 flex-none" stroke-width="2" />
      Family wallet — {{ familyName }} members will see this transaction.
    </span>
  </div>
</template>
