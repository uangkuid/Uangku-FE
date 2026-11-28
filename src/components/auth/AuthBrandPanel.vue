<script setup lang="ts">
import logoUrl from '@/assets/uangku-logo.svg'
import IconLock from '@/components/icons/IconLock.vue'
import IconShieldCheck from '@/components/icons/IconShieldCheck.vue'
import LockedAccountArt from './LockedAccountArt.vue'
import ShapeClover from './ShapeClover.vue'
import ShapeCookie from './ShapeCookie.vue'
</script>

<!--
  Below `split` (not covered by the design) this is a compact banner above the form. The default slot
  replaces the illustration.
-->
<template>
  <section
    class="relative flex flex-col justify-between gap-8 overflow-hidden rounded-card bg-primary-container p-6 text-on-primary-container split:rounded-corner-xxl split:p-12"
    aria-label="About Uangku"
  >
    <ShapeCookie
      class="absolute -right-22.5 -bottom-25 size-65 text-tertiary-container opacity-55 split:-right-42.5 split:-bottom-37.5 split:size-140"
    />
    <ShapeClover
      class="absolute top-52.5 -left-25 hidden size-75 text-secondary-container opacity-70 split:block"
    />
    <img :src="logoUrl" alt="Uangku" width="144" height="36" class="relative h-9 w-36 self-start" />

    <!-- Decorative -->
    <div class="relative hidden self-center split:block" aria-hidden="true">
      <slot><LockedAccountArt /></slot>
    </div>

    <div class="relative flex max-w-130 flex-col gap-4">
      <p class="font-display text-headline-medium font-semibold split:text-display-medium">
        Your money,<br />your eyes only.
      </p>
      <p class="text-body-large">Encrypted on your device. Only your secret key can open it.</p>
      <ul class="mt-2 flex flex-wrap gap-x-6 gap-y-2">
        <li class="inline-flex items-center gap-2 text-label-large">
          <IconLock width="20" height="20" />End-to-end encrypted
        </li>
        <li class="inline-flex items-center gap-2 text-label-large">
          <IconShieldCheck width="20" height="20" />Zero-knowledge
        </li>
      </ul>
    </div>
  </section>
</template>
