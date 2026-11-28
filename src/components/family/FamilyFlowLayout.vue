<script setup lang="ts">
import OraPageShell from '@/components/layout/OraPageShell.vue'
</script>

<!--
  The two columns of the screens that create or join a family: a `panel` beside the content. Below
  `lg` (not covered by the design) the content comes first.
-->
<template>
  <OraPageShell>
    <main class="grid min-w-0 flex-1 gap-6 px-4 py-8 sm:px-10 lg:grid-cols-2">
      <div class="flex min-w-0 flex-col max-lg:order-2">
        <slot name="panel" />
      </div>
      <section class="flex min-w-0 items-center justify-center lg:p-6">
        <div class="flex w-full max-w-115 flex-col gap-6">
          <slot />
        </div>
      </section>
    </main>
  </OraPageShell>
</template>
