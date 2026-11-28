<script setup lang="ts">
import { RouterLink } from 'vue-router'
import OraCard from '@/components/ui/card/OraCard.vue'
import CategoryIcon from '@/components/ui/category-icon/CategoryIcon.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import { reportData } from '@/data/report'
import { formatRupiah } from '@/utils/rupiah'
</script>

<template>
  <OraCard variant="outlined" class="gap-2 px-4 pt-6 pb-4" aria-labelledby="biggest-title">
    <h2 id="biggest-title" class="px-2 pb-2 text-title-medium font-semibold">Biggest expenses</h2>
    <ol class="flex flex-col gap-0.5">
      <li v-for="(item, index) in reportData.biggest" :key="item.title">
        <RouterLink
          :to="{ name: 'transactions' }"
          class="state-layer focus-ring grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-corner-lg px-2 py-3"
        >
          <span
            class="flex size-6 items-center justify-center rounded-corner-sm text-body-small font-bold"
            :class="index === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-high'"
          >
            {{ index + 1 }}
          </span>
          <CategoryIcon :category="item.category" />
          <span class="flex min-w-0 flex-col gap-0.5">
            <span class="text-[14px] leading-5 font-medium">{{ item.title }}</span>
            <span class="flex items-center gap-1.5 text-body-small text-on-surface-variant">
              {{ item.meta }}
              <FamilyIcon v-if="item.family" />
            </span>
          </span>
          <span
            class="text-[14px] leading-5 font-semibold whitespace-nowrap text-error tabular-nums"
          >
            {{ formatRupiah(item.amount) }}
          </span>
        </RouterLink>
      </li>
    </ol>
  </OraCard>
</template>
