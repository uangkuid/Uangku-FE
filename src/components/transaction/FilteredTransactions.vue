<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import TransactionRow from '@/components/transaction/TransactionRow.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraList from '@/components/ui/list/OraList.vue'
import { useListMotion } from '@/components/ui/shared/useListMotion'
import type { LedgerEntry } from '@/data/transactions'
import { useTransactionFiltersStore } from '@/stores/transactionFilters'
import { formatShortDate } from '@/utils/date'
import { formatRupiah, formatSignedRupiah } from '@/utils/rupiah'

const props = defineProps<{
  /** The transactions that match, in the order to list them. */
  entries: LedgerEntry[]
  /** The one whose details are on screen. */
  selectedId?: string
}>()

defineEmits<{
  open: [entry: LedgerEntry]
  editFilters: []
}>()

const filters = useTransactionFiltersStore()

const list = useTemplateRef('list')
useListMotion(
  () => list.value,
  () => props.entries,
)

const count = computed(() => props.entries.length)
const income = computed(() =>
  props.entries.reduce((sum, entry) => sum + Math.max(entry.amount, 0), 0),
)
const spending = computed(() =>
  props.entries.reduce((sum, entry) => sum - Math.min(entry.amount, 0), 0),
)
const net = computed(() => income.value - spending.value)
const summary = computed(() => filters.chips.map((chip) => chip.label).join(' · '))

function clearEverything() {
  filters.clear()
  filters.search = ''
}
</script>

<!-- What the transaction screen shows while filters are in force. -->
<template>
  <div class="flex flex-col gap-5">
    <div role="group" aria-label="Applied filters" class="flex flex-wrap items-center gap-2">
      <OraButton
        v-for="chip in filters.chips"
        :key="chip.group"
        variant="tonal"
        class="pr-2.5!"
        :aria-label="`Remove ${chip.name} filter: ${chip.label}`"
        @click="filters.remove(chip.group)"
      >
        {{ chip.label }}
        <IconClose class="size-4.5!" />
      </OraButton>
      <OraButton variant="text" @click="filters.clear()">Clear all</OraButton>
    </div>

    <div class="flex flex-wrap items-start gap-6">
      <section
        ref="list"
        aria-labelledby="results-title"
        class="relative flex min-w-0 flex-[2_1_480px] flex-col gap-3.5 rounded-card bg-surface-container-low px-3.5 pt-5 pb-3.5"
      >
        <div class="flex flex-wrap items-baseline justify-between gap-2 px-2.5">
          <h2 id="results-title" class="text-title-large font-semibold" aria-live="polite">
            Showing {{ count }} {{ count === 1 ? 'transaction' : 'transactions' }}
          </h2>
          <span class="text-body-small text-on-surface-variant">{{ summary }}</span>
        </div>

        <OraList v-if="count">
          <TransactionRow
            v-for="entry in entries"
            :key="entry.id"
            v-bind="entry"
            :data-motion-key="entry.id"
            :date="formatShortDate(entry.date)"
            :selected="entry.id === selectedId"
            @click="$emit('open', entry)"
          />
        </OraList>
        <div
          v-else
          data-motion-key="empty"
          class="flex flex-col items-center gap-3.5 rounded-list-outer bg-surface-container-lowest px-7 py-10 text-center"
        >
          <span
            aria-hidden="true"
            class="flex size-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container"
          >
            <IconSearch class="size-6.5" />
          </span>
          <div class="flex flex-col gap-1">
            <span class="text-title-medium font-semibold">No transactions found</span>
            <span class="text-body-medium text-on-surface-variant">
              Try removing a filter or searching for something else.
            </span>
          </div>
          <OraButton @click="clearEverything">Clear all filters</OraButton>
        </div>
      </section>

      <OraCard
        as="aside"
        variant="tertiary"
        class="max-w-105 flex-[1_1_320px] gap-4.5 p-6 split:sticky split:top-6"
        aria-labelledby="summary-title"
      >
        <div class="flex flex-col gap-1">
          <h2 id="summary-title" class="text-title-medium font-semibold">Result summary</h2>
          <p class="text-body-medium">{{ summary }}</p>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-label-large">Net result</span>
          <span class="font-display text-headline-medium font-bold tabular-nums">
            {{ net ? formatSignedRupiah(net) : formatRupiah(0) }}
          </span>
        </div>
        <dl
          class="flex flex-col gap-0.75 text-on-surface *:flex *:items-center *:justify-between *:gap-3 *:rounded-list-inner *:bg-surface-container-lowest *:px-4.5 *:py-3 [&>*:first-child]:rounded-t-corner-lg-inc [&>*:last-child]:rounded-b-corner-lg-inc"
        >
          <div>
            <dt class="text-body-medium">Income</dt>
            <dd class="text-label-large font-semibold text-success tabular-nums">
              {{ formatRupiah(income) }}
            </dd>
          </div>
          <div>
            <dt class="text-body-medium">Expense</dt>
            <dd class="text-label-large font-semibold text-error tabular-nums">
              {{ formatRupiah(spending) }}
            </dd>
          </div>
          <div>
            <dt class="text-body-medium">Transactions</dt>
            <dd class="text-label-large font-semibold tabular-nums">{{ count }}</dd>
          </div>
        </dl>
        <div class="flex gap-2.5">
          <OraButton class="flex-1!" aria-haspopup="dialog" @click="$emit('editFilters')">
            Edit filters
          </OraButton>
          <OraButton
            variant="outlined"
            class="flex-1! border-outline! text-on-tertiary-container!"
            @click="filters.clear()"
          >
            Clear all
          </OraButton>
        </div>
      </OraCard>
    </div>
  </div>
</template>
