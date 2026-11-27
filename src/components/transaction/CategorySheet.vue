<script setup lang="ts">
import { computed, nextTick, reactive, useId, useTemplateRef, watch } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppSheet from '@/components/ui/AppSheet.vue'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'
import type { CategoryOption } from '@/data/newTransaction'
import { categoryChoice } from './categories'

const props = defineProps<{
  open: boolean
  /** "Expense" or "Income". */
  typeName: string
  categories: CategoryOption[]
  /** Key of the picked category. */
  selected?: string
}>()

const emit = defineEmits<{
  select: [key: string]
  close: []
}>()

const titleId = useId()
const list = useTemplateRef('list')

/** Categories whose subcategories show. */
const expanded = reactive(new Set(['salary']))

function toggle(category: string) {
  if (!expanded.delete(category)) expanded.add(category)
}

const rows = computed(() =>
  props.categories.flatMap((option) => {
    const open = expanded.has(option.category)
    const parent = {
      ...categoryChoice(option),
      child: false,
      expandable: !!option.subcategories,
      open,
    }
    const children = open
      ? (option.subcategories ?? []).map((subcategory) => ({
          ...categoryChoice(option, subcategory),
          child: true,
          expandable: false,
          open: false,
        }))
      : []
    return [parent, ...children]
  }),
)

// Focus moves into the sheet when it opens, and back to where it was when it closes.
let opener: HTMLElement | null = null
watch(
  () => props.open,
  async (open) => {
    if (open) opener = document.activeElement as HTMLElement | null
    await nextTick()
    if (!open) return opener?.focus({ preventScroll: true })
    const target =
      list.value?.querySelector<HTMLElement>('[aria-pressed="true"]') ??
      list.value?.querySelector<HTMLElement>('[aria-pressed]')
    target?.focus({ preventScroll: true })
  },
  { immediate: true },
)
</script>

<!-- The second level of the sheet stack: every category, with its subcategories. -->
<template>
  <AppSheet
    :title-id="titleId"
    title="Category"
    :overline="`New transaction · ${typeName}`"
    :inert="!open || undefined"
    class="z-10 w-[min(460px,calc(100%-32px))] sheet-leaving:translate-x-[calc(100%+32px)]"
    :class="
      open
        ? '[transition:translate_var(--motion-default-spatial)]'
        : 'invisible translate-x-[calc(100%+32px)] [transition:translate_var(--motion-default-spatial),visibility_0s_linear_500ms]'
    "
  >
    <span
      aria-hidden="true"
      class="absolute top-1/2 left-2 -mt-5 h-10 w-1 rounded-full bg-outline-variant"
    ></span>

    <ul
      ref="list"
      :aria-label="`${typeName} categories`"
      class="flex flex-col gap-0.5 px-4 pt-1 pb-4"
    >
      <li
        v-for="row in rows"
        :key="row.key"
        class="flex items-center gap-1"
        :class="row.child && 'pl-11'"
      >
        <button
          type="button"
          :aria-pressed="row.key === selected"
          class="state-layer focus-ring transition-morph flex h-14 min-w-0 flex-1 cursor-pointer items-center gap-4 pr-4 pl-3 text-left text-body-large active:rounded-corner-md"
          :class="
            row.key === selected
              ? 'rounded-corner-lg bg-secondary-container font-semibold text-on-secondary-container'
              : 'rounded-corner-xl text-on-surface'
          "
          @click="emit('select', row.key)"
        >
          <CategoryIcon :category="row.category" />
          <span class="min-w-0 flex-1 truncate">{{ row.name }}</span>
          <IconCheck v-if="row.key === selected" class="size-5 flex-none" />
        </button>
        <AppIconButton
          v-if="row.expandable"
          :label="`${row.open ? 'Collapse' : 'Expand'} ${row.name}`"
          :aria-expanded="row.open"
          @click="toggle(row.category)"
        >
          <IconChevronDown
            class="[transition:rotate_var(--motion-fast-spatial)]"
            :class="row.open && 'rotate-180'"
          />
        </AppIconButton>
        <span v-else aria-hidden="true" class="w-10 flex-none"></span>
      </li>
    </ul>

    <template #footer>
      <footer class="px-6 pt-4 pb-6">
        <AppButton
          variant="outlined"
          size="m"
          class="w-full border-outline!"
          @click="emit('close')"
        >
          Cancel
        </AppButton>
      </footer>
    </template>
  </AppSheet>
</template>
