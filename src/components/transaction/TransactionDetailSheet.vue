<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef } from 'vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
import ShapeScallop from '@/components/shapes/ShapeScallop.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import OraModalSheet from '@/components/ui/sheet/OraModalSheet.vue'
import type { LedgerEntry } from '@/data/transactions'
import { formatLongDate } from '@/utils/date'
import { formatDigits } from '@/utils/rupiah'

const props = defineProps<{ entry: LedgerEntry }>()

const emit = defineEmits<{
  close: []
  edit: []
  /** The deletion was confirmed. */
  remove: []
}>()

const isIncome = computed(() => props.entry.amount > 0)
const typeName = computed(() => (isIncome.value ? 'Income' : 'Expense'))
const amount = computed(() => formatDigits(Math.abs(props.entry.amount)))

const confirming = ref(false)
const confirmId = useId()
const actions = useTemplateRef('actions')

/** Swaps the actions for the question or back, and follows with focus to the safe button. */
async function confirmDelete(ask: boolean) {
  confirming.value = ask
  await nextTick()
  actions.value?.querySelector('button')?.focus()
}

const rowClasses =
  'flex min-h-14 items-center justify-between gap-4 bg-surface-container-lowest py-2 pr-4 pl-5 first:rounded-t-corner-lg-inc last:rounded-b-corner-lg-inc rounded-list-inner'
</script>

<template>
  <OraModalSheet
    title="Transaction Detail"
    overline="Transactions"
    close-label="Close detail"
    @close="emit('close')"
  >
    <div class="flex flex-col gap-4.5 px-6 pt-2 pb-4">
      <div
        class="relative flex flex-col gap-1 overflow-hidden rounded-corner-xl bg-surface-container-lowest px-6 py-5"
      >
        <ShapeScallop
          class="absolute -top-17.5 -right-17.5 size-45 opacity-50"
          :class="isIncome ? 'text-success-container' : 'text-error-container'"
        />
        <span class="relative text-title-small font-semibold">Rp</span>
        <div
          class="relative flex items-baseline justify-between gap-3 font-display text-display-medium font-bold"
          :class="isIncome ? 'text-success' : 'text-error'"
        >
          <span aria-hidden="true">{{ isIncome ? '+' : '−' }}</span>
          <span class="sr-only">{{ isIncome ? 'plus' : 'minus' }} Rp</span>
          <span class="tracking-[-0.5px] tabular-nums">{{ amount }}</span>
        </div>
      </div>

      <dl class="flex flex-col gap-0.75">
        <div :class="rowClasses">
          <dt class="text-body-large">Type</dt>
          <dd
            class="inline-flex h-8 items-center gap-1.5 rounded-full pr-3 pl-2 text-label-large"
            :class="
              isIncome
                ? 'bg-success-container text-on-success-container'
                : 'bg-error-container text-on-error-container'
            "
          >
            <IconArrowUp class="size-4.5" :class="isIncome && 'rotate-180'" />
            {{ typeName }}
          </dd>
        </div>
        <div :class="rowClasses">
          <dt class="text-body-large">Wallet</dt>
          <dd
            class="inline-flex h-10 items-center gap-2.5 rounded-field border border-outline-variant bg-surface pl-3.5 text-label-large"
            :class="entry.family ? 'pr-1.5' : 'pr-3.5'"
          >
            {{ entry.wallet }}
            <FamilyIcon v-if="entry.family" />
          </dd>
        </div>
        <div :class="rowClasses">
          <dt class="text-body-large">Category</dt>
          <dd class="text-title-small font-semibold">{{ entry.categoryName }}</dd>
        </div>
        <div :class="rowClasses">
          <dt class="text-body-large">Date</dt>
          <dd class="text-title-small font-semibold">{{ formatLongDate(entry.date) }}</dd>
        </div>
      </dl>

      <div class="flex flex-col gap-2">
        <span class="pl-1 text-body-large">Notes</span>
        <div
          class="min-h-30 rounded-corner-lg border border-outline-variant bg-surface-container-lowest p-4 text-body-large whitespace-pre-wrap"
        >
          {{ entry.notes }}
        </div>
      </div>
    </div>

    <template #footer>
      <footer ref="actions" class="flex flex-col gap-3 px-6 pt-2 pb-6">
        <div
          v-if="confirming"
          role="alertdialog"
          :aria-labelledby="confirmId"
          class="flex flex-col gap-3 rounded-corner-lg-inc bg-error-container p-4 text-on-error-container"
        >
          <span :id="confirmId" class="text-body-medium font-semibold">
            Delete this {{ typeName.toLowerCase() }} of Rp {{ amount }}? This can't be undone.
          </span>
          <div class="flex justify-end gap-2">
            <OraButton
              variant="text"
              class="text-on-error-container!"
              @click="confirmDelete(false)"
            >
              Keep it
            </OraButton>
            <OraButton class="bg-error! text-on-error!" @click="emit('remove')">Delete</OraButton>
          </div>
        </div>
        <div v-else class="flex gap-2.5">
          <OraButton
            size="m"
            class="flex-1! bg-error-container! text-on-error-container!"
            @click="confirmDelete(true)"
          >
            Delete
          </OraButton>
          <OraButton size="m" class="flex-1!" @click="emit('edit')">Edit Transaction</OraButton>
        </div>
      </footer>
    </template>
  </OraModalSheet>
</template>
