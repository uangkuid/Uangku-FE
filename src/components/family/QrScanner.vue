<script lang="ts">
export type CameraState = 'prompt' | 'scanning' | 'found' | 'denied'
</script>

<script setup lang="ts">
import { computed, useId, watch } from 'vue'
import { RouterLink } from 'vue-router'
import MockQr from '@/components/family/MockQr.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconCamera from '@/components/icons/IconCamera.vue'
import IconCameraOff from '@/components/icons/IconCameraOff.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconUpload from '@/components/icons/IconUpload.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import { familyData } from '@/data/family'

/** How long the prototype "scans" before it finds the code. */
const SCAN_MS = 2600

const camera = defineModel<CameraState>({ required: true })
const titleId = useId()

// Only a scan that was started here finds a code by itself.
let started = false

function scan() {
  started = true
  camera.value = 'scanning'
}

watch(
  camera,
  (state, _, onCleanup) => {
    if (state !== 'scanning' || !started) return
    const timer = setTimeout(() => (camera.value = 'found'), SCAN_MS)
    onCleanup(() => clearTimeout(timer))
  },
  { flush: 'post' },
)

const live = computed(() => camera.value === 'scanning' || camera.value === 'found')

const status = computed(
  () =>
    ({
      prompt: { text: 'Camera is off', color: 'bg-white/14 text-white' },
      scanning: { text: 'Find a code to scan', color: 'bg-neutral-900/72 text-white' },
      found: {
        text: `${familyData.invitation.family} invitation found`,
        color: 'bg-success-container text-on-success-container',
      },
      denied: {
        text: 'Camera access blocked',
        color: 'bg-error-container text-on-error-container',
      },
    })[camera.value],
)

const corners = [
  'top-0 left-0',
  'top-0 right-0 rotate-90',
  'right-0 bottom-0 rotate-180',
  'bottom-0 left-0 -rotate-90',
]
</script>

<!--
  The camera view of a QR scanner. No camera is opened yet: the feed is a drawing. It stays dark in
  both themes.
-->
<template>
  <section
    :aria-labelledby="titleId"
    class="relative flex min-h-130 flex-1 flex-col overflow-hidden rounded-corner-xxl bg-neutral-900 text-white lg:min-h-160"
  >
    <h2 :id="titleId" class="sr-only">Camera</h2>

    <template v-if="live">
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-radial-[120%_80%_at_30%_20%] from-neutral-600 via-neutral-800 via-55% to-neutral-900"
      ></div>
      <div
        aria-hidden="true"
        class="absolute top-1/2 left-1/2 flex h-90 w-75 -translate-x-1/2 -translate-y-[46%] -rotate-3 flex-col items-center justify-center gap-3.5 rounded-corner-xl bg-linear-160 from-stone-100 to-stone-300 text-neutral-800 shadow-2xl"
        :class="camera === 'scanning' && 'blur-[0.6px]'"
      >
        <span class="font-display text-[15px] font-bold">Join Uangku Family</span>
        <MockQr seed="invitation" class="size-42" />
        <span class="text-body-small text-neutral-600">Scan with the Uangku app</span>
      </div>
      <div
        aria-hidden="true"
        class="absolute top-1/2 left-1/2 size-70 -translate-1/2 [transition:scale_var(--motion-default-spatial)]"
        :class="camera === 'found' ? 'scale-90 text-success-container' : 'text-white'"
      >
        <svg
          v-for="corner in corners"
          :key="corner"
          class="absolute size-14"
          :class="corner"
          viewBox="0 0 56 56"
          fill="none"
          stroke="currentColor"
          stroke-width="6"
          stroke-linecap="round"
        >
          <path d="M4 52V28A24 24 0 0 1 28 4h24" />
        </svg>
        <span
          v-if="camera === 'scanning'"
          class="absolute inset-x-4 top-1/2 h-0.75 animate-scan rounded-full bg-primary-container shadow-[0_0_18px_4px] shadow-primary-container/70 motion-reduce:animate-none"
        ></span>
      </div>
    </template>

    <div class="relative flex justify-center px-6 pt-7">
      <span
        role="status"
        class="inline-flex min-h-10 items-center gap-2 rounded-corner-md px-4 text-center text-label-large font-semibold"
        :class="status.color"
      >
        <IconCheck v-if="camera === 'found'" class="size-4.5" stroke-width="2.6" />
        {{ status.text }}
      </span>
    </div>

    <div
      v-if="!live"
      class="relative flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center"
    >
      <span
        aria-hidden="true"
        class="flex size-22 items-center justify-center rounded-corner-xl-inc"
        :class="camera === 'denied' ? 'bg-error-container text-on-error-container' : 'bg-white/12'"
      >
        <component :is="camera === 'denied' ? IconCameraOff : IconCamera" class="size-10" />
      </span>
      <div class="flex max-w-90 flex-col gap-2">
        <span class="text-title-large font-semibold">
          {{ camera === 'denied' ? 'Uangku can’t use your camera' : 'Turn on your camera to scan' }}
        </span>
        <span class="text-body-medium text-white/78">
          {{
            camera === 'denied'
              ? 'Allow camera access in your browser’s site settings, then try again. You can also enter an invite code instead.'
              : 'Your browser will ask for permission. The camera is used only to read the QR code.'
          }}
        </span>
      </div>
      <OraButton size="m" class="bg-primary-container! text-on-primary-container!" @click="scan">
        <IconCamera class="size-5.5!" />
        {{ camera === 'denied' ? 'Try again' : 'Allow camera' }}
      </OraButton>
    </div>

    <div class="relative mt-auto flex flex-wrap justify-center gap-3 p-6">
      <template v-if="camera === 'found'">
        <OraButton
          :as="RouterLink"
          :to="{ name: 'family-invitation' }"
          size="m"
          class="bg-primary-container! text-on-primary-container!"
        >
          View invitation
          <IconArrowRight class="size-5!" />
        </OraButton>
        <OraButton size="m" class="bg-white/14! text-white!" @click="scan">Scan again</OraButton>
      </template>
      <OraButton
        v-else-if="camera === 'scanning'"
        class="bg-white/16! text-white! backdrop-blur-sm"
        @click="camera = 'found'"
      >
        <IconUpload />
        Upload QR image
      </OraButton>
    </div>
  </section>
</template>
