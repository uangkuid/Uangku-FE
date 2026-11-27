<script setup lang="ts">
import logoUrl from '@/assets/uangku-logo.svg'
import IconLock from '@/components/icons/IconLock.vue'
import IconShieldCheck from '@/components/icons/IconShieldCheck.vue'
import IconUser from '@/components/icons/IconUser.vue'
import ShapeClover from './ShapeClover.vue'
import ShapeCookie from './ShapeCookie.vue'
</script>

<!-- Below `split` (not covered by the design) this is a compact banner above the form. -->
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

    <!-- Decorative illustration of a locked account card -->
    <div
      class="relative hidden w-65 flex-col items-center gap-4 self-center rounded-card bg-surface p-7 text-on-surface shadow-elevation-1 split:flex"
      aria-hidden="true"
    >
      <div
        class="flex size-16 items-center justify-center rounded-full bg-primary-container text-primary"
      >
        <IconUser width="32" height="32" />
      </div>
      <div class="h-7 w-full rounded-corner-sm bg-surface-container-high"></div>
      <div
        class="flex h-7 w-full items-center gap-1.5 rounded-corner-sm bg-surface-container-high px-3"
      >
        <span
          v-for="dot in 5"
          :key="dot"
          class="size-1.5 rounded-full bg-on-surface-variant"
        ></span>
      </div>
      <div
        class="absolute -bottom-5 -left-5 flex size-14 items-center justify-center rounded-corner-lg bg-inverse-surface text-inverse-on-surface"
      >
        <IconLock stroke-width="2.2" />
      </div>
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
