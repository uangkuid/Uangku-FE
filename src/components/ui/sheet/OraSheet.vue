<script setup lang="ts">
defineProps<{
  /** Id of the heading, which names the dialog. */
  titleId: string
  title: string
  /** Small line above the title that says where the sheet belongs. */
  overline: string
  /** Another sheet is stacked on top: this one dims and stops reacting. */
  covered?: boolean
}>()

/** The dimmed sheet was clicked. */
defineEmits<{ uncover: [] }>()
</script>

<!--
  M3 modal side sheet, detached from the window edges. The caller positions and sizes it and draws
  the scrim. Slots: `action` (header), default (scrolls) and `footer`.
-->
<template>
  <section
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    class="absolute top-4 right-4 bottom-4 flex flex-col overflow-hidden rounded-corner-xl-inc bg-surface-container-low shadow-elevation-3"
  >
    <div class="flex min-h-0 flex-1 flex-col" :inert="covered || undefined">
      <header class="flex items-center justify-between gap-3 pt-6 pr-6 pb-3 pl-7">
        <div class="flex min-w-0 flex-col gap-0.5">
          <span class="text-[13px] leading-4.5 font-medium text-on-surface-variant">
            {{ overline }}
          </span>
          <h2 :id="titleId" class="font-display text-headline-medium font-bold tracking-[-0.5px]">
            {{ title }}
          </h2>
        </div>
        <slot name="action" />
      </header>
      <div class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </div>
      <slot name="footer" />
    </div>

    <div
      aria-hidden="true"
      data-testid="sheet-dim"
      class="absolute inset-0 z-10 bg-scrim [transition:opacity_var(--motion-slow-effects)]"
      :class="covered ? 'opacity-14' : 'pointer-events-none opacity-0'"
      @click="$emit('uncover')"
    ></div>
  </section>
</template>
