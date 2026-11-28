<script setup lang="ts">
import { ref } from 'vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import OraPageShell from '@/components/layout/OraPageShell.vue'
import BiggestExpenses from '@/components/report/BiggestExpenses.vue'
import MonthComparison from '@/components/report/MonthComparison.vue'
import ReportBreakdown from '@/components/report/ReportBreakdown.vue'
import ReportSummary from '@/components/report/ReportSummary.vue'
import SmartInsight from '@/components/report/SmartInsight.vue'
import TrendChart from '@/components/report/TrendChart.vue'
import OraButtonGroup from '@/components/ui/button-group/OraButtonGroup.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import { reportData, type ReportGroup, type ReportKind } from '@/data/report'

type Period = 'weekly' | 'monthly' | 'yearly'

const periods: { value: Period; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]
const groups: { value: ReportGroup; label: string }[] = [
  { value: 'category', label: 'Category' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'member', label: 'Member' },
]
const kinds: { value: ReportKind; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

/* The design draws one month, so the period and the month arrows change no figures yet. */
const period = ref<Period>('monthly')
const group = ref<ReportGroup>('category')
const kind = ref<ReportKind>('expense')
</script>

<template>
  <OraPageShell>
    <main class="min-w-0 flex-1 px-4 pt-8 pb-14 sm:px-10">
      <div class="mx-auto flex max-w-310 flex-col gap-6">
        <header class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col gap-0.5">
            <span class="text-label-large text-on-surface-variant">Report</span>
            <div class="flex items-center gap-2">
              <OraIconButton label="Previous month" class="bg-surface-container text-on-surface!">
                <IconChevronLeft class="size-5!" />
              </OraIconButton>
              <h1
                class="font-display text-headline-small font-bold tracking-[-0.5px] sm:text-display-small sm:font-bold"
              >
                {{ reportData.month }}
              </h1>
              <OraIconButton label="Next month" class="bg-surface-container text-on-surface!">
                <IconChevronRight class="size-5!" />
              </OraIconButton>
            </div>
          </div>
          <OraButtonGroup
            label="Period"
            :options="periods"
            :selected="period"
            @select="period = $event"
          />
        </header>

        <ReportSummary />
        <SmartInsight />

        <div class="flex flex-wrap items-center justify-between gap-3">
          <OraButtonGroup
            label="Group by"
            :options="groups"
            :selected="group"
            @select="group = $event"
          />
          <OraButtonGroup label="Type" :options="kinds" :selected="kind" @select="kind = $event" />
        </div>

        <div class="flex flex-wrap items-stretch gap-6">
          <ReportBreakdown class="flex-[2_1_560px]" :group="group" :kind="kind" />
          <BiggestExpenses class="flex-[1_1_340px]" />
        </div>

        <div class="flex flex-wrap items-stretch gap-6">
          <TrendChart class="flex-[2_1_560px]" />
          <MonthComparison class="flex-[1_1_340px]" />
        </div>
      </div>
    </main>
  </OraPageShell>
</template>
