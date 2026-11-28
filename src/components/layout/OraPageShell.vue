<script setup lang="ts">
import OraNavRail from '@/components/layout/OraNavRail.vue'
import { homeData } from '@/data/home'
</script>

<!-- The app chrome of a signed-in screen: the navigation rail beside the screen's `main`. -->
<template>
  <div class="flex min-h-dvh">
    <OraNavRail :user="homeData.user" />
    <slot />
  </div>
</template>
