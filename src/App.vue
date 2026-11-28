<script setup lang="ts">
import { RouterView } from 'vue-router'
import NewTransactionSheet from '@/components/transaction/NewTransactionSheet.vue'
import OraOverlay from '@/components/ui/overlay/OraOverlay.vue'
import { useOverlayStore } from '@/stores/overlays'
import { useTransactionFormStore } from '@/stores/transactionForm'

const overlays = useOverlayStore()
const transactionForm = useTransactionFormStore()
</script>

<template>
  <!-- While an overlay is open, the page behind it takes no focus or clicks. -->
  <div :inert="overlays.isOpen || undefined">
    <RouterView />
  </div>
  <OraOverlay>
    <NewTransactionSheet v-if="transactionForm.isOpen" @close="transactionForm.close()" />
  </OraOverlay>
</template>
