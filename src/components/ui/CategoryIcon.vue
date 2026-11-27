<script setup lang="ts">
import type { Category } from '@/data/home'
import { categoryIcons } from './categoryIcons'

defineProps<{ category: Category }>()
</script>

<!-- The design system's category icon. Its colors do not follow the theme. -->
<template>
  <span
    class="flex size-7 flex-none rounded-corner-md bg-category-container p-1 text-on-category-container"
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        v-for="(path, index) in categoryIcons[category]"
        :key="index"
        :d="path.d"
        :transform="path.transform"
        :fill-rule="path.evenOdd ? 'evenodd' : undefined"
      />
    </svg>
  </span>
</template>
