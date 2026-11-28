<script setup lang="ts" generic="Item">
import { useTemplateRef } from 'vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import OraIconButton from '../icon-button/OraIconButton.vue'

type Variant = 'multi-browse' | 'hero' | 'uncontained'

const { variant = 'multi-browse' } = defineProps<{
  /** Accessible name. */
  label: string
  items: Item[]
  /**
   * `multi-browse` shows large items with a glimpse of the next ones, `hero` one item at a time
   * with a peek, and `uncontained` equal items that run off the edge.
   */
  variant?: Variant
}>()

defineSlots<{ item(props: { item: Item; index: number }): unknown }>()

const track = useTemplateRef('track')

const widthClasses: Record<Variant, string> = {
  'multi-browse': 'w-[min(18rem,70%)]',
  hero: 'w-[calc(100%-4.5rem)]',
  uncontained: 'w-44',
}

/** One item along, in either direction. */
function step(direction: 1 | -1) {
  const element = track.value
  const first = element?.firstElementChild as HTMLElement | null
  if (!element || !first) return
  element.scrollBy?.({ left: direction * (first.offsetWidth + 8), behavior: 'smooth' })
}
</script>

<!-- M3 carousel: a snapping row of items. The `item` slot draws each one. -->
<template>
  <section aria-roledescription="carousel" :aria-label="label" class="flex min-w-0 flex-col gap-2">
    <div
      ref="track"
      tabindex="0"
      class="focus-ring flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-corner-xl [scrollbar-width:none] motion-reduce:scroll-auto!"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${index + 1} of ${items.length}`"
        class="flex-none snap-start overflow-hidden rounded-corner-xl"
        :class="widthClasses[variant]"
      >
        <slot name="item" :item="item" :index="index" />
      </div>
    </div>
    <div class="flex justify-end gap-1">
      <OraIconButton variant="tonal" label="Previous items" @click="step(-1)">
        <IconChevronLeft class="size-5!" />
      </OraIconButton>
      <OraIconButton variant="tonal" label="Next items" @click="step(1)">
        <IconChevronRight class="size-5!" />
      </OraIconButton>
    </div>
  </section>
</template>
