<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, useTemplateRef, watch } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconLock from '@/components/icons/IconLock.vue'
import AmountField from '@/components/transaction/AmountField.vue'
import { gridChoices } from '@/components/transaction/categories'
import CategoryGrid from '@/components/transaction/CategoryGrid.vue'
import CategorySheet from '@/components/transaction/CategorySheet.vue'
import DatePicker from '@/components/transaction/DatePicker.vue'
import WalletPicker from '@/components/transaction/WalletPicker.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraButtonGroup from '@/components/ui/button-group/OraButtonGroup.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraSheet from '@/components/ui/sheet/OraSheet.vue'
import OraSnackbar from '@/components/ui/snackbar/OraSnackbar.vue'
import OraSplitButton from '@/components/ui/split-button/OraSplitButton.vue'
import OraTextArea from '@/components/ui/text-area/OraTextArea.vue'
import { homeData } from '@/data/home'
import { newTransactionData, type TransactionType } from '@/data/newTransaction'
import { useWalletsStore } from '@/stores/wallets'
import { addDays, formatDayMonth, formatWeekday, type IsoDate } from '@/utils/date'
import { formatRupiah } from '@/utils/rupiah'

type DateChoice = 'yesterday' | 'today' | 'pick'

const {
  today,
  wallets: listed,
  defaultWallet,
  defaultTransfer,
  categories,
  gridSize,
  quickAmounts,
} = newTransactionData

const walletStore = useWalletsStore()
/** The wallets that are awake: the form's own order first, then new or renamed ones. */
const wallets = computed(() => {
  const awake = walletStore.list.filter((item) => !item.sleeping)
  const known = listed.filter((item) => awake.some((other) => other.name === item.name))
  const added = awake.filter((item) => !listed.some((other) => other.name === item.name))
  return [...known, ...added.map(({ name, family }) => ({ name, family }))]
})

/** `name` if that wallet can be used, or else the first one that can. */
function usable(name: string) {
  return wallets.value.some((item) => item.name === name) ? name : (wallets.value[0]?.name ?? '')
}

const types: { value: TransactionType; label: string; glyph: string }[] = [
  { value: 'expense', label: 'Expense', glyph: '−' },
  { value: 'income', label: 'Income', glyph: '+' },
  { value: 'transfer', label: 'Transfer', glyph: '⇄' },
]
const saveOptions = [
  { value: 'another', label: 'Save & add another' },
  { value: 'recurring', label: 'Save as recurring' },
]

/** The form asks to be closed; its draft goes with it. */
const emit = defineEmits<{ close: [] }>()

const titleId = useId()
const notesId = useId()

const type = ref<TransactionType>('expense')
const amount = ref(0)
const category = ref<string>()
const wallet = ref(usable(defaultWallet))
const from = ref(usable(defaultTransfer.from))
const to = ref(usable(defaultTransfer.to))
const notes = ref('')

const dateChoice = ref<DateChoice>('today')
/** The day confirmed in the date picker, kept while another choice is selected. */
const pickedDate = ref<IsoDate>()
const date = computed(() => {
  if (dateChoice.value === 'yesterday') return addDays(today, -1)
  return dateChoice.value === 'pick' && pickedDate.value ? pickedDate.value : today
})
const dateOptions = computed<{ value: DateChoice; label: string }[]>(() => [
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'today', label: `Today, ${formatDayMonth(today)}` },
  { value: 'pick', label: pickedDate.value ? formatWeekday(pickedDate.value) : 'Pick date…' },
])
const pickerOpen = ref(false)
const categoriesOpen = ref(false)

const typeName = computed(() => types.find((option) => option.value === type.value)!.label)
const categoryList = computed(() => (type.value === 'transfer' ? [] : categories[type.value]))
const choices = computed(() =>
  type.value === 'transfer'
    ? []
    : gridChoices(categoryList.value, gridSize[type.value], category.value),
)

// Errors show from the first attempt to save.
const tried = ref(false)
const amountError = computed(() =>
  tried.value && !amount.value ? 'Enter an amount above Rp 0' : undefined,
)
const categoryError = computed(() =>
  tried.value && !category.value ? 'Choose a category' : undefined,
)
const sameWallet = computed(() => type.value === 'transfer' && from.value === to.value)

/** Text of the confirmation; empty while there is none. */
const savedMessage = ref('')

// The confirmation is about what was saved, so any change to the form dismisses it.
watch([type, amount, category, wallet, from, to, date, notes], () => (savedMessage.value = ''))

function pickType(value: TransactionType) {
  if (value === type.value) return
  type.value = value
  category.value = undefined
}

const dateSection = useTemplateRef('dateSection')

/** Returns focus to the date buttons when the picker leaves. */
async function focusDate() {
  await nextTick()
  const pressed = dateSection.value?.querySelector<HTMLElement>('[aria-pressed="true"]')
  pressed?.focus({ preventScroll: true })
}

function pickDateChoice(choice: DateChoice) {
  if (choice === 'pick') {
    pickerOpen.value = !pickerOpen.value
  } else {
    dateChoice.value = choice
    pickerOpen.value = false
  }
}

function closePicker(confirmed?: IsoDate) {
  if (confirmed) {
    pickedDate.value = confirmed
    dateChoice.value = 'pick'
  }
  pickerOpen.value = false
  focusDate()
}

function pickCategory(key: string) {
  category.value = key
  categoriesOpen.value = false
}

/** Nothing is stored yet: a valid form only shows the confirmation. */
function save() {
  tried.value = true
  const complete = type.value === 'transfer' ? !sameWallet.value : !!category.value
  savedMessage.value =
    amount.value && complete
      ? `${typeName.value} ${formatRupiah(amount.value)} saved · encrypted on this device`
      : ''
}

