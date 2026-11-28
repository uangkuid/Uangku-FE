<script setup lang="ts">
import { RouterLink } from 'vue-router'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconLightbulb from '@/components/icons/IconLightbulb.vue'
import IconLock from '@/components/icons/IconLock.vue'
import ShapeScallop from '@/components/shapes/ShapeScallop.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
</script>

<template>
  <section
    aria-labelledby="insight-title"
    class="relative flex flex-wrap items-center gap-6 overflow-hidden rounded-card bg-secondary-container px-7 py-6 text-on-secondary-container"
  >
    <ShapeScallop class="absolute -top-17.5 -right-15 size-55 text-primary-container opacity-35" />
    <span class="relative flex size-16 flex-none items-center justify-center">
      <ShapeScallop class="absolute inset-0 size-16 text-primary" />
      <IconLightbulb class="relative size-7 text-on-primary" />
    </span>
    <div class="relative flex flex-[2_1_360px] flex-col gap-1.5">
      <div class="flex flex-wrap items-center gap-2">
        <h2 id="insight-title" class="text-title-medium font-semibold">Smart insight</h2>
        <span
          class="inline-flex h-6 items-center gap-1 rounded-full bg-surface-container-lowest px-2.5 text-label-small font-semibold text-on-surface"
        >
          <IconLock class="size-3" stroke-width="2.4" />
          Calculated on your device
        </span>
      </div>
      <p class="text-body-large">
        Food is still your biggest spend at <b>Rp 1.240.000</b> (40% of expenses), but it’s
        <b>8% lower</b> than November. Nice.
      </p>
    </div>
    <div
      class="relative flex flex-[1_1_260px] flex-col gap-2.5 rounded-list-outer bg-surface-container-lowest px-5 py-4 text-on-surface"
    >
      <span class="text-title-small font-semibold">Worth a look</span>
      <span class="text-body-medium text-on-surface-variant">
        Shopping jumped 35%. Keeping it under Rp 300.000 next month lifts your savings rate above
        25%.
      </span>
      <OraButton :as="RouterLink" :to="{ name: 'transactions' }" class="self-start">
        See Shopping
        <IconChevronRight />
      </OraButton>
    </div>
  </section>
</template>
