import { shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { ledger } from '@/data/transactions'

/** The prototype's transactions, kept in memory so that a deletion shows on every screen. */
export const useTransactionsStore = defineStore('transactions', () => {
  const entries = shallowRef(ledger)

  function remove(id: string) {
    entries.value = entries.value.filter((entry) => entry.id !== id)
  }

  return { entries, remove }
})
