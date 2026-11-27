<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import IconBell from '@/components/icons/IconBell.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconMail from '@/components/icons/IconMail.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconWallet from '@/components/icons/IconWallet.vue'
import OraAvatar from '@/components/ui/avatar/OraAvatar.vue'
import OraBadge from '@/components/ui/badge/OraBadge.vue'
import OraBanner from '@/components/ui/banner/OraBanner.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraButtonGroup from '@/components/ui/button-group/OraButtonGroup.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraChip from '@/components/ui/chip/OraChip.vue'
import OraCircularProgress from '@/components/ui/circular-progress/OraCircularProgress.vue'
import OraDivider from '@/components/ui/divider/OraDivider.vue'
import OraFab from '@/components/ui/fab/OraFab.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraLinearProgress from '@/components/ui/linear-progress/OraLinearProgress.vue'
import OraList from '@/components/ui/list/OraList.vue'
import OraListItem from '@/components/ui/list/OraListItem.vue'
import OraNavRailItem from '@/components/ui/nav-rail-item/OraNavRailItem.vue'
import OraSheet from '@/components/ui/sheet/OraSheet.vue'
import OraSnackbar from '@/components/ui/snackbar/OraSnackbar.vue'
import OraSplitButton from '@/components/ui/split-button/OraSplitButton.vue'
import OraTag from '@/components/ui/tag/OraTag.vue'
import OraTextArea from '@/components/ui/text-area/OraTextArea.vue'
import OraTextField from '@/components/ui/text-field/OraTextField.vue'
import CategoryIcon from '@/components/ui/category-icon/CategoryIcon.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'

const dark = ref(false)
watch(dark, (isDark) => {
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
})
// The theme switch only applies to this page.
onUnmounted(() => delete document.documentElement.dataset.theme)

const buttonVariants = ['filled', 'tonal', 'elevated', 'outlined', 'text'] as const
const iconButtonVariants = ['filled', 'tonal', 'outlined', 'standard'] as const
const sizes = ['xs', 's', 'm', 'l', 'xl'] as const
const widths = ['narrow', 'default', 'wide'] as const
const fabSizes = ['default', 'medium', 'large'] as const
const cardVariants = ['filled', 'elevated', 'outlined', 'primary', 'tertiary'] as const
const tones = ['success', 'info', 'warning', 'error'] as const

const colors = [
  'bg-primary text-on-primary',
  'bg-primary-container text-on-primary-container',
  'bg-secondary text-on-secondary',
  'bg-secondary-container text-on-secondary-container',
  'bg-tertiary text-on-tertiary',
  'bg-tertiary-container text-on-tertiary-container',
  'bg-error text-on-error',
  'bg-error-container text-on-error-container',
  'bg-success-container text-on-success-container',
  'bg-warning-container text-on-warning-container',
  'bg-info-container text-on-info-container',
  'bg-surface text-on-surface',
  'bg-surface-container-low text-on-surface',
  'bg-surface-container text-on-surface',
  'bg-surface-container-highest text-on-surface',
  'bg-inverse-surface text-inverse-on-surface',
]

const typeScale = [
  'text-display-small font-display',
  'text-headline-large',
  'text-headline-medium',
  'text-headline-small',
  'text-title-large',
  'text-title-medium',
  'text-title-small',
  'text-body-large',
  'text-body-medium',
  'text-body-small',
  'text-label-large',
  'text-label-medium',
  'text-label-small',
]

const shapes = [
  'rounded-corner-none',
  'rounded-corner-xs',
  'rounded-corner-sm',
  'rounded-corner-md',
  'rounded-corner-lg',
  'rounded-corner-lg-inc',
  'rounded-corner-xl',
  'rounded-corner-xl-inc',
  'rounded-corner-xxl',
  'rounded-full',
]

const selected = ref(false)
const text = ref('')
const progress = ref(40)
const current = ref('Home')
const period = ref('week')
const periods = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]
const notes = ref('')
</script>

