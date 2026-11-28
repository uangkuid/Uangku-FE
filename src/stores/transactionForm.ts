import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useOverlay } from '@/components/ui/shared/useOverlay'

/** Whether the new transaction form is open over the current screen. App.vue renders it. */
export const useTransactionFormStore = defineStore('transactionForm', () => {
  const overlay = useOverlay()
  const isOpen = computed(() => overlay.isOpen)

  return { isOpen, open: () => overlay.open(), close: () => overlay.close() }
})
