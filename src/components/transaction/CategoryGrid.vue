<script setup lang="ts">
import { useId } from 'vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import CategoryIcon from '@/components/ui/category-icon/CategoryIcon.vue'
import { onRadioKeydown, radioTabindex } from '@/components/ui/shared/radioGroup'
import type { CategoryChoice } from './categories'

const props = defineProps<{
  choices: CategoryChoice[]
  /** Whether the full list, opened by "More", is showing. */
  moreOpen: boolean
  error?: string
}>()

/** Key of the picked category. */
const picked = defineModel<string>()

defineEmits<{ more: [] }>()

const labelId = useId()
const errorId = useId()

function tabindex(index: number) {
  return radioTabindex(
    props.choices.map((choice) => choice.key),
    picked.value,
    index,
  )
}
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex items-center justify-between">
      <span :id="labelId" class="text-title-small font-semibold">Category</span>
      <OraButton
        variant="text"
        class="-my-2 -mr-2 gap-0.5! pr-2! pl-3.5!"
        aria-haspopup="dialog"
        :aria-expanded="moreOpen"
        @click="$emit('more')"
      >
        More
        <IconChevronRight />
      </OraButton>
    </div>
    <div
      role="radiogroup"
      :aria-labelledby="labelId"
      :aria-describedby="error ? errorId : undefined"
      class="grid grid-cols-4 gap-1 rounded-corner-xl p-1 sm:gap-2 [transition:box-shadow_var(--motion-fast-effects)]"
      :class="error && 'inset-ring-3 inset-ring-error'"
      @keydown="onRadioKeydown"
    >
      <button
        v-for="(choice, index) in choices"
        :key="choice.key"
        type="button"
        role="radio"
        :aria-checked="choice.key === picked"
        :tabindex="tabindex(index)"
        class="state-layer focus-ring transition-morph flex min-w-0 cursor-pointer flex-col items-center gap-2 px-0.5 pt-3.5 pb-3 text-center text-label-small font-semibold tracking-normal active:rounded-corner-md sm:px-1.5 sm:text-[12px]"
        :class="
          choice.key === picked
            ? 'rounded-corner-xl bg-secondary-container text-on-secondary-container'
            : 'rounded-[18px] bg-surface-container-lowest text-on-surface'
        "
        @click="picked = choice.key"
      >
        <CategoryIcon :category="choice.category" />
        <span class="max-w-full wrap-break-word">{{ choice.name }}</span>
      </button>
    </div>
    <span
      v-if="error"
      :id="errorId"
      role="alert"
      class="px-3 text-[13px] leading-4.5 font-semibold text-error"
    >
      {{ error }}
    </span>
  </div>
</template>
