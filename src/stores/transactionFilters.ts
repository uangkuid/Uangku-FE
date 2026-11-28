import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category } from '@/data/home'
import { filterCategories, type LedgerEntry } from '@/data/transactions'
import { useWalletsStore } from '@/stores/wallets'
import { formatShortDate, type IsoDate } from '@/utils/date'

export type FilterType = 'income' | 'expense' | 'transfer'

export interface TransactionFilters {
  from?: IsoDate
  /** Absent for a single day, or while the range is being picked. */
  to?: IsoDate
  types: FilterType[]
  wallets: string[]
  categories: Category[]
}

export type FilterGroup = 'date' | 'types' | 'wallets' | 'categories'

export const filterTypes: { value: FilterType; label: string }[] = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
]

export function noFilters(): TransactionFilters {
  return { types: [], wallets: [], categories: [] }
}

/** Selecting nothing, or everything, leaves that group unrestricted. */
function narrows(selected: string[], total: number) {
  return selected.length > 0 && selected.length < total
}

export function formatDateRange({ from, to }: TransactionFilters) {
  if (!from) return ''
  return to ? `${formatShortDate(from)} – ${formatShortDate(to)}` : formatShortDate(from)
}

/** Names the selection of one group; empty when nothing is selected. */
export function describeSelection<Value extends string>(
  selected: Value[],
  options: { value: Value; label: string }[],
) {
  if (!selected.length) return ''
  if (selected.length === options.length) return 'All selected'
  if (selected.length > 2) return `${selected.length} selected`
  return options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label)
    .join(', ')
}

/** The filters in force, and the search text shared by the transaction screens. */
export const useTransactionFiltersStore = defineStore('transactionFilters', () => {
  const wallets = useWalletsStore()
  const applied = ref(noFilters())
  const search = ref('')

  const walletOptions = computed(() =>
    wallets.list.map((wallet) => ({
      value: wallet.name,
      label: wallet.name,
      family: wallet.family,
      sleeping: wallet.sleeping,
    })),
  )

  /** One entry per group that narrows the list, for the chips of the result screen. */
  const chips = computed(() => {
    const { types, categories } = applied.value
    const groups: { group: FilterGroup; label: string; name: string }[] = [
      { group: 'date', name: 'date', label: formatDateRange(applied.value) },
      {
        group: 'types',
        name: 'type',
        label: narrows(types, filterTypes.length) ? describeSelection(types, filterTypes) : '',
      },
      {
        group: 'wallets',
        name: 'wallet',
        label: narrows(applied.value.wallets, walletOptions.value.length)
          ? describeSelection(applied.value.wallets, walletOptions.value)
          : '',
      },
      {
        group: 'categories',
        name: 'category',
        label: narrows(categories, filterCategories.length)
          ? describeSelection(categories, filterCategories)
          : '',
      },
    ]
    return groups.filter((chip) => chip.label)
  })

  function matchesSearch(entry: LedgerEntry) {
    const query = search.value.trim().toLowerCase()
    if (!query) return true
    return `${entry.categoryName} ${entry.notes} ${entry.wallet}`.toLowerCase().includes(query)
  }

  function matches(entry: LedgerEntry) {
    const { from, to, types, categories } = applied.value
    const active = new Set(chips.value.map((chip) => chip.group))
    if (from && (entry.date < from || entry.date > (to ?? from))) return false
    if (active.has('types') && !types.includes(entry.amount < 0 ? 'expense' : 'income')) {
      return false
    }
    if (active.has('wallets') && !applied.value.wallets.includes(entry.wallet)) return false
    if (active.has('categories') && !categories.includes(entry.category)) return false
    return matchesSearch(entry)
  }

  function apply(filters: TransactionFilters) {
    applied.value = filters
  }

  function remove(group: FilterGroup) {
    const next = { ...applied.value }
    if (group === 'date') {
      delete next.from
      delete next.to
    } else {
      next[group] = []
    }
    applied.value = next
  }

  function clear() {
    applied.value = noFilters()
  }

  return { applied, search, walletOptions, chips, matches, matchesSearch, apply, remove, clear }
})
