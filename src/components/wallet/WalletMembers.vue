<script setup lang="ts">
import { computed } from 'vue'
import IconShield from '@/components/icons/IconShield.vue'
import IconUserPlus from '@/components/icons/IconUserPlus.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraList from '@/components/ui/list/OraList.vue'
import OraListItem from '@/components/ui/list/OraListItem.vue'
import type { WalletMember } from '@/data/wallets'
import { formatRupiah } from '@/utils/rupiah'

const props = defineProps<{
  members: WalletMember[]
  hidden?: boolean
}>()

defineEmits<{ add: [] }>()

const shapes = ['rounded-full', 'rounded-corner-lg', 'rounded-[50%_50%_50%_14px]']
const colors = [
  'bg-primary text-on-primary',
  'bg-tertiary text-on-tertiary',
  'bg-success text-on-success',
]

const most = computed(() => Math.max(...props.members.map((member) => member.spent), 1))

const rows = computed(() =>
  props.members.map((member, index) => ({
    ...member,
    avatar: [
      member.role === 'Invited'
        ? 'bg-warning-container text-on-warning-container'
        : colors[index % colors.length],
      shapes[index % shapes.length],
    ],
    badge:
      member.role === 'Owner'
        ? 'bg-primary-container text-on-primary-container'
        : member.role === 'Invited'
          ? 'bg-warning-container text-on-warning-container'
          : 'bg-surface-container-high text-on-surface-variant',
    share: `${(member.spent / most.value) * 100}%`,
    spentText: props.hidden ? 'Rp ••••' : formatRupiah(member.spent),
  })),
)
</script>

<template>
  <div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
    <OraCard class="gap-4 px-4 pt-6 pb-4" aria-labelledby="members-title">
      <div class="flex flex-wrap items-center justify-between gap-3 px-2">
        <div class="flex flex-col gap-1">
          <h2 id="members-title" class="text-title-large font-semibold">
            Members · {{ members.length }}
          </h2>
          <p class="text-body-medium text-on-surface-variant">
            Everyone here can see and add transactions to this wallet.
          </p>
        </div>
        <OraButton aria-haspopup="dialog" @click="$emit('add')">
          <IconUserPlus />
          Add member
        </OraButton>
      </div>

      <OraList>
        <OraListItem v-for="member in rows" :key="member.email">
          <template #leading>
            <span
              aria-hidden="true"
              class="flex size-12 items-center justify-center text-title-medium font-semibold"
              :class="member.avatar"
            >
              {{ member.name.charAt(0) }}
            </span>
          </template>
          <template #headline>{{ member.name }}</template>
          <template #supporting>{{ member.email }}</template>
          <template #trailing>
            <span class="flex flex-col items-start gap-1 sm:items-end">
              <span
                class="inline-flex h-6 items-center rounded-full px-2.5 text-label-medium font-semibold"
                :class="member.badge"
              >
                {{ member.role }}
              </span>
              <span class="text-body-small text-on-surface-variant tabular-nums">
                {{ member.transactions }} transactions
              </span>
            </span>
          </template>
        </OraListItem>
      </OraList>
    </OraCard>

    <OraCard variant="tertiary" class="gap-4 p-6" aria-labelledby="share-title">
      <h2 id="share-title" class="text-title-large font-semibold">Spending by member</h2>
      <div v-for="member in rows" :key="member.email" class="flex flex-col gap-1.5">
        <div class="flex justify-between gap-2 text-label-large">
          <span class="font-semibold">{{ member.name }}</span>
          <span class="tabular-nums">{{ member.spentText }}</span>
        </div>
        <span class="h-2.5 overflow-hidden rounded-full bg-on-tertiary-container/12">
          <span class="block h-full rounded-full bg-tertiary" :style="{ width: member.share }">
          </span>
        </span>
      </div>
      <p class="flex items-center gap-2 text-body-small">
        <IconShield class="size-4 flex-none" />
        Shared with end-to-end encryption between members.
      </p>
    </OraCard>
  </div>
</template>
