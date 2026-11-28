<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import CumulativeChart from '@/components/chart/CumulativeChart.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconFamily from '@/components/icons/IconFamily.vue'
import IconPencil from '@/components/icons/IconPencil.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconSummary from '@/components/icons/IconSummary.vue'
import OraPageShell from '@/components/layout/OraPageShell.vue'
import AddMemberSheet from '@/components/wallet/AddMemberSheet.vue'
import WalletBalanceCard from '@/components/wallet/WalletBalanceCard.vue'
import WalletEditSheet from '@/components/wallet/WalletEditSheet.vue'
import { walletLook } from '@/components/wallet/walletLook'
import WalletMembers from '@/components/wallet/WalletMembers.vue'
import WalletRecentTransactions from '@/components/wallet/WalletRecentTransactions.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraOverlay from '@/components/ui/overlay/OraOverlay.vue'
import { useOverlay } from '@/components/ui/shared/useOverlay'
import OraSleepingIcon from '@/components/ui/sleeping-icon/OraSleepingIcon.vue'
import OraSnackbar from '@/components/ui/snackbar/OraSnackbar.vue'
import OraTabs from '@/components/ui/tabs/OraTabs.vue'
import { walletActivity, type WalletMember } from '@/data/wallets'
import { useTransactionFormStore } from '@/stores/transactionForm'
import { useWalletsStore } from '@/stores/wallets'

const props = defineProps<{
  id: string
  /** Opens on the member tab, which only family wallets have. */
  initialTab?: string
}>()

type Tab = 'summary' | 'member'
const tabs = [
  { value: 'summary' as const, label: 'Summary', icon: IconSummary },
  { value: 'member' as const, label: 'Member', icon: IconFamily },
]

const router = useRouter()
const wallets = useWalletsStore()
const transactionForm = useTransactionFormStore()
const editing = useOverlay()
const adding = useOverlay()
const panelId = useId()

const wallet = computed(() => wallets.find(props.id))
const look = computed(
  () => wallet.value && walletLook(wallet.value, wallets.list.indexOf(wallet.value)),
)

const tab = ref<Tab>('summary')
const hidden = ref(false)
/** Confirms the last invitation. */
const notice = ref('')

watch(
  () => props.id,
  () => {
    tab.value = props.initialTab === 'member' ? 'member' : 'summary'
    notice.value = ''
    if (!wallet.value) router.replace({ name: 'wallets' })
  },
  { immediate: true },
)

/** A wallet with no money in it, such as a new one, has no activity to show. */
const activity = computed(() => {
  if (wallet.value?.balance) return walletActivity
  const nothing = walletActivity.chart.days.map(() => 0)
  return {
    income: 0,
    spending: 0,
    chart: { ...walletActivity.chart, income: nothing, spending: nothing },
    transactions: [],
    members: walletActivity.members.slice(0, 1).map((owner) => ({
      ...owner,
      transactions: 0,
      spent: 0,
    })),
  }
})

const invited = computed(() => wallets.invites[props.id] ?? [])

const members = computed<WalletMember[]>(() => [
  ...activity.value.members,
  ...invited.value.map((email) => ({
    name: email.charAt(0).toUpperCase() + email.slice(1, email.indexOf('@')),
    email,
    role: 'Invited' as const,
    transactions: 0,
    spent: 0,
  })),
])

function openAdd() {
  notice.value = ''
  adding.open()
}

function invite(emails: string[]) {
  wallets.invite(props.id, emails)
  adding.close()
  const count = `${emails.length} ${emails.length > 1 ? 'members' : 'member'}`
  notice.value = `${count} invited · they’ll get access once they accept`
}
</script>

