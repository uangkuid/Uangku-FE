<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import StepProgress from '@/components/auth/StepProgress.vue'
import FamilyFlowLayout from '@/components/family/FamilyFlowLayout.vue'
import QrScanner, { type CameraState } from '@/components/family/QrScanner.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconQrCode from '@/components/icons/IconQrCode.vue'
import IconShield from '@/components/icons/IconShield.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraDivider from '@/components/ui/divider/OraDivider.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraTextField from '@/components/ui/text-field/OraTextField.vue'

const CODE_LENGTH = 8

const route = useRoute()
const states: CameraState[] = ['prompt', 'scanning', 'found', 'denied']
/** `?camera=prompt` and `?camera=denied` show the states that a real camera would lead to. */
const camera = ref<CameraState>(states.find((state) => state === route.query.camera) ?? 'scanning')

const code = ref('')

/** Keeps letters and digits only, grouped as `XXXX-XXXX`. */
function onInput(event: Event) {
  const field = event.target as HTMLInputElement
  const raw = field.value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, CODE_LENGTH)
  code.value = raw.length > 4 ? `${raw.slice(0, 4)}-${raw.slice(4)}` : raw
  // The field may hold characters that leave the code as it was, so it is rewritten too.
  field.value = code.value
}

const complete = computed(() => code.value.replace('-', '').length === CODE_LENGTH)
const canContinue = computed(() => complete.value || camera.value === 'found')
</script>

<template>
  <FamilyFlowLayout>
    <template #panel><QrScanner v-model="camera" /></template>

    <OraIconButton
      :as="RouterLink"
      :to="{ name: 'family-start' }"
      label="Back to Family"
      class="-mb-2 -ml-2 self-start text-on-surface!"
    >
      <IconArrowLeft />
    </OraIconButton>
    <StepProgress :current="1" :total="3" />

    <div class="flex flex-col gap-4">
      <h1 class="text-headline-medium font-semibold">Scan Family QR</h1>
      <p class="text-body-large text-on-surface-variant">
        Ask the family admin to open
        <strong class="font-semibold text-on-surface">Family › Invite member</strong> and show you
        their QR code. Hold it in front of your camera.
      </p>
    </div>

    <OraDivider>or enter an invite code</OraDivider>

    <OraTextField
      id="invite-code"
      v-model="code"
      label="Invite code"
      type="text"
      autocomplete="off"
      autocapitalize="characters"
      spellcheck="false"
      placeholder="XXXX-XXXX"
      :supporting-text="
        complete
          ? 'Code looks right. Continue to see the invitation.'
          : '8 letters or numbers, shared by the family admin.'
      "
      @input="onInput"
    >
      <template #icon><IconQrCode /></template>
    </OraTextField>

    <OraButton v-if="canContinue" :as="RouterLink" :to="{ name: 'family-invitation' }" size="m">
      Continue
      <IconArrowRight class="size-5!" />
    </OraButton>
    <OraButton v-else size="m" disabled>Continue</OraButton>

    <p class="flex items-start gap-2 text-body-small text-on-surface-variant">
      <IconShield class="mt-px size-4 flex-none" />
      Your camera is used only to read the code. Nothing is recorded or uploaded.
    </p>
  </FamilyFlowLayout>
</template>
