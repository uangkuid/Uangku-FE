<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import IconPlus from '@/components/icons/IconPlus.vue'
import OraPageHeader from '@/components/layout/OraPageHeader.vue'
import OraPageShell from '@/components/layout/OraPageShell.vue'
import AddWalletTile from '@/components/wallet/AddWalletTile.vue'
import WalletCard from '@/components/wallet/WalletCard.vue'
import WalletCreateSheet from '@/components/wallet/WalletCreateSheet.vue'
import WalletTotalCard from '@/components/wallet/WalletTotalCard.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraButtonGroup from '@/components/ui/button-group/OraButtonGroup.vue'
import OraOverlay from '@/components/ui/overlay/OraOverlay.vue'
import OraSearchField from '@/components/ui/search-field/OraSearchField.vue'
import { useOverlay } from '@/components/ui/shared/useOverlay'
import { familyData } from '@/data/family'
import { useWalletsStore } from '@/stores/wallets'

type Filter = 'all' | 'personal' | 'family' | 'sleeping'

const filterOptions: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'personal', label: 'Personal' },
  { value: 'family', label: 'Family' },
  { value: 'sleeping', label: 'Sleeping' },
]

const router = useRouter()
const wallets = useWalletsStore()
const create = useOverlay()

const filter = ref<Filter>('all')
const search = ref('')

const total = computed(() => wallets.list.reduce((sum, wallet) => sum + wallet.balance, 0))
const familyCount = computed(() => wallets.list.filter((wallet) => wallet.family).length)

const shown = computed(() => {
  const query = search.value.trim().toLowerCase()
  return wallets.list
    .map((wallet, index) => ({
      wallet,
      index,
      share: total.value ? (wallet.balance / total.value) * 100 : 0,
    }))
    .filter(({ wallet }) => {
      if (query && !wallet.name.toLowerCase().includes(query)) return false
      if (filter.value === 'personal') return !wallet.family
      if (filter.value === 'family') return wallet.family
      return filter.value !== 'sleeping' || wallet.sleeping
    })
})

function showWallet(id: string) {
  create.close()
  router.push({ name: 'wallet', params: { id } })
}
</script>

<template>
  <OraPageShell>
    <main class="min-w-0 flex-1 px-4 pt-8 pb-14 sm:px-10">
      <div class="mx-auto flex max-w-310 flex-col gap-6">
        <OraPageHeader
          :overline="`${wallets.list.length} wallets · ${familyCount} shared with ${familyData.name}`"
          title="Wallet"
        >
          <OraButton size="m" aria-haspopup="dialog" @click="create.open()">
            <IconPlus class="size-5!" stroke-width="2.4" />
            New wallet
          </OraButton>
        </OraPageHeader>

        <WalletTotalCard :wallets="wallets.list" />

        <div class="flex flex-wrap items-center gap-3">
          <OraSearchField
            v-model="search"
            variant="filled"
            class="flex-[1_1_320px]"
            label="Search wallets"
            placeholder="Search wallet"
          />
          <OraButtonGroup
            label="Filter wallets"
            size="m"
            :options="filterOptions"
            :selected="filter"
            @select="filter = $event"
          />
        </div>

        <ul class="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-3.5">
          <WalletCard v-for="item in shown" :key="item.wallet.id" v-bind="item" />
          <li class="flex">
            <AddWalletTile label="Add a wallet" @click="create.open()" />
          </li>
        </ul>

        <p
          v-if="!shown.length"
          class="rounded-corner-xl bg-surface-container-low p-6 text-center text-body-large text-on-surface-variant"
        >
          No wallets match this filter.
        </p>
      </div>
    </main>
  </OraPageShell>

  <OraOverlay>
    <WalletCreateSheet v-if="create.isOpen" @close="create.close()" @show="showWallet" />
  </OraOverlay>
</template>
