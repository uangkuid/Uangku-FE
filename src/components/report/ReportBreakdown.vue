<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import CategoryIcon from '@/components/ui/category-icon/CategoryIcon.vue'
import { reportData, type ReportGroup, type ReportKind } from '@/data/report'
import { formatRupiah } from '@/utils/rupiah'

const props = defineProps<{
  group: ReportGroup
  kind: ReportKind
}>()

/** Slice colors in order: [the CSS variable of the donut, the matching background utility]. */
const colors = [
  ['--primary', 'bg-primary'],
  ['--logo-blue', 'bg-logo-blue'],
  ['--tertiary', 'bg-tertiary'],
  ['--inverse-primary', 'bg-inverse-primary'],
  ['--warning', 'bg-warning'],
] as const

const trends = {
  good: 'bg-success-container text-on-success-container',
  bad: 'bg-error-container text-on-error-container',
  flat: 'bg-surface-container-high text-on-surface-variant',
}

const groupNames = {
  category: { one: 'category', many: 'categories' },
  wallet: { one: 'wallet', many: 'wallets' },
  member: { one: 'family member', many: 'members' },
}

const rows = computed(() =>
  reportData.breakdown[props.kind][props.group].map((row, index) => ({
    ...row,
    color: colors[index % colors.length]!,
  })),
)
const kindName = computed(() => (props.kind === 'expense' ? 'Expense' : 'Income'))
const title = computed(() => `${kindName.value} by ${groupNames[props.group].one}`)

/** A conic gradient with a thin gap between the slices. */
const donut = computed(() => {
  let passed = 0
  const stops = rows.value.flatMap((row) => {
    const start = passed * 3.6
    passed += row.percent
    const end = passed * 3.6
    return [
      `var(${row.color[0]}) ${start}deg ${end - 2}deg`,
      `var(--surface-container-lowest) ${end - 2}deg ${end}deg`,
    ]
  })
  return `conic-gradient(${stops.join(', ')})`
})

const donutLabel = computed(
  () => `${title.value}: ${rows.value.map((row) => `${row.name} ${row.percent}%`).join(', ')}`,
)
</script>

<!-- Where the month's money came from or went, as a donut and its list. -->
<template>
  <OraCard class="flex-row! flex-wrap gap-2 p-2" aria-labelledby="breakdown-title">
    <div
      class="flex flex-[1_1_240px] flex-col items-center gap-5 rounded-list-outer bg-surface-container-lowest p-6"
    >
      <h2 id="breakdown-title" class="self-start text-title-medium font-semibold">{{ title }}</h2>
      <div
        role="img"
        :aria-label="donutLabel"
        class="relative size-52 rounded-full"
        :style="{ background: donut }"
      >
        <div
          class="absolute inset-7.5 flex flex-col items-center justify-center rounded-full bg-surface-container-lowest"
        >
          <span class="text-body-small text-on-surface-variant">Total</span>
          <span class="font-display text-title-large font-bold tabular-nums">
            {{ reportData.breakdown[kind].total }}
          </span>
          <span class="text-body-small text-on-surface-variant">
            {{ rows.length }} {{ groupNames[group].many }}
          </span>
        </div>
      </div>
      <ul class="flex flex-col gap-2 self-stretch">
        <li v-for="row in rows" :key="row.name" class="flex items-center gap-2.5 text-[13px]">
          <span class="size-3 flex-none rounded-corner-xs" :class="row.color[1]"></span>
          <span class="flex-1">{{ row.name }}</span>
          <span class="font-semibold tabular-nums">{{ row.percent }}%</span>
        </li>
      </ul>
    </div>

    <div
      class="flex min-w-0 flex-[1.4_1_300px] flex-col rounded-list-outer bg-surface-container-lowest px-3 py-4"
    >
      <span class="px-3 pt-2 pb-3 text-title-small font-semibold">{{ kindName }} detail</span>
      <ul class="flex flex-col gap-0.5">
        <li v-for="row in rows" :key="row.name">
          <RouterLink
            :to="{ name: 'transactions' }"
            class="state-layer focus-ring grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3.5 rounded-corner-lg p-3"
          >
            <CategoryIcon v-if="row.category" :category="row.category" />
            <span
              v-else
              class="flex size-8 items-center justify-center rounded-corner-md text-[13px] font-bold text-on-primary"
              :class="row.color[1]"
            >
              {{ row.glyph }}
            </span>
            <span class="flex min-w-0 flex-col gap-0.5">
              <span class="text-[15px] leading-5.5 font-medium">{{ row.name }}</span>
              <span class="flex items-center gap-2">
                <span class="text-body-small font-semibold text-on-surface-variant">
                  {{ row.percent }}%
                </span>
                <span
                  v-if="row.change"
                  class="inline-flex h-5 items-center rounded-full px-2 text-label-small font-semibold"
                  :class="trends[row.change.trend]"
                >
                  {{ row.change.text }}
                </span>
              </span>
            </span>
            <span
              class="text-[15px] leading-5.5 font-semibold whitespace-nowrap tabular-nums"
              :class="kind === 'expense' ? 'text-error' : 'text-success'"
            >
              {{ formatRupiah(row.amount) }}
            </span>
            <IconChevronRight class="size-4.5" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </OraCard>
</template>
