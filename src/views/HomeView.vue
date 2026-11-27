<script setup lang="ts">
import BalanceCard from '@/components/home/BalanceCard.vue'
import MonthSummaryCard from '@/components/home/MonthSummaryCard.vue'
import RecentTransactions from '@/components/home/RecentTransactions.vue'
import TopSpending from '@/components/home/TopSpending.vue'
import IconBell from '@/components/icons/IconBell.vue'
import AppNavRail from '@/components/layout/AppNavRail.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import { homeData } from '@/data/home'

const { user, today, greeting, month } = homeData
</script>

<template>
  <div class="flex min-h-dvh">
    <AppNavRail :user="user" />

    <main class="min-w-0 flex-1 px-4 pt-8 pb-14 sm:px-10">
      <div class="mx-auto flex max-w-310 flex-col gap-6">
        <header class="flex items-center justify-between gap-4">
          <div class="flex min-w-0 flex-col gap-0.5">
            <span class="text-[14px] leading-5 font-medium text-on-surface-variant">
              {{ today }}
            </span>
            <h1
              class="font-display text-headline-small font-bold tracking-[-0.5px] sm:text-display-small sm:font-bold"
            >
              {{ greeting }}, {{ user.name }}
            </h1>
          </div>
          <AppIconButton label="Notifications" class="bg-surface-container-high">
            <IconBell />
            <AppBadge class="absolute top-2 right-2" />
          </AppIconButton>
        </header>

        <div class="flex flex-wrap items-stretch gap-6">
          <BalanceCard
            class="flex-[2_1_600px]"
            :total="homeData.totalBalance"
            :monthly-change="homeData.monthlyChange"
            :wallets="homeData.wallets"
            :wallet-count="homeData.walletCount"
          />
          <MonthSummaryCard
            class="flex-[1_1_320px]"
            :month="month.name"
            :income="month.income"
            :spending="month.spending"
            :spent-percent="month.spentPercent"
          />
        </div>

        <div class="flex flex-wrap items-start gap-6">
          <RecentTransactions class="flex-[2_1_600px]" :transactions="homeData.transactions" />
          <TopSpending class="flex-[1_1_320px]" :categories="homeData.topSpending" />
        </div>
      </div>
    </main>
  </div>
</template>
