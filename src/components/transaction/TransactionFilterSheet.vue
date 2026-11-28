<script setup lang="ts">
import { computed, reactive } from 'vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import DateRangeFilter from '@/components/transaction/DateRangeFilter.vue'
import FilterChecklist from '@/components/transaction/FilterChecklist.vue'
import FilterSection from '@/components/transaction/FilterSection.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraModalSheet from '@/components/ui/sheet/OraModalSheet.vue'
import { newTransactionData } from '@/data/newTransaction'
import { filterCategories } from '@/data/transactions'
import {
  describeSelection,
  filterTypes,
  formatDateRange,
  noFilters,
  useTransactionFiltersStore,
  type TransactionFilters,
} from '@/stores/transactionFilters'

const emit = defineEmits<{
  close: []
  search: [filters: TransactionFilters]
}>()

const store = useTransactionFiltersStore()

/** Edited here and applied only by "Search". */
const draft = reactive<TransactionFilters>({
  ...store.applied,
  types: [...store.applied.types],
  wallets: [...store.applied.wallets],
  categories: [...store.applied.categories],
})
const open = reactive({ date: true, types: false, wallets: false, categories: false })

const summaries = computed(() => ({
  date:
    draft.from && !draft.to
      ? `${formatDateRange(draft)} – pick an end date`
      : formatDateRange(draft),
  types: describeSelection(draft.types, filterTypes),
  wallets: describeSelection(draft.wallets, store.walletOptions),
  categories: describeSelection(draft.categories, filterCategories),
}))

const activeCount = computed(() => Object.values(summaries.value).filter(Boolean).length)

function reset() {
  delete draft.from
  delete draft.to
  Object.assign(draft, noFilters())
}
</script>

<template>
  <OraModalSheet title="Filter" overline="Transactions" @close="emit('close')">
    <template #title-end>
      <span
        v-if="activeCount"
        role="status"
        class="inline-flex h-6 items-center rounded-full bg-primary px-2.5 text-label-medium font-semibold text-on-primary"
      >
        {{ activeCount }} active
      </span>
    </template>

    <div class="flex flex-col gap-2 px-4 pt-2 pb-6">
      <FilterSection
        v-model:open="open.date"
        title="Date"
        :summary="summaries.date"
        placeholder="Any time"
      >
        <DateRangeFilter
          v-model:from="draft.from"
          v-model:to="draft.to"
          :today="newTransactionData.today"
        />
      </FilterSection>
      <FilterSection
        v-model:open="open.types"
        title="Transaction Type"
        :summary="summaries.types"
        placeholder="All types"
      >
        <FilterChecklist v-model="draft.types" label="Transaction type" :options="filterTypes" />
      </FilterSection>
      <FilterSection
        v-model:open="open.wallets"
        title="Wallet"
        :summary="summaries.wallets"
        placeholder="All wallets"
      >
        <FilterChecklist v-model="draft.wallets" label="Wallet" :options="store.walletOptions" />
      </FilterSection>
      <FilterSection
        v-model:open="open.categories"
        title="Category"
        :summary="summaries.categories"
        placeholder="All categories"
      >
        <FilterChecklist
          v-model="draft.categories"
          label="Category"
          two-columns
          :options="filterCategories"
        />
      </FilterSection>
    </div>

    <template #footer>
      <footer class="flex gap-3 bg-surface-container px-6 pt-4 pb-6">
        <OraButton variant="outlined" size="m" class="flex-1!" @click="reset">Reset</OraButton>
        <OraButton size="m" class="flex-[1.4]!" @click="emit('search', draft)">
          <IconSearch />
          Search
        </OraButton>
      </footer>
    </template>
  </OraModalSheet>
</template>
