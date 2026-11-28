<script setup lang="ts">
import { computed, ref, useId, type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconDownload from '@/components/icons/IconDownload.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconKey from '@/components/icons/IconKey.vue'
import IconLock from '@/components/icons/IconLock.vue'
import IconPrint from '@/components/icons/IconPrint.vue'
import OraBanner from '@/components/ui/banner/OraBanner.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraTextField from '@/components/ui/text-field/OraTextField.vue'

const props = defineProps<{
  title: string
  intro: string
  steps: string[]
  /** The read-only field that says whose key this is. */
  owner: { label: string; value: string; icon: Component }
  /** What the key is called, e.g. "Family Secret Key". */
  keyName: string
  secretKey: string
  /** What the kit is called, e.g. "Emergency Kit". */
  kitName: string
  /** The file that saving produces. */
  fileName: string
  /** Said after the file name once the key is saved. */
  savedNote: string
  /** Said while the key is not saved yet. */
  hint: string
  next: { label: string; to: RouteLocationRaw }
}>()

const id = useId()
const shown = ref(false)
const copied = ref(false)
// Nothing is written to disk or printed yet: saving only shows the confirmation.
const saved = ref(false)

/** The first group stays readable; the rest is dotted until the key is shown. */
const masked = computed(() =>
  props.secretKey
    .split('-')
    .map((group, index) => (index ? '•'.repeat(group.length) : group))
    .join('-'),
)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.secretKey)
    copied.value = true
  } catch {
    // The clipboard is unavailable or refused; the key can still be shown and typed.
    copied.value = false
  }
}
</script>

<!-- The step that hands a secret key over: what it is, the key itself and saving a copy of it. -->
<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-headline-medium font-semibold">{{ title }}</h1>
    <p class="text-body-large text-on-surface-variant">{{ intro }}</p>
    <ol class="flex flex-col gap-3">
      <li v-for="(step, index) in steps" :key="step" class="flex items-center gap-3.5">
        <span
          aria-hidden="true"
          class="flex size-8 flex-none items-center justify-center rounded-full bg-secondary-container text-label-large font-semibold text-on-secondary-container"
        >
          {{ index + 1 }}
        </span>
        <span class="text-body-large">{{ step }}</span>
      </li>
    </ol>

    <OraTextField
      :id="`${id}-owner`"
      :label="owner.label"
      :model-value="owner.value"
      type="text"
      readonly
    >
      <template #icon><component :is="owner.icon" /></template>
    </OraTextField>

    <div class="flex flex-col gap-2">
      <OraTextField
        :id="`${id}-key`"
        :label="`Your ${keyName}`"
        :model-value="shown ? secretKey : masked"
        type="text"
        class="font-semibold tracking-[0.5px] tabular-nums"
        readonly
      >
        <template #icon><IconKey /></template>
        <template #trailing>
          <span class="flex">
            <OraIconButton
              :label="shown ? `Hide ${keyName}` : `Show ${keyName}`"
              :selected="shown"
              @click="shown = !shown"
            >
              <IconEye :off="shown" />
            </OraIconButton>
            <OraIconButton :label="`Copy ${keyName}`" @click="copy">
              <IconCopy />
            </OraIconButton>
          </span>
        </template>
      </OraTextField>
      <span role="status" class="min-h-4 text-body-small text-on-surface-variant">
        {{
          copied ? 'Copied. Paste it into your password manager, then clear your clipboard.' : ''
        }}
      </span>
    </div>

    <div class="flex gap-2">
      <OraButton size="m" class="flex-1!" @click="saved = true">
        <IconDownload class="size-5!" />
        Save Secret Key
      </OraButton>
      <OraIconButton
        :label="`Print ${kitName}`"
        :title="`Print ${kitName}`"
        variant="outlined"
        size="m"
        class="border-outline! text-primary!"
        @click="saved = true"
      >
        <IconPrint />
      </OraIconButton>
    </div>

    <template v-if="saved">
      <OraBanner tone="success" role="status">
        <strong class="font-semibold">Saved as {{ fileName }}.</strong> {{ savedNote }}
      </OraBanner>
      <OraButton :as="RouterLink" :to="next.to" variant="tonal" size="m">
        {{ next.label }}
        <IconArrowRight class="size-5!" />
      </OraButton>
    </template>
    <p v-else class="flex items-start gap-2 text-body-small text-on-surface-variant">
      <IconLock class="mt-px size-4 flex-none" stroke-width="2.2" />
      {{ hint }}
    </p>
  </div>
</template>
