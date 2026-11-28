<script setup lang="ts">
import OraLinearProgress from '@/components/ui/linear-progress/OraLinearProgress.vue'
import { reportData } from '@/data/report'
import { formatRupiah, formatSignedRupiah } from '@/utils/rupiah'

const { net, income, expense, savingsRate } = reportData
const rate = `${savingsRate.toLocaleString('id-ID')}%`

const cardClasses = 'flex flex-col gap-2 rounded-corner-xl p-6'
const figureClasses = 'font-display text-headline-large font-bold tabular-nums'
const pillClasses =
  'inline-flex h-7 items-center self-start rounded-full px-3 text-label-medium font-semibold'
</script>

<!-- The month in four figures. -->
<template>
  <dl class="grid grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-4">
    <div class="bg-primary text-on-primary" :class="cardClasses">
      <dt class="text-label-large">Net cashflow</dt>
      <dd :class="figureClasses">{{ formatSignedRupiah(net) }}</dd>
      <dd class="bg-primary-container text-on-primary-container" :class="pillClasses">
        Nov: −Rp 200.000
      </dd>
    </div>
    <div class="bg-success-container text-on-success-container" :class="cardClasses">
      <dt class="text-label-large">Income</dt>
      <dd :class="figureClasses">{{ formatRupiah(income) }}</dd>
      <dd class="bg-surface-container-lowest text-success" :class="pillClasses">▲ 25% vs Nov</dd>
    </div>
    <div class="bg-error-container text-on-error-container" :class="cardClasses">
      <dt class="text-label-large">Expense</dt>
      <dd :class="figureClasses">{{ formatRupiah(expense) }}</dd>
      <dd class="bg-surface-container-lowest text-success" :class="pillClasses">▼ 9% vs Nov</dd>
    </div>
    <div class="bg-tertiary-container text-on-tertiary-container" :class="cardClasses">
      <dt class="text-label-large">Savings rate</dt>
      <dd :class="figureClasses">{{ rate }}</dd>
      <dd class="mt-2.25">
        <OraLinearProgress
          :value="savingsRate"
          :label="`Savings rate ${rate}`"
          :thickness="10"
          indicator-class="bg-tertiary"
          track-class="bg-surface-container-lowest"
        />
      </dd>
    </div>
  </dl>
</template>
