<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import CumulativeChart from '@/components/chart/CumulativeChart.vue'
import InviteMemberSheet from '@/components/family/InviteMemberSheet.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconPencil from '@/components/icons/IconPencil.vue'
import IconUserPlus from '@/components/icons/IconUserPlus.vue'
import OraPageShell from '@/components/layout/OraPageShell.vue'
import ShapeBlob from '@/components/shapes/ShapeBlob.vue'
import TransactionRow from '@/components/transaction/TransactionRow.vue'
import AddWalletTile from '@/components/wallet/AddWalletTile.vue'
import WalletCreateSheet from '@/components/wallet/WalletCreateSheet.vue'
import OraAvatar from '@/components/ui/avatar/OraAvatar.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import ComingSoonLink from '@/components/ui/coming-soon-link/ComingSoonLink.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraList from '@/components/ui/list/OraList.vue'
import OraOverlay from '@/components/ui/overlay/OraOverlay.vue'
import { useOverlay } from '@/components/ui/shared/useOverlay'
import OraSleepingIcon from '@/components/ui/sleeping-icon/OraSleepingIcon.vue'
import { familyData } from '@/data/family'
import { useWalletsStore } from '@/stores/wallets'
import { formatRupiah } from '@/utils/rupiah'

const router = useRouter()
const wallets = useWalletsStore()
const invite = useOverlay()
const create = useOverlay()

/** Hides the amounts from onlookers. */
const hidden = ref(false)
const amount = (value: number) => (hidden.value ? 'Rp ••••••' : formatRupiah(value))

const shared = computed(() => wallets.list.filter((wallet) => wallet.family))
const total = computed(() => shared.value.reduce((sum, wallet) => sum + wallet.balance, 0))
const { week, members, topTransactions } = familyData
/* The totals are cumulative, so the last day holds the week's. */
const weekIncome = week.income[week.income.length - 1]!
const weekSpending = week.spending[week.spending.length - 1]!
const avatarColors = [
  '',
  'bg-tertiary! text-on-tertiary!',
  'bg-success! text-on-success!',
  'bg-primary! text-on-primary!',
  'bg-secondary! text-on-secondary!',
]

function showWallet(id: string) {
  create.close()
  router.push({ name: 'wallet', params: { id } })
}
</script>

