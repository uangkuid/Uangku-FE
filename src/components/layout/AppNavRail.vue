<script setup lang="ts">
import { ref, type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import logoUrl from '@/assets/uangku-logo.svg'
import IconFamily from '@/components/icons/IconFamily.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconLock from '@/components/icons/IconLock.vue'
import IconMenu from '@/components/icons/IconMenu.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconReport from '@/components/icons/IconReport.vue'
import IconTransactions from '@/components/icons/IconTransactions.vue'
import IconUser from '@/components/icons/IconUser.vue'
import IconWallet from '@/components/icons/IconWallet.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppDivider from '@/components/ui/AppDivider.vue'
import AppFab from '@/components/ui/AppFab.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppNavRailItem from '@/components/ui/AppNavRailItem.vue'
import ComingSoonLink from '@/components/ui/ComingSoonLink.vue'

defineProps<{
  user: { name: string; family: string; initials: string }
}>()

interface NavItem {
  label: string
  icon: Component
  /** Absent while the screen is not built. */
  to?: RouteLocationRaw
}

const mainItems: NavItem[] = [
  { label: 'Home', icon: IconHome, to: { name: 'home' } },
  { label: 'Transactions', icon: IconTransactions },
  { label: 'Wallet', icon: IconWallet },
  { label: 'Report', icon: IconReport },
]
const sharedItems: NavItem[] = [
  { label: 'Family', icon: IconFamily },
  { label: 'My Account', icon: IconUser },
]

/** Collapsed (icons over labels) or expanded (96px or 240px wide). */
const expanded = ref(false)
</script>

<template>
  <nav
    aria-label="Main"
    class="sticky top-0 flex h-dvh min-h-180 flex-none flex-col gap-2 self-start overflow-hidden bg-surface-container pt-5 pb-4 [transition:width_var(--motion-default-spatial),padding_var(--motion-default-spatial)]"
    :class="expanded ? 'w-60 px-3' : 'w-24 items-center'"
  >
    <div class="flex w-full items-center gap-2" :class="expanded ? 'pl-2' : 'flex-col'">
      <AppIconButton
        :label="expanded ? 'Collapse navigation' : 'Expand navigation'"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        <IconMenu />
      </AppIconButton>
      <RouterLink
        v-if="expanded"
        :to="{ name: 'home' }"
        class="focus-ring mr-auto ml-2 flex items-center rounded-corner-sm"
        aria-label="Uangku home"
      >
        <img :src="logoUrl" alt="Uangku" width="112" height="28" class="h-7 w-28" />
      </RouterLink>
    </div>

    <AppFab
      :as="RouterLink"
      :to="{ name: 'transaction-new' }"
      label="New transaction"
      :extended="expanded"
      class="mt-1 mb-4"
      :class="{ 'ml-1 self-start': expanded }"
    >
      <IconPlus />
    </AppFab>

    <div class="flex w-full flex-col" :class="expanded ? 'gap-0.5' : 'gap-1'">
      <template v-for="(items, group) in [mainItems, sharedItems]" :key="group">
        <template v-if="group === 1">
          <AppDivider :class="expanded ? 'mx-4 my-2' : 'my-1 w-10 self-center!'" />
          <span
            v-if="expanded"
            class="px-4 py-1 text-label-medium font-semibold text-on-surface-variant"
          >
            Shared
          </span>
        </template>

        <AppNavRailItem
          v-for="item in items"
          :key="item.label"
          :as="item.to ? RouterLink : ComingSoonLink"
          v-bind="item.to ? { to: item.to } : {}"
          :icon="item.icon"
          :label="item.label"
          :expanded="expanded"
        />
      </template>
    </div>

    <div class="mt-auto flex w-full flex-col gap-2.5" :class="{ 'items-center': !expanded }">
      <div
        class="flex items-center gap-3 bg-surface-container-lowest text-primary"
        :class="
          expanded
            ? 'rounded-corner-lg-inc px-3.5 py-3'
            : 'size-12 justify-center rounded-corner-lg'
        "
        title="End-to-end encrypted — only your devices can read your data."
      >
        <IconLock class="flex-none" width="20" height="20" />
        <span v-if="expanded" class="flex flex-col gap-0.5">
          <span class="text-label-medium font-semibold text-on-surface">End-to-end encrypted</span>
          <span class="text-body-small text-on-surface-variant">
            Only your devices can read your data.
          </span>
        </span>
      </div>
      <div class="flex items-center gap-3" :class="{ 'px-2 py-1': expanded }">
        <AppAvatar :initials="user.initials" />
        <span v-if="expanded" class="flex flex-col">
          <span class="text-title-small font-semibold">{{ user.name }}</span>
          <span class="text-body-small text-on-surface-variant">{{ user.family }}</span>
        </span>
      </div>
    </div>
  </nav>
</template>
