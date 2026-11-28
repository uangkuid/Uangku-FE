<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import { MONTH_NAMES } from '@/utils/date'
import OraIconButton from '../icon-button/OraIconButton.vue'
import { onRadioKeydown, radioTabindex } from '../shared/radioGroup'

const props = defineProps<{
  /** 0 for January. */
  month: number
  disablePrevious?: boolean
  disableNext?: boolean
}>()

defineEmits<{
  select: [month: number]
  /** The arrows: one month back or forth, which may leave the year. */
  step: [months: 1 | -1]
}>()

const row = useTemplateRef('row')

/** Scrolls the month on screen to the middle of its row, and nothing around the row. */
function center(behavior?: ScrollBehavior) {
  const strip = row.value
  const chip = strip?.querySelector<HTMLElement>('[aria-checked="true"]')
  if (!strip || !chip) return
  const left = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2
  strip.scrollTo?.({ left, behavior })
}

// After the render, which is when the new month's chip is the checked one.
watch(
  () => props.month,
  () => center(),
  { flush: 'post' },
)

onMounted(() => center('instant'))
</script>

<!-- The months of a year in one scrolling row, between two arrows. -->
<template>
  <div class="flex items-center gap-1">
    <OraIconButton label="Previous month" :disabled="disablePrevious" @click="$emit('step', -1)">
      <IconChevronLeft class="size-5.5!" />
    </OraIconButton>
    <!-- Scrolls sideways and fades at both ends. The vertical padding leaves room for focus. -->
    <div
      ref="row"
      role="radiogroup"
      aria-label="Month"
      class="relative -my-1 flex min-w-0 flex-1 snap-x snap-proximity scroll-smooth gap-1.5 overflow-x-auto [mask-image:linear-gradient(90deg,transparent,black_16px,black_calc(100%-16px),transparent)] px-4 py-1.5 [scrollbar-width:none] motion-reduce:scroll-auto"
      @keydown="onRadioKeydown"
    >
      <button
        v-for="(name, index) in MONTH_NAMES"
        :key="name"
        type="button"
        role="radio"
        :aria-checked="index === month"
        :tabindex="radioTabindex([...MONTH_NAMES.keys()], month, index)"
        class="state-layer focus-ring transition-morph h-10 min-w-14 flex-none cursor-pointer snap-center border px-3.5 text-label-large font-semibold active:rounded-corner-sm"
        :class="
          index === month
            ? 'rounded-corner-md border-primary bg-primary text-on-primary'
            : 'rounded-[20px] border-outline-variant text-primary'
        "
        @click="$emit('select', index)"
      >
        {{ name }}
      </button>
    </div>
    <OraIconButton label="Next month" :disabled="disableNext" @click="$emit('step', 1)">
      <IconChevronRight class="size-5.5!" />
    </OraIconButton>
  </div>
</template>