<template>
  <OraPageShell>
    <main class="flex min-w-0 flex-1 flex-col gap-6 px-4 pt-8 pb-14 sm:px-10">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col gap-1">
          <span class="inline-flex items-center gap-2 text-label-large text-on-surface-variant">
            <FamilyIcon />
            Family · {{ members.length }} members
          </span>
          <h1 class="font-display text-display-small font-bold">{{ familyData.name }}</h1>
        </div>
        <div class="flex gap-2">
          <OraButton variant="tonal" aria-haspopup="dialog" @click="invite.open()">
            <IconUserPlus />
            Invite member
          </OraButton>
          <OraIconButton
            :as="ComingSoonLink"
            label="Edit family"
            title="Edit family"
            class="bg-surface-container-high text-on-surface!"
          >
            <IconPencil />
          </OraIconButton>
        </div>
      </header>

      <section
        aria-label="Family balance"
        class="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-corner-xxl bg-primary-container px-9 py-8 text-on-primary-container"
      >
        <ShapeBlob class="absolute -top-30 -right-15 size-80 text-tertiary-container opacity-45" />
        <div class="relative flex flex-col gap-2">
          <span class="text-title-medium opacity-85">Total balance</span>
          <div class="flex items-center gap-2">
            <span
              class="font-display text-headline-large font-bold tabular-nums sm:text-display-medium sm:font-bold"
            >
              {{ amount(total) }}
            </span>
            <OraIconButton
              :label="hidden ? 'Show balance' : 'Hide balance'"
              :selected="hidden"
              class="text-on-primary-container!"
              @click="hidden = !hidden"
            >
              <IconEye :off="hidden" />
            </OraIconButton>
          </div>
          <span class="flex flex-wrap items-center gap-3 text-body-medium opacity-90">
            <span><span aria-hidden="true">↑</span> In {{ amount(weekIncome) }}</span>
            <span><span aria-hidden="true">↓</span> Out {{ amount(weekSpending) }}</span>
            <span>this week</span>
          </span>
        </div>
        <div class="relative flex flex-col items-end gap-3">
          <ul aria-label="Members" class="flex -space-x-3">
            <li v-for="(member, index) in members" :key="member" :title="member">
              <span class="sr-only">{{ member }}</span>
              <OraAvatar
                size="md"
                :initials="member.charAt(0)"
                class="ring-3 ring-primary-container"
                :class="avatarColors[index % avatarColors.length]"
              />
            </li>
          </ul>
          <OraButton
            v-if="shared[0]"
            :as="RouterLink"
            :to="{ name: 'wallet', params: { id: shared[0].id }, query: { tab: 'member' } }"
            class="bg-surface! text-primary!"
          >
            Manage members
            <IconChevronRight />
          </OraButton>
        </div>
      </section>

      <section aria-labelledby="wallets-title" class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex flex-col gap-0.5">
            <h2 id="wallets-title" class="text-title-large font-semibold">Wallets</h2>
            <span class="text-body-medium text-on-surface-variant">
              Shared wallets everyone in the family can add to.
            </span>
          </div>
          <OraButton :as="RouterLink" :to="{ name: 'wallets' }" variant="text">See all</OraButton>
        </div>
        <ul class="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-3">
          <li v-for="wallet in shared" :key="wallet.id" class="flex">
            <RouterLink
              :to="{ name: 'wallet', params: { id: wallet.id } }"
              class="state-layer focus-ring transition-morph flex w-full flex-col justify-between gap-4 rounded-corner-xl bg-surface-container-low px-5 pt-5 pb-4.5 inset-ring inset-ring-outline-variant active:rounded-corner-lg"
            >
              <span class="flex items-center gap-2">
                <span class="min-w-0 flex-1 truncate text-title-medium font-semibold">
                  {{ wallet.name }}
                </span>
                <FamilyIcon />
                <OraSleepingIcon v-if="wallet.sleeping" />
              </span>
              <span class="flex flex-col gap-0.5">
                <span class="text-label-medium text-on-surface-variant">{{ wallet.kind }}</span>
                <span class="font-display text-headline-small font-bold tabular-nums">
                  {{ amount(wallet.balance) }}
                </span>
              </span>
            </RouterLink>
          </li>
          <li class="flex">
            <AddWalletTile label="Add family wallet" @click="create.open()" />
          </li>
        </ul>
      </section>

      <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <OraCard class="gap-4 px-6 pt-6 pb-5" aria-labelledby="chart-title">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex flex-col gap-0.5">
              <h2 id="chart-title" class="text-title-large font-semibold">Family asset summary</h2>
              <span class="text-body-medium text-on-surface-variant">
                Income and expenses this week, added up day by day.
              </span>
            </div>
            <span
              class="inline-flex items-center gap-3.5 pt-1.5 text-label-medium text-on-surface-variant"
            >
              <span class="inline-flex items-center gap-1.5">
                <span class="h-0.75 w-3.5 rounded-full bg-success"></span>Income
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="h-0.75 w-3.5 rounded-full bg-error"></span>Expense
              </span>
            </span>
          </div>
          <CumulativeChart
            class="mt-2"
            v-bind="week"
            :hidden="hidden"
            label="Family income and expenses by day"
          />
        </OraCard>

        <OraCard class="gap-3 px-4 pt-6 pb-4" aria-labelledby="top-title">
          <div class="flex items-center justify-between gap-3 px-2">
            <div class="flex flex-col gap-0.5">
              <h2 id="top-title" class="text-title-large font-semibold">Top transactions</h2>
              <span class="text-body-medium text-on-surface-variant">
                The biggest moves across family wallets.
              </span>
            </div>
            <OraButton :as="RouterLink" :to="{ name: 'transactions' }" variant="text">
              See all
            </OraButton>
          </div>
          <OraList>
            <TransactionRow
              v-for="(item, index) in topTransactions"
              :key="index"
              v-bind="item"
              family
              :as="RouterLink"
              :to="{ name: 'transactions' }"
              :masked="hidden"
            />
          </OraList>
        </OraCard>
      </div>
    </main>
  </OraPageShell>

  <OraOverlay>
    <InviteMemberSheet v-if="invite.isOpen" @close="invite.close()" />
  </OraOverlay>
  <OraOverlay>
    <WalletCreateSheet
      v-if="create.isOpen"
      initial-family
      @close="create.close()"
      @show="showWallet"
    />
  </OraOverlay>
</template>
