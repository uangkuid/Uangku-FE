<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import IconFilter from '@/components/icons/IconFilter.vue'
import OraPageHeader from '@/components/layout/OraPageHeader.vue'
import OraPageShell from '@/components/layout/OraPageShell.vue'
import FilteredTransactions from '@/components/transaction/FilteredTransactions.vue'
import TransactionCalendar from '@/components/transaction/TransactionCalendar.vue'
import TransactionDetailSheet from '@/components/transaction/TransactionDetailSheet.vue'
import TransactionFilterSheet from '@/components/transaction/TransactionFilterSheet.vue'
import TransactionRow from '@/components/transaction/TransactionRow.vue'
import TransactionTotals from '@/components/transaction/TransactionTotals.vue'
import OraBadge from '@/components/ui/badge/OraBadge.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraList from '@/components/ui/list/OraList.vue'
import OraOverlay from '@/components/ui/overlay/OraOverlay.vue'
import OraSearchField from '@/components/ui/search-field/OraSearchField.vue'
import OraSelectMenu from '@/components/ui/select-menu/OraSelectMenu.vue'
import { useOverlay } from '@/components/ui/shared/useOverlay'
import { newTransactionData } from '@/data/newTransaction'
import type { LedgerEntry } from '@/data/transactions'
import { useTransactionFiltersStore, type TransactionFilters } from '@/stores/transactionFilters'
import { useTransactionFormStore } from '@/stores/transactionForm'
import { useTransactionsStore } from '@/stores/transactions'
import {
  dateParts,
  formatDayMonth,
  formatRelativeDay,
  formatShortDate,
  FULL_MONTH_NAMES,
  type IsoDate,
} from '@/utils/date'
import { formatSignedRupiah } from '@/utils/rupiah'

const { today, years } = newTransactionData
const transactions = useTransactionsStore()
const filters = useTransactionFiltersStore()
const transactionForm = useTransactionFormStore()
const detail = useOverlay<LedgerEntry>()
const filter = useOverlay()

/** While filters are in force, their results take the calendar's place. */
const filtering = computed(() => filters.chips.length > 0)
/** The matches, the latest first. */
const results = computed(() =>
  transactions.entries.filter(filters.matches).sort((a, b) => b.date.localeCompare(a.date)),
)

const filterButton = useTemplateRef('filterButton')

// Clearing the filters removes the control that did it, so focus moves to the filter button.
watch(filtering, async (on) => {
  if (on) return
  await nextTick()
  if (document.activeElement === document.body) filterButton.value?.$el.focus()
})

function search(chosen: TransactionFilters) {
  filters.apply(chosen)
  filter.close()
}

/** The form takes the detail sheet's place. */
function edit() {
  detail.close()
  transactionForm.open()
}

function remove() {
  if (detail.payload) transactions.remove(detail.payload.id)
  detail.close()
}

const year = ref(dateParts(today).year)
const month = ref(dateParts(today).month)
/** The screen opens on today's transactions. */
const day = ref<IsoDate | undefined>(today)

watch(year, () => (day.value = undefined))

const monthName = computed(() => FULL_MONTH_NAMES[month.value]!)
const inMonth = computed(() => {
  const prefix = `${year.value}-${String(month.value + 1).padStart(2, '0')}`
  return transactions.entries.filter((entry) => entry.date.startsWith(prefix))
})
const listed = computed(() =>
  inMonth.value.filter(
    (entry) => (!day.value || entry.date === day.value) && filters.matchesSearch(entry),
  ),
)

/** The listed transactions by day, the latest day first. */
const groups = computed(() => {
  const dates = [...new Set(listed.value.map((entry) => entry.date))].sort().reverse()
  return dates.map((date) => {
    const entries = listed.value.filter((entry) => entry.date === date)
    return {
      date,
      label: formatRelativeDay(date, today),
      total: entries.reduce((sum, entry) => sum + entry.amount, 0),
      entries,
    }
  })
})

const emptyText = computed(() => {
  if (!inMonth.value.length) return `No transactions in ${monthName.value} yet.`
  const query = filters.search.trim()
  return query ? `Nothing matches “${query}”.` : 'No transactions on this day.'
})
</script>

