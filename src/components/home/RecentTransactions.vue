<script setup lang="ts">
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppList from '@/components/ui/AppList.vue'
import AppListItem from '@/components/ui/AppListItem.vue'
import AppTag from '@/components/ui/AppTag.vue'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'
import ComingSoonLink from '@/components/ui/ComingSoonLink.vue'
import FamilyIcon from '@/components/ui/FamilyIcon.vue'
import type { Transaction } from '@/data/home'
import { formatSignedRupiah } from '@/utils/rupiah'

defineProps<{ transactions: Transaction[] }>()
</script>

<template>
  <AppCard class="gap-3.5 px-2 pt-6 pb-2 sm:px-4 sm:pb-4" aria-labelledby="recent-title">
    <div class="flex flex-wrap items-center justify-between gap-3 px-2">
      <h2 id="recent-title" class="text-title-large font-medium">Recent transactions</h2>
      <AppButton :as="ComingSoonLink" variant="tonal">
        View all
        <IconChevronRight />
      </AppButton>
    </div>

    <AppList>
      <AppListItem v-for="(transaction, index) in transactions" :key="index" :as="ComingSoonLink">
        <template #leading>
          <CategoryIcon :category="transaction.category" />
        </template>
        <template #headline>{{ transaction.categoryName }}</template>
        <template #supporting>
          <span>{{ transaction.notes }} · {{ transaction.date }}</span>
          <AppTag>{{ transaction.wallet }}</AppTag>
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
      </AppListItem>
    </AppList>
  </AppCard>
</template>
