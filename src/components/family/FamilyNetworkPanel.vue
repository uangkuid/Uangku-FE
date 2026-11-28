<script setup lang="ts">
import type { Component } from 'vue'
import IconFamily from '@/components/icons/IconFamily.vue'
import IconLock from '@/components/icons/IconLock.vue'
import ShapeBlob from '@/components/shapes/ShapeBlob.vue'

defineProps<{
  /** What this step of the flow does. */
  badge: Component
  /** The badge on a light tile instead of the primary one. */
  lightBadge?: boolean
}>()

/* Places inside the 360×340 drawing: [left, top, colors]. */
const members = [
  [56, 26, 'bg-inverse-surface text-inverse-on-surface'],
  [250, 48, 'bg-surface text-primary'],
  [22, 194, 'bg-tertiary-container text-on-tertiary-container'],
  [244, 226, 'bg-secondary-container text-on-secondary-container'],
] as const
</script>

<!-- Decorative: a family as a network of people around one of them. -->
<template>
  <div
    aria-hidden="true"
    class="relative flex flex-1 flex-col justify-between gap-6 overflow-hidden rounded-corner-xxl bg-primary-container p-10 text-on-primary-container lg:min-h-160"
  >
    <ShapeBlob
      class="absolute -right-42.5 -bottom-40 size-130 text-tertiary-container opacity-55"
    />
    <span
      class="relative inline-flex h-9 items-center gap-2 self-start rounded-full bg-surface pr-3.5 pl-2.5 text-label-large font-semibold text-primary"
    >
      <IconFamily class="size-5" />
      Family Sharing
    </span>

    <div class="relative h-85 w-90 flex-none self-center max-sm:-mx-6 max-sm:scale-80">
      <svg
        class="absolute inset-0"
        width="360"
        height="340"
        viewBox="0 0 360 340"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-opacity="0.35"
        stroke-dasharray="6 6"
      >
        <path
          d="M180 170 92 62M180 170 286 84M180 170 58 230M180 170 280 262M92 62 286 84M58 230 280 262M92 62 58 230M286 84 280 262"
        />
      </svg>
      <span
        class="absolute top-28.5 left-31 flex size-28 items-center justify-center rounded-[36px] bg-primary text-on-primary ring-6 ring-surface/55"
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        >
          <circle cx="12" cy="9" r="4" />
          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
        </svg>
      </span>
      <span
        v-for="([left, top, colors], index) in members"
        :key="index"
        class="absolute flex size-18 items-center justify-center rounded-full ring-6 ring-surface/55"
        :class="colors"
        :style="{ left: `${left}px`, top: `${top}px` }"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        >
          <circle cx="12" cy="9" r="4" />
          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
        </svg>
      </span>
      <span
        class="absolute top-49 left-51 flex size-12 items-center justify-center rounded-corner-lg shadow-elevation-1"
        :class="lightBadge ? 'bg-surface text-primary' : 'bg-primary text-on-primary'"
      >
        <component :is="badge" class="size-6" />
      </span>
    </div>

    <ul class="relative flex flex-wrap gap-x-6 gap-y-2 text-label-large">
      <li class="inline-flex items-center gap-2"><IconFamily class="size-5" />Up to 5 members</li>
      <li class="inline-flex items-center gap-2">
        <IconLock class="size-5" />End-to-end encrypted
      </li>
    </ul>
  </div>
</template>
