<script setup lang="ts">
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraList from '@/components/ui/list/OraList.vue'
import OraListItem from '@/components/ui/list/OraListItem.vue'
import OraTag from '@/components/ui/tag/OraTag.vue'
import CategoryIcon from '@/components/ui/category-icon/CategoryIcon.vue'
import ComingSoonLink from '@/components/ui/coming-soon-link/ComingSoonLink.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import type { Transaction } from '@/data/home'
import { formatSignedRupiah } from '@/utils/rupiah'

defineProps<{ transactions: Transaction[] }>()
</script>

<template>
  <OraCard class="gap-3.5 px-2 pt-6 pb-2 sm:px-4 sm:pb-4" aria-labelledby="recent-title">
    <div class="flex flex-wrap items-center justify-between gap-3 px-2">
      <h2 id="recent-title" class="text-title-large font-medium">Recent transactions</h2>
      <OraButton :as="ComingSoonLink" variant="tonal">
        View all
        <IconChevronRight />
      </OraButton>
    </div>

    <OraList>
      <OraListItem v-for="(transaction, index) in transactions" :key="index" :as="ComingSoonLink">
        <template #leading>
          <CategoryIcon :category="transaction.category" />
        </template>
        <template #headline>{{ transaction.categoryName }}</template>
        <template #supporting>
          <span>{{ transaction.notes }} · {{ transaction.date }}</span>
          <OraTag>{{ transaction.wallet }}</OraTag>
          <FamilyIcon v-if="transaction.family" />
        </template>
        <template #trailing>
          <span
            class="text-[16px] leading-6 font-bold whitespace-nowrap tabular-nums"
            :class="transaction.amount < 0 ? 'text-error' : 'text-success'"
          >
            {{ formatSignedRupiah(transaction.amount) }}
          </span>
        </template>
      </OraListItem>
    </OraList>
  </OraCard>
</template>