<template>
  <OraPageShell>
    <main class="min-w-0 flex-1 px-4 pt-8 pb-14 sm:px-10">
      <div class="mx-auto flex max-w-310 flex-col gap-5">
        <OraPageHeader
          :overline="
            filtering
              ? `Filtered · ${results.length} of ${transactions.entries.length} transactions`
              : `${monthName} ${year} · ${inMonth.length} transactions`
          "
          title="Transactions"
        >
          <TransactionTotals :entries="filtering ? results : inMonth" />
        </OraPageHeader>

        <div class="flex flex-wrap items-center gap-2.5">
          <OraSearchField
            v-model="filters.search"
            class="flex-[1_1_360px]"
            label="Search transactions"
            placeholder="Search"
          />
          <OraSelectMenu
            v-if="!filtering"
            size="m"
            label="Year"
            :options="years"
            :selected="year"
            @select="year = $event"
          />
          <OraIconButton
            ref="filterButton"
            :label="filtering ? `Filter, ${filters.chips.length} active` : 'Filter'"
            size="m"
            :class="
              filtering
                ? 'bg-secondary-container text-on-secondary-container!'
                : 'bg-surface-container-high text-on-surface!'
            "
            aria-haspopup="dialog"
            @click="filter.open()"
          >
            <IconFilter />
            <OraBadge
              v-if="filtering"
              :label="filters.chips.length"
              class="absolute top-1 right-1 h-5! min-w-5! bg-primary! text-on-primary!"
            />
          </OraIconButton>
        </div>

        <FilteredTransactions
          v-if="filtering"
          :entries="results"
          :selected-id="detail.isOpen ? detail.payload?.id : undefined"
          @open="detail.open($event)"
          @edit-filters="filter.open()"
        />

        <div v-else class="flex flex-wrap items-start gap-6">
          <TransactionCalendar
            v-model:month="month"
            v-model:day="day"
            class="max-w-115 flex-[1_1_340px] split:sticky split:top-6"
            :year="year"
            :today="today"
            :entries="inMonth"
          />

          <section
            aria-label="Transaction list"
            class="flex min-w-0 flex-[2_1_400px] flex-col gap-4.5 rounded-card bg-surface-container-low px-3.5 pt-5 pb-3.5"
          >
            <div v-if="day" class="flex flex-wrap items-center justify-between gap-3 px-2.5">
              <span class="text-body-small text-on-surface-variant">
                Showing {{ formatDayMonth(day) }} only
              </span>
              <OraButton variant="tonal" @click="day = undefined">
                Show all {{ monthName }}
              </OraButton>
            </div>

            <div v-for="group in groups" :key="group.date" class="flex flex-col gap-2">
              <div class="flex items-center justify-between gap-3 px-2.5">
                <h2 class="text-title-medium font-semibold">{{ group.label }}</h2>
                <span
                  class="inline-flex h-6 items-center rounded-full px-2.5 text-label-medium font-semibold tabular-nums"
                  :class="
                    group.total >= 0
                      ? 'bg-success-container text-on-success-container'
                      : 'bg-error-container text-on-error-container'
                  "
                >
                  {{ formatSignedRupiah(group.total) }}
                </span>
              </div>
              <OraList>
                <TransactionRow
                  v-for="entry in group.entries"
                  :key="entry.id"
                  v-bind="entry"
                  :date="formatShortDate(entry.date)"
                  :selected="detail.isOpen && detail.payload?.id === entry.id"
                  @click="detail.open(entry)"
                />
              </OraList>
            </div>

            <p
              v-if="!groups.length"
              class="rounded-list-outer bg-surface-container-lowest p-7 text-center text-body-medium text-on-surface-variant"
            >
              {{ emptyText }}
            </p>
          </section>
        </div>
      </div>
    </main>
  </OraPageShell>

  <OraOverlay>
    <TransactionDetailSheet
      v-if="detail.isOpen && detail.payload"
      :entry="detail.payload"
      @close="detail.close()"
      @edit="edit"
      @remove="remove"
    />
  </OraOverlay>
  <OraOverlay>
    <TransactionFilterSheet v-if="filter.isOpen" @close="filter.close()" @search="search" />
  </OraOverlay>
</template>
