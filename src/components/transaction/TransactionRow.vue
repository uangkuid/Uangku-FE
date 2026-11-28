<script setup lang="ts">
import type { Component } from 'vue'
import CategoryIcon from '@/components/ui/category-icon/CategoryIcon.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import OraListItem from '@/components/ui/list/OraListItem.vue'
import type { Category } from '@/data/home'
import { formatSignedRupiah } from '@/utils/rupiah'

// Listeners and attributes such as `to` belong on the row's action.
defineOptions({ inheritAttrs: false })

const { as = 'button' } = defineProps<{
  category: Category
  categoryName: string
  notes: string
  amount: number
  /** As it should read, e.g. `5 Jan 25`. */
  date: string
  wallet: string
  family?: boolean
  /** Hides the amount from onlookers. */
  masked?: boolean
  /** Its details are on screen. */
  selected?: boolean
  as?: string | Component
}>()
</script>

<!-- A transaction in an `OraList`: category, amount and notes, then the date and wallet. -->
<template>
  <OraListItem
    :as="as"
    v-bind="$attrs"
    :aria-haspopup="as === 'button' ? 'dialog' : undefined"
    :class="
      selected && 'rounded-corner-xl! bg-secondary-container! inset-ring-2 inset-ring-primary'
    "
  >
    <template #leading>
      <CategoryIcon :category="category" />
    </template>
    <template #headline>
      <span class="block text-body-large font-normal">{{ categoryName }}</span>
      <span
        class="block text-title-medium font-semibold whitespace-nowrap tabular-nums"
        :class="amount < 0 ? 'text-error' : 'text-success'"
      >
        {{ masked ? 'Rp ••••••' : formatSignedRupiah(amount) }}
      </span>
    </template>
    <template #supporting>{{ notes }}</template>
    <template #trailing>
      <span class="flex flex-wrap items-center gap-2.5 sm:flex-col sm:items-end">
        <span class="text-label-small font-semibold text-on-surface-variant">{{ date }}</span>
        <span class="inline-flex items-center gap-1.5">
          <FamilyIcon v-if="family" />
          <span
            class="inline-flex h-6 items-center rounded-corner-sm bg-secondary px-2.5 text-label-small font-semibold text-on-secondary"
          >
            {{ wallet }}
          </span>
        </span>
      </span>
    </template>
  </OraListItem>
</template>