<template>
  <main class="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-8">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="font-display text-display-small font-bold">Uangku design system</h1>
        <p class="text-body-large text-on-surface-variant">
          Material 3 Expressive components with the Uangku theme.
        </p>
      </div>
      <OraButton variant="tonal" :selected="dark" @click="dark = !dark">Dark theme</OraButton>
    </header>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-color">
      <h2 id="ds-color" class="text-title-large font-medium">Color roles</h2>
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-2">
        <li
          v-for="color in colors"
          :key="color"
          class="rounded-corner-md border border-outline-variant px-3 py-4 text-label-medium"
          :class="color"
        >
          {{ color.split(' ')[0]?.replace('bg-', '') }}
        </li>
      </ul>
    </OraCard>

    <OraCard variant="outlined" class="gap-3 p-5" aria-labelledby="ds-type">
      <h2 id="ds-type" class="text-title-large font-medium">Type scale</h2>
      <p v-for="style in typeScale" :key="style" :class="style">{{ style.split(' ')[0] }}</p>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-shape">
      <h2 id="ds-shape" class="text-title-large font-medium">Shape scale</h2>
      <ul class="flex flex-wrap gap-3">
        <li v-for="shape in shapes" :key="shape" class="flex flex-col items-center gap-1">
          <span class="size-20 bg-primary-container" :class="shape"></span>
          <span class="text-label-small">{{ shape.replace('rounded-', '') }}</span>
        </li>
      </ul>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-button">
      <h2 id="ds-button" class="text-title-large font-medium">Buttons</h2>
      <div class="flex flex-wrap items-center gap-3">
        <OraButton v-for="variant in buttonVariants" :key="variant" :variant="variant">
          {{ variant }}
        </OraButton>
        <OraButton disabled>disabled</OraButton>
      </div>
      <div class="flex flex-wrap items-center gap-3 overflow-x-auto">
        <OraButton v-for="size in sizes" :key="size" :size="size">
          <IconPlus />{{ size }}
        </OraButton>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <OraButton shape="square" variant="tonal">square</OraButton>
        <OraButton :selected="selected" @click="selected = !selected">toggle</OraButton>
        <OraButton variant="outlined" :selected="selected" @click="selected = !selected">
          toggle
        </OraButton>
      </div>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-icon-button">
      <h2 id="ds-icon-button" class="text-title-large font-medium">Icon buttons</h2>
      <div class="flex flex-wrap items-center gap-3">
        <OraIconButton
          v-for="variant in iconButtonVariants"
          :key="variant"
          :variant="variant"
          :label="variant"
        >
          <IconBell />
        </OraIconButton>
        <OraIconButton
          variant="filled"
          label="Toggle visibility"
          :selected="selected"
          @click="selected = !selected"
        >
          <IconEye :off="selected" />
        </OraIconButton>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <OraIconButton
          v-for="size in sizes"
          :key="size"
          variant="tonal"
          :size="size"
          :label="`Size ${size}`"
        >
          <IconBell />
        </OraIconButton>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <OraIconButton
          v-for="width in widths"
          :key="width"
          variant="tonal"
          :width="width"
          :label="`Width ${width}`"
        >
          <IconBell />
        </OraIconButton>
        <OraIconButton label="Notifications, 3 new">
          <IconBell />
          <OraBadge :label="3" class="absolute top-1 right-0.5" />
        </OraIconButton>
      </div>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-group">
      <h2 id="ds-group" class="text-title-large font-medium">
        Button groups, chips and split button
      </h2>
      <OraButtonGroup
        label="Period"
        size="m"
        fill
        :options="periods"
        :selected="period"
        @select="period = $event"
      />
      <OraButtonGroup
        label="Compact period"
        selection="toggle"
        :options="periods"
        :selected="period"
        @select="period = $event"
      />
      <div class="flex flex-wrap items-center gap-3">
        <OraChip :selected="selected" @click="selected = !selected">Filter chip</OraChip>
        <OraChip :selected="!selected" @click="selected = !selected">Other chip</OraChip>
        <OraSplitButton
          label="Save"
          menu-label="More save options"
          :items="[{ value: 'another', label: 'Save & add another' }]"
        />
      </div>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-fab">
      <h2 id="ds-fab" class="text-title-large font-medium">FAB and extended FAB</h2>
      <div class="flex flex-wrap items-center gap-4">
        <OraFab v-for="size in fabSizes" :key="size" :size="size" :label="`New ${size}`">
          <IconPlus />
        </OraFab>
        <OraFab extended label="New transaction"><IconPlus /></OraFab>
        <OraFab extended color="primary" label="New wallet"><IconWallet /></OraFab>
      </div>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-field">
      <h2 id="ds-field" class="text-title-large font-medium">Text fields</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <OraTextField
          id="ds-enabled"
          v-model="text"
          label="Email"
          placeholder="name@email.com"
          supporting-text="We never share it."
        >
          <template #icon><IconMail /></template>
        </OraTextField>
        <OraTextField id="ds-error" v-model="text" label="Error" error="Email is required" />
        <OraTextField id="ds-readonly" model-value="Read only" label="Read only" readonly />
        <OraTextField id="ds-disabled" model-value="Disabled" label="Disabled" disabled />
      </div>
      <OraTextArea id="ds-notes" v-model="notes" label="Notes" placeholder="Multi-line text" />
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-card">
      <h2 id="ds-card" class="text-title-large font-medium">Cards</h2>
      <div class="grid gap-3 sm:grid-cols-3">
        <OraCard
          v-for="variant in cardVariants"
          :key="variant"
          as="div"
          :variant="variant"
          class="p-6"
        >
          {{ variant }}
        </OraCard>
      </div>
    </OraCard>

    <OraCard variant="filled" class="gap-4 p-5" aria-labelledby="ds-list">
      <h2 id="ds-list" class="text-title-large font-medium">Segmented list</h2>
      <OraList>
        <OraListItem as="button">
          <template #leading><CategoryIcon category="salary" /></template>
          <template #headline>Salary</template>
          <template #supporting><OraTag>Bank</OraTag><FamilyIcon /></template>
          <template #trailing>+Rp 2.500.000</template>
        </OraListItem>
        <OraListItem as="button">
          <template #leading><CategoryIcon category="food" /></template>
          <template #headline>Food</template>
          <template #supporting>Lunch</template>
        </OraListItem>
        <OraListItem>
          <template #headline>Static item</template>
        </OraListItem>
      </OraList>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-progress">
      <h2 id="ds-progress" class="text-title-large font-medium">Progress indicators</h2>
      <OraLinearProgress :value="progress" label="Example progress" />
      <OraLinearProgress :value="progress" label="Thick example progress" :thickness="12" />
      <div class="flex flex-wrap items-center gap-4">
        <OraCircularProgress :value="progress" label="Example ring" />
        <OraCircularProgress :value="progress" label="Large ring" :size="96" :thickness="10">
          <span class="text-label-large">{{ progress }}%</span>
        </OraCircularProgress>
        <OraButton variant="tonal" @click="progress = (progress + 20) % 120">Advance</OraButton>
      </div>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-nav">
      <h2 id="ds-nav" class="text-title-large font-medium">Navigation rail items</h2>
      <div class="flex flex-wrap items-start gap-8">
        <div
          v-for="expanded in [false, true]"
          :key="String(expanded)"
          class="flex flex-col gap-1 rounded-corner-lg bg-surface-container py-3"
          :class="expanded ? 'w-60 px-3' : 'w-24'"
        >
          <OraNavRailItem
            v-for="item in [
              { label: 'Home', icon: IconHome },
              { label: 'Wallet', icon: IconWallet },
            ]"
            :key="item.label"
            :label="item.label"
            :icon="item.icon"
            :expanded="expanded"
            :aria-current="current === item.label ? 'page' : undefined"
            @click="current = item.label"
          />
        </div>
      </div>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-misc">
      <h2 id="ds-misc" class="text-title-large font-medium">Tags, avatar, dividers and banners</h2>
      <div class="flex flex-wrap items-center gap-3">
        <OraTag>Cash</OraTag>
        <OraTag color="primary" size="m">+Rp 2.000.000 this month</OraTag>
        <FamilyIcon />
        <OraAvatar initials="UK" />
        <OraButton variant="text">View all<IconChevronRight /></OraButton>
      </div>
      <OraDivider />
      <OraDivider>OR</OraDivider>
      <OraBanner v-for="tone in tones" :key="tone" :tone="tone">{{ tone }} message</OraBanner>
    </OraCard>

    <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-sheet">
      <h2 id="ds-sheet" class="text-title-large font-medium">Side sheet and snackbar</h2>
      <div class="relative h-80 overflow-hidden rounded-corner-lg bg-surface-dim">
        <OraSheet
          title-id="ds-sheet-example"
          title="Sheet title"
          overline="Overline"
          aria-modal="false"
          class="w-[min(420px,calc(100%-32px))]"
        >
          <p class="px-7 text-body-medium">The body of the sheet scrolls.</p>
          <template #footer>
            <footer class="p-4">
              <OraSnackbar action="Undo">Transaction saved</OraSnackbar>
            </footer>
          </template>
        </OraSheet>
      </div>
    </OraCard>
  </main>
</template>
