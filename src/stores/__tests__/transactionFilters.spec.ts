import { beforeEach, describe, it, expect } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'
import { ledger } from '@/data/transactions'
import { filterTypes, noFilters, useTransactionFiltersStore } from '../transactionFilters'

describe('transaction filters', () => {
  beforeEach(() => setActivePinia(createPinia()))

  const matching = () => {
    const filters = useTransactionFiltersStore()
    return ledger.filter(filters.matches).map((entry) => entry.id)
  }

  it('lets everything through while nothing is chosen', () => {
    expect(matching()).toHaveLength(ledger.length)
    expect(useTransactionFiltersStore().chips).toEqual([])
  })

  it('combines the date range, type and category', () => {
    const filters = useTransactionFiltersStore()
    filters.apply({
      ...noFilters(),
      from: '2025-01-01',
      to: '2025-01-10',
      types: ['expense'],
      categories: ['investment'],
    })

    expect(matching()).toEqual(['t5b', 't5c'])
    expect(filters.chips.map((chip) => chip.label)).toEqual([
      '1 Jan 25 – 10 Jan 25',
      'Expense',
      'Investment',
    ])
  })

  it('takes a range without an end as that one day', () => {
    useTransactionFiltersStore().apply({ ...noFilters(), from: '2025-01-03' })

    expect(matching()).toEqual(['t3a', 't3b'])
  })

  it('does not restrict a group with everything selected', () => {
    const filters = useTransactionFiltersStore()
    filters.apply({ ...noFilters(), types: filterTypes.map((type) => type.value) })

    expect(matching()).toHaveLength(ledger.length)
    expect(filters.chips).toEqual([])
  })

  it('drops one group at a time and searches the text', () => {
    const filters = useTransactionFiltersStore()
    filters.apply({ ...noFilters(), wallets: ['Dana'], types: ['expense'] })
    filters.remove('wallets')
    filters.search = 'grab'

    expect(matching()).toEqual(['t3b'])
    expect(filters.chips.map((chip) => chip.group)).toEqual(['types'])
  })
})
