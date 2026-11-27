<script setup lang="ts">
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraLinearProgress from '@/components/ui/linear-progress/OraLinearProgress.vue'
import CategoryIcon from '@/components/ui/category-icon/CategoryIcon.vue'
import ComingSoonLink from '@/components/ui/coming-soon-link/ComingSoonLink.vue'
import type { SpendingCategory } from '@/data/home'
import { formatRupiah } from '@/utils/rupiah'

/** Sorted from the largest share to the smallest. */
defineProps<{ categories: SpendingCategory[] }>()

const BAR_COLORS = ['bg-primary', 'bg-logo-blue', 'bg-tertiary']
</script>

<template>
  <OraCard variant="outlined" class="gap-4.5 p-5 sm:p-6" aria-labelledby="top-title">
    <div class="flex flex-col gap-1">
      <h2 id="top-title" class="text-title-large font-medium">Where it went</h2>
      <p class="text-body-medium text-on-surface-variant">Top spending this month.</p>
    </div>

    <ul class="flex flex-col gap-4">
      <li v-for="(item, index) in categories" :key="item.category" class="flex flex-col gap-2">
        <div class="flex items-center gap-2.5">
          <CategoryIcon :category="item.category" />
          <span class="min-w-0 flex-1 text-[14px] leading-5 font-semibold">{{ item.name }}</span>
          <span class="text-[14px] leading-5 font-bold tabular-nums">
            {{ formatRupiah(item.amount) }}
          </span>
        </div>
        <div class="flex items-center gap-2.5">
          <OraLinearProgress
            class="flex-1"
            :value="item.percent"
            :label="`${item.name} share of spending`"
            :thickness="12"
            :indicator-class="BAR_COLORS[index % BAR_COLORS.length]"
            track-class="bg-surface-container-high"
          />
          <span class="w-9 text-right text-[12px] font-semibold text-on-surface-variant">
            {{ item.percent }}%
          </span>
        </div>
      </li>
    </ul>

    <OraButton :as="ComingSoonLink" class="self-start">
      Open report
      <IconChevronRight />
    </OraButton>
  </OraCard>
</template>