/** Closes the sheet on top: the category list first, then the form and its draft. */
function dismiss() {
  if (categoriesOpen.value) categoriesOpen.value = false
  else emit('close')
}

// Escape backs out one layer at a time. Menus stop the event before it gets here.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (!categoriesOpen.value && pickerOpen.value) closePicker()
  else dismiss()
}

const root = useTemplateRef('root')

// As on Android, a tap outside an open menu only closes that menu. The press is checked before the
// menu has reacted to it.
let pressClosesMenu = false

function onScrimPointerdown() {
  pressClosesMenu = !!root.value?.querySelector('[role="menu"], [role="listbox"]')
}

function onScrimClick() {
  if (!pressClosesMenu) dismiss()
}

const amountField = useTemplateRef('amountField')

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  amountField.value?.focus()
})
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<!-- A sheet over the page it was opened from; App.vue makes that page inert. -->
<template>
  <div ref="root" class="fixed inset-0 z-40 overflow-clip">
    <!-- Keyboard users dismiss with Escape or the Close button. -->
    <div
      aria-hidden="true"
      data-testid="scrim"
      class="absolute inset-0 bg-scrim [transition:opacity_var(--motion-slow-effects)] starting:opacity-0 sheet-leaving:opacity-0"
      :class="categoriesOpen ? 'opacity-40' : 'opacity-32'"
      @pointerdown="onScrimPointerdown"
      @click="onScrimClick"
    ></div>

    <OraSheet
      :title-id="titleId"
      title="New transaction"
      overline="Transactions"
      :covered="categoriesOpen"
      class="w-[min(580px,calc(100%-32px))] origin-right [transition:translate_var(--motion-default-spatial),scale_var(--motion-default-spatial)] starting:translate-x-[calc(100%+32px)] sheet-leaving:translate-x-[calc(100%+32px)]"
      :class="categoriesOpen && '-translate-x-10 scale-94'"
      @uncover="categoriesOpen = false"
    >
      <template #action>
        <OraIconButton
          label="Close"
          class="bg-surface-container-high text-on-surface!"
          @click="emit('close')"
        >
          <IconClose />
        </OraIconButton>
      </template>

      <form class="flex flex-col gap-5.5 px-6 pt-2 pb-6" novalidate @submit.prevent="save">
        <OraButtonGroup
          label="Transaction type"
          size="m"
          fill
          :options="types"
          :selected="type"
          @select="pickType"
        >
          <template #icon="{ option }">
            <span aria-hidden="true" class="text-[18px] leading-none">
              {{ types.find((item) => item.value === option.value)?.glyph }}
            </span>
          </template>
        </OraButtonGroup>

        <AmountField
          ref="amountField"
          v-model="amount"
          :type="type"
          :quick-amounts="quickAmounts"
          :error="amountError"
        />

        <div v-if="type === 'transfer'" class="flex flex-col gap-4">
          <WalletPicker v-model="from" label="From wallet" :wallets="wallets" />
          <WalletPicker v-model="to" label="To wallet" :wallets="wallets" />
          <span
            v-if="sameWallet"
            role="alert"
            class="-mt-1.5 px-3 text-[13px] leading-4.5 font-semibold text-error"
          >
            Pick two different wallets
          </span>
        </div>
        <template v-else>
          <CategoryGrid
            v-model="category"
            :choices="choices"
            :more-open="categoriesOpen"
            :error="categoryError"
            @more="categoriesOpen = true"
          />
          <WalletPicker
            v-model="wallet"
            label="Wallet"
            :wallets="wallets"
            :family-name="homeData.user.family"
          />
        </template>

        <div ref="dateSection" class="flex flex-col gap-2.5">
          <span class="text-title-small font-semibold">Date</span>
          <OraButtonGroup
            label="Date"
            selection="toggle"
            :options="dateOptions"
            :selected="dateChoice"
            @select="pickDateChoice"
          />
          <DatePicker
            v-if="pickerOpen"
            class="mt-1"
            :initial="pickedDate ?? date"
            :today="today"
            :years="newTransactionData.years"
            :activity-on="newTransactionData.activityOn"
            @confirm="closePicker"
            @cancel="closePicker()"
          />
        </div>

        <OraTextArea
          :id="notesId"
          v-model="notes"
          label="Notes (optional)"
          placeholder="e.g. Lunch with team"
        />

        <span class="flex items-center gap-2 text-body-small text-on-surface-variant">
          <IconLock class="size-3.5 flex-none" stroke-width="2.2" />
          Encrypted on this device before it syncs.
        </span>
      </form>

      <template #footer>
        <footer
          class="relative flex items-center justify-between gap-3 bg-surface-container px-6 pt-4 pb-6"
        >
          <OraSnackbar
            v-if="savedMessage"
            action="Undo"
            class="absolute inset-x-6 bottom-full"
            @action="savedMessage = ''"
          >
            <template #icon><IconCheck /></template>
            {{ savedMessage }}
          </OraSnackbar>
          <OraButton variant="text" size="m" class="text-error!" @click="emit('close')">
            Cancel
          </OraButton>
          <OraSplitButton
            label="Save"
            menu-label="More save options"
            :items="saveOptions"
            @click="save"
            @select="save"
          >
            <template #icon><IconCheck /></template>
          </OraSplitButton>
        </footer>
      </template>
    </OraSheet>

    <CategorySheet
      :open="categoriesOpen"
      :type-name="typeName"
      :categories="categoryList"
      :selected="category"
      @select="pickCategory"
      @close="categoriesOpen = false"
    />
  </div>
</template>