<template>
  <OraPageShell>
    <main v-if="wallet && look" class="flex min-w-0 flex-1 flex-col gap-6 px-4 pt-6 pb-14 sm:px-10">
      <header class="flex flex-wrap items-center gap-4">
        <OraIconButton
          :as="RouterLink"
          :to="{ name: 'wallets' }"
          label="Back to wallets"
          class="bg-surface-container-high text-on-surface!"
        >
          <IconArrowLeft />
        </OraIconButton>
        <span
          aria-hidden="true"
          class="flex size-14 items-center justify-center text-title-medium font-semibold"
          :class="[look.glyph, wallet.family ? 'rounded-[50%_50%_50%_18px]' : 'rounded-full']"
        >
          {{ wallet.glyph }}
        </span>
        <div class="flex min-w-0 flex-col gap-1">
          <span class="text-label-large text-on-surface-variant">Wallets</span>
          <h1 class="font-display text-display-small font-bold tracking-[-0.5px]">
            {{ wallet.name }}
          </h1>
        </div>
        <span
          v-if="wallet.family"
          class="inline-flex h-8 items-center gap-1.5 rounded-full bg-tertiary-container pr-3 pl-2 text-label-large font-semibold text-on-tertiary-container"
        >
          <IconFamily class="size-4.5" />
          Family
        </span>
        <OraSleepingIcon v-if="wallet.sleeping" />
        <div class="ml-auto flex flex-wrap gap-2">
          <OraButton
            variant="outlined"
            class="text-on-surface!"
            aria-haspopup="dialog"
            @click="editing.open()"
          >
            <IconPencil />
            Edit wallet
          </OraButton>
          <OraButton
            aria-haspopup="dialog"
            :disabled="wallet.sleeping"
            :title="wallet.sleeping ? 'Wake the wallet up to add a transaction' : undefined"
            @click="transactionForm.open()"
          >
            <IconPlus stroke-width="2.4" />
            Add transaction
          </OraButton>
        </div>
      </header>

      <OraTabs
        v-if="wallet.family"
        v-model="tab"
        label="Wallet sections"
        :panel-id="panelId"
        :options="tabs"
      />

      <div :id="panelId" :role="wallet.family ? 'tabpanel' : undefined">
        <div
          v-if="!wallet.family || tab === 'summary'"
          class="grid items-start gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]"
        >
          <div class="flex min-w-0 flex-col gap-4">
            <WalletBalanceCard
              v-model:hidden="hidden"
              :balance="wallet.balance"
              :income="activity.income"
              :spending="activity.spending"
            />

            <OraCard class="gap-18 pt-6 pr-8 pb-5 pl-7" aria-labelledby="asset-title">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex flex-col gap-1">
                  <h2 id="asset-title" class="text-title-large font-semibold">Asset Summary</h2>
                  <p class="text-body-medium text-on-surface-variant">
                    Track your income and expenses this month.
                  </p>
                </div>
                <div class="flex gap-2 text-label-large">
                  <span
                    class="inline-flex h-8 items-center gap-2 rounded-full bg-success-container px-3 text-on-success-container"
                  >
                    <span class="h-1 w-3.5 rounded-full bg-success"></span>Income
                  </span>
                  <span
                    class="inline-flex h-8 items-center gap-2 rounded-full bg-error-container px-3 text-on-error-container"
                  >
                    <span class="h-1 w-3.5 rounded-full bg-error"></span>Expense
                  </span>
                </div>
              </div>
              <CumulativeChart
                v-bind="activity.chart"
                tooltip-above
                :hidden="hidden"
                label="Cumulative income and expenses from 22 to 29 July"
              />
            </OraCard>
          </div>

          <WalletRecentTransactions
            :transactions="activity.transactions"
            :show-author="wallet.family"
            :hidden="hidden"
          />
        </div>

        <WalletMembers v-else :members="members" :hidden="hidden" @add="openAdd" />
      </div>

      <OraSnackbar
        v-if="notice"
        action="OK"
        class="fixed bottom-8 left-1/2 z-30 w-max max-w-[calc(100%-32px)] -translate-x-1/2"
        @action="notice = ''"
      >
        {{ notice }}
      </OraSnackbar>
    </main>
  </OraPageShell>

  <OraOverlay>
    <WalletEditSheet v-if="editing.isOpen && wallet" :wallet="wallet" @close="editing.close()" />
  </OraOverlay>
  <OraOverlay>
    <AddMemberSheet
      v-if="adding.isOpen && wallet"
      :wallet-name="wallet.name"
      :invited="invited"
      @close="adding.close()"
      @add="invite"
    />
  </OraOverlay>
</template>
