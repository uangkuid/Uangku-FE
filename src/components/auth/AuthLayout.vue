<script setup lang="ts">
import AuthBrandPanel from './AuthBrandPanel.vue'
</script>

<!--
  The two columns of the screens before signing in: the brand panel and the form. The `art` slot
  replaces the panel's illustration.
-->
<template>
  <main
    class="grid min-h-dvh grid-cols-1 content-start gap-4 p-4 split:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] split:content-normal"
  >
    <AuthBrandPanel>
      <slot name="art" />
    </AuthBrandPanel>

    <section class="flex items-center justify-center py-6 split:px-6">
      <div class="flex w-full max-w-110 flex-col gap-6">
        <slot />
      </div>
    </section>
  </main>
</template>
