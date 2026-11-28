<script setup lang="ts">
import { RouterLink } from 'vue-router'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import CategoryIcon from '@/components/ui/category-icon/CategoryIcon.vue'
import OraList from '@/components/ui/list/OraList.vue'
import OraListItem from '@/components/ui/list/OraListItem.vue'
import type { MemberKey, WalletTransaction } from '@/data/wallets'
import { formatSignedRupiah } from '@/utils/rupiah'

defineProps<{
  transactions: WalletTransaction[]
  /** Says who recorded each one, as family wallets do. */
  showAuthor?: boolean
  hidden?: boolean
}>()

const authors: Record<MemberKey, { name: string; color: string }> = {
  O: { name: 'Orata', color: 'bg-primary text-on-primary' },
  A: { name: 'Ayu', color: 'bg-tertiary text-on-tertiary' },
  R: { name: 'Raka', color: 'bg-success text-on-success' },
}
</script>

<template>
  <OraCard class="gap-4 px-4 pt-6 pb-4" aria-labelledby="last-title">
    <div class="flex items-start justify-between gap-3 px-2">
      <div class="flex flex-col gap-1">
        <h2 id="last-title" class="text-title-large font-semibold">Last Transactions</h2>
        <p class="text-body-medium text-on-surface-variant">
          Your most recent transactions this month.
        </p>
      </div>
      <OraButton :as="RouterLink" :to="{ name: 'transactions' }" variant="tonal">
        See all
      </OraButton>
    </div>

    <OraList v-if="transactions.length">
      <OraListItem v-for="(transaction, index) in transactions" :key="index">
        <template #leading>
          <CategoryIcon :category="transaction.category" />
        </template>
        <template #headline>{{ transaction.categoryName }}</template>
        <template #supporting>
          <span
            v-if="showAuthor"
            role="img"
            :aria-label="`Added by ${authors[transaction.by].name}`"
            class="inline-flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold"
            :class="authors[transaction.by].color"
          >
            {{ transaction.by }}
          </span>
          {{ transaction.notes }}
        </template>
        <template #trailing>
          <span class="flex flex-col gap-0.5">
            <span
              class="text-title-medium font-semibold whitespace-nowrap tabular-nums"
              :class="transaction.amount < 0 ? 'text-error' : 'text-success'"
            >
              {{ hidden ? 'Rp ••••' : formatSignedRupiah(transaction.amount) }}
            </span>
            <span class="text-label-small text-on-surface-variant">{{ transaction.date }}</span>
          </span>
        </template>
      </OraListItem>
    </OraList>
    <p
      v-else
      class="rounded-list-outer bg-surface-container-lowest p-7 text-center text-body-medium text-on-surface-variant"
    >
      No transactions in this wallet yet.
    </p>
  </OraCard>
</template>
