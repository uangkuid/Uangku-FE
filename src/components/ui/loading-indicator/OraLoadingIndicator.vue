<script setup lang="ts">
import { loadingShapes } from './shapes'

const { size = 48 } = defineProps<{
  /** Accessible name, e.g. "Loading transactions". */
  label: string
  /** Width and height in px. */
  size?: number
  /** Sits in a circle of its own, for use over other content. */
  contained?: boolean
}>()

const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const SHAPE_MS = 650
const count = loadingShapes.length
const values = [...loadingShapes, loadingShapes[0]].join(';')
// Each morph springs: it starts from rest and overshoots a little.
const keySplines = Array(count).fill('0.3 0 0.2 1').join(';')
const keyTimes = Array.from({ length: count + 1 }, (_, index) => (index / count).toFixed(4)).join(
  ';',
)
const duration = `${count * SHAPE_MS}ms`
</script>

<!--
  M3 Expressive loading indicator, for waits of under five seconds: a shape that turns while it
  morphs. Under reduced motion it holds still.
-->
<template>
  <div
    role="progressbar"
    :aria-label="label"
    class="flex flex-none items-center justify-center rounded-full"
    :class="contained ? 'bg-primary-container text-on-primary-container' : 'text-primary'"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="-24 -24 48 48"
      fill="currentColor"
      aria-hidden="true"
    >
      <g>
        <animateTransform
          v-if="!still"
          attributeName="transform"
          type="rotate"
          from="0"
          to="360"
          dur="4666ms"
          repeatCount="indefinite"
        />
        <path :d="loadingShapes[0]">
          <animate
            v-if="!still"
            attributeName="d"
            :values="values"
            :keyTimes="keyTimes"
            :keySplines="keySplines"
            calcMode="spline"
            :dur="duration"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  </div>
</template>
