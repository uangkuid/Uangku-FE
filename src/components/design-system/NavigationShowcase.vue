<script setup lang="ts">
import { ref } from 'vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconBell from '@/components/icons/IconBell.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconDownload from '@/components/icons/IconDownload.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconPencil from '@/components/icons/IconPencil.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconPrint from '@/components/icons/IconPrint.vue'
import IconReport from '@/components/icons/IconReport.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconTransactions from '@/components/icons/IconTransactions.vue'
import IconWallet from '@/components/icons/IconWallet.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraFabMenu from '@/components/ui/fab-menu/OraFabMenu.vue'
import OraFab from '@/components/ui/fab/OraFab.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraMenu from '@/components/ui/menu/OraMenu.vue'
import OraNavBar from '@/components/ui/nav-bar/OraNavBar.vue'
import OraNavBarItem from '@/components/ui/nav-bar/OraNavBarItem.vue'
import OraTabs from '@/components/ui/tabs/OraTabs.vue'
import OraToolbar from '@/components/ui/toolbar/OraToolbar.vue'
import OraTooltip from '@/components/ui/tooltip/OraTooltip.vue'
import OraTopAppBar from '@/components/ui/top-app-bar/OraTopAppBar.vue'

const current = ref('Home')
const destinations = [
  { label: 'Home', icon: IconHome, badge: undefined },
  { label: 'Transactions', icon: IconTransactions, badge: 3 },
  { label: 'Wallet', icon: IconWallet, badge: true },
  { label: 'Report', icon: IconReport, badge: undefined },
]

const bars = ['small', 'medium', 'large'] as const
const scrolled = ref(false)

const chosen = ref('nothing yet')
const compact = ref(true)

const actions = [
  { value: 'transaction', label: 'Transaction', icon: IconPlus },
  { value: 'wallet', label: 'Wallet', icon: IconWallet },
  { value: 'report', label: 'Report', icon: IconReport },
]

const tab = ref('income')
const tabs = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]
</script>

<template>
  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-app-bar">
    <h2 id="ds-app-bar" class="text-title-large font-medium">Top app bars</h2>
    <OraButton
      variant="tonal"
      :selected="scrolled"
      class="self-start"
      @click="scrolled = !scrolled"
    >
      Scrolled
    </OraButton>
    <div
      v-for="size in bars"
      :key="size"
      class="overflow-hidden rounded-corner-lg border border-outline-variant"
    >
      <OraTopAppBar
        :size="size"
        :scrolled="scrolled"
        :title="`${size} app bar`"
        subtitle="Subtitle"
        heading-tag="h3"
      >
        <template #leading>
          <OraIconButton :label="`Back, ${size}`"><IconArrowLeft /></OraIconButton>
        </template>
        <template #actions>
          <OraIconButton :label="`Search, ${size}`"><IconSearch /></OraIconButton>
        </template>
      </OraTopAppBar>
    </div>
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-nav-bar">
    <h2 id="ds-nav-bar" class="text-title-large font-medium">Navigation bar and secondary tabs</h2>
    <OraNavBar
      v-for="horizontal in [false, true]"
      :key="String(horizontal)"
      :label="horizontal ? 'Example, horizontal' : 'Example'"
      :class="horizontal && 'max-sm:hidden'"
    >
      <OraNavBarItem
        v-for="item in destinations"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :badge="item.badge"
        :horizontal="horizontal"
        :aria-current="current === item.label ? 'page' : undefined"
        @click="current = item.label"
      />
    </OraNavBar>
    <OraTabs
      v-model="tab"
      variant="secondary"
      label="Example secondary sections"
      panel-id="ds-secondary-panel"
      :options="tabs"
    />
    <p id="ds-secondary-panel" role="tabpanel" class="text-body-medium">The {{ tab }} panel.</p>
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-menu">
    <h2 id="ds-menu" class="text-title-large font-medium">Menus and tooltips</h2>
    <div class="flex flex-wrap items-center gap-4">
      <OraMenu
        label="Wallet actions"
        :items="[
          { value: 'edit', label: 'Edit', icon: IconPencil },
          { value: 'copy', label: 'Duplicate', icon: IconCopy, trailing: 'Ctrl D' },
          { value: 'compact', label: 'Compact rows', selected: compact, divider: true },
          { value: 'archive', label: 'Archive', disabled: true },
        ]"
        @select="$event === 'compact' ? (compact = !compact) : (chosen = $event)"
      >
        <template #trigger="{ props, toggle }">
          <OraButton v-bind="props" variant="tonal" @click="toggle">Open menu</OraButton>
        </template>
      </OraMenu>
      <span class="text-body-medium text-on-surface-variant">Chosen: {{ chosen }}</span>
      <OraTooltip v-slot="{ describedBy }" text="Download the report">
        <OraIconButton label="Download" variant="tonal" :aria-describedby="describedBy">
          <IconDownload />
        </OraIconButton>
      </OraTooltip>
      <OraTooltip
        title="Net balance"
        text="Income minus expenses for the month shown."
        side="bottom"
      >
        <template #default="{ describedBy }">
          <OraIconButton label="About net balance" :aria-describedby="describedBy">
            <IconInfo />
          </OraIconButton>
        </template>
        <template #actions><OraButton variant="text">Learn more</OraButton></template>
      </OraTooltip>
    </div>
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-toolbar">
    <h2 id="ds-toolbar" class="text-title-large font-medium">Toolbars and FAB menu</h2>
    <div class="overflow-hidden rounded-corner-lg border border-outline-variant">
      <OraToolbar label="Docked example" variant="docked">
        <OraIconButton label="Edit"><IconPencil /></OraIconButton>
        <OraIconButton label="Copy"><IconCopy /></OraIconButton>
        <OraIconButton label="Print"><IconPrint /></OraIconButton>
        <OraIconButton label="Notify"><IconBell /></OraIconButton>
      </OraToolbar>
    </div>
    <div class="flex flex-wrap items-end gap-6">
      <OraToolbar
        v-for="color in ['standard', 'vibrant'] as const"
        :key="color"
        :label="`Floating ${color}`"
        :color="color"
      >
        <OraIconButton :label="`Edit, ${color}`"><IconPencil /></OraIconButton>
        <OraIconButton :label="`Copy, ${color}`"><IconCopy /></OraIconButton>
        <OraIconButton :label="`Print, ${color}`"><IconPrint /></OraIconButton>
        <template v-if="color === 'vibrant'" #fab>
          <OraFab label="Add" color="tertiary-container"><IconPlus /></OraFab>
        </template>
      </OraToolbar>
      <OraToolbar label="Floating vertical" vertical>
        <OraIconButton label="Edit, vertical"><IconPencil /></OraIconButton>
        <OraIconButton label="Copy, vertical"><IconCopy /></OraIconButton>
      </OraToolbar>
    </div>
    <div class="flex h-72 items-end justify-end">
      <OraFabMenu label="Create" :items="actions" @select="chosen = $event">
        <template #icon><IconPlus /></template>
      </OraFabMenu>
    </div>
  </OraCard>
</template>
