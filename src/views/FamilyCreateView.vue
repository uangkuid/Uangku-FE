<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import StepProgress from '@/components/auth/StepProgress.vue'
import { useGeneration } from '@/components/auth/useGeneration'
import FamilyFlowLayout from '@/components/family/FamilyFlowLayout.vue'
import FamilyNetworkPanel from '@/components/family/FamilyNetworkPanel.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconFamily from '@/components/icons/IconFamily.vue'
import IconKey from '@/components/icons/IconKey.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import OraBanner from '@/components/ui/banner/OraBanner.vue'
import OraBusyStatus from '@/components/ui/busy-status/OraBusyStatus.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraTextField from '@/components/ui/text-field/OraTextField.vue'

const NAME_LIMIT = 30
const MIN_LENGTH = 3

const name = ref('')
const tried = ref(false)
const { phase, start, reset } = useGeneration()

const error = computed(() => {
  const clean = name.value.trim()
  if (!tried.value || clean.length >= MIN_LENGTH) return ''
  return clean ? `Use at least ${MIN_LENGTH} characters` : 'Family name is required'
})

function submit() {
  if (phase.value !== 'idle') return
  tried.value = true
  if (name.value.trim().length >= MIN_LENGTH) start()
}
</script>

<template>
  <FamilyFlowLayout>
    <template #panel><FamilyNetworkPanel :badge="IconPlus" /></template>

    <OraIconButton
      :as="RouterLink"
      :to="{ name: 'family-start' }"
      label="Back to Family"
      class="-mb-2 -ml-2 self-start text-on-surface!"
    >
      <IconArrowLeft />
    </OraIconButton>
    <StepProgress :current="1" :total="2" />

    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <h1 class="text-headline-medium font-semibold">Create Family</h1>
      <p class="text-body-large text-on-surface-variant">
        Create a Family to securely share wallets and transactions with up to 5 members. Keep your
        finances transparent while ensuring privacy and security.
      </p>
      <div class="relative mt-2 flex flex-col">
        <OraTextField
          id="family-name"
          v-model="name"
          label="Name"
          type="text"
          autocomplete="off"
          placeholder="Enter family name"
          required
          :maxlength="NAME_LIMIT"
          :error="error"
          supporting-text="Everyone you invite will see this name."
          @input="reset"
        >
          <template #icon><IconFamily /></template>
        </OraTextField>
        <span
          aria-hidden="true"
          class="self-end pt-1 text-body-small text-on-surface-variant tabular-nums"
        >
          {{ name.length }}/{{ NAME_LIMIT }}
        </span>
      </div>

      <OraButton v-if="phase === 'idle'" type="submit" size="m" class="mt-2">
        Create Family
      </OraButton>
      <OraBusyStatus v-else-if="phase === 'busy'" class="mt-2">
        Generating Family Secret Key…
      </OraBusyStatus>
      <template v-else>
        <OraBanner tone="success" role="status" class="mt-2">
          <strong class="font-semibold">{{ name.trim() }} created.</strong> Its Secret Key was
          generated on this device.
        </OraBanner>
        <OraButton :as="RouterLink" :to="{ name: 'family-kit' }" size="m">
          View Family Emergency Kit
          <IconArrowRight class="size-5!" />
        </OraButton>
      </template>
    </form>

    <p class="flex items-start gap-2 text-body-small text-on-surface-variant">
      <IconKey class="mt-px size-4 flex-none" />
      A separate Family Secret Key is generated on this device. You'll save it in the next step.
    </p>
  </FamilyFlowLayout>
</template>
