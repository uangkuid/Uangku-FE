<script setup lang="ts">
import { ref } from 'vue'
import SecretKeyKit from '@/components/auth/SecretKeyKit.vue'
import StepProgress from '@/components/auth/StepProgress.vue'
import FamilyFlowLayout from '@/components/family/FamilyFlowLayout.vue'
import FamilyNetworkPanel from '@/components/family/FamilyNetworkPanel.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconFamily from '@/components/icons/IconFamily.vue'
import IconKey from '@/components/icons/IconKey.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import { familyData } from '@/data/family'

const { invitation } = familyData
const welcome = ref(true)
</script>

<template>
  <FamilyFlowLayout>
    <template #panel><FamilyNetworkPanel :badge="IconKey" light-badge /></template>

    <StepProgress :current="3" :total="3" />
    <div
      v-if="welcome"
      role="status"
      class="flex items-start gap-3.5 rounded-list-outer bg-success-container py-4.5 pr-3 pl-5 text-on-success-container"
    >
      <span
        aria-hidden="true"
        class="flex size-9 flex-none items-center justify-center rounded-corner-md bg-success text-on-success"
      >
        <IconCheck class="size-5" stroke-width="2.6" />
      </span>
      <span class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="text-title-medium font-semibold">Welcome to {{ invitation.family }}!</span>
        <span class="text-body-medium">
          You’ve joined successfully. Below is your Family Secret Key, the key that unlocks the
          family’s shared wallets and transactions.
        </span>
      </span>
      <OraIconButton label="Dismiss" class="-mt-2 text-current!" @click="welcome = false">
        <IconClose class="size-5!" />
      </OraIconButton>
    </div>

    <SecretKeyKit
      title="Your Family Emergency Kit"
      intro="This key was created by your family admin and is shared only with members. Here's what you need to know:"
      :steps="[
        `This Secret Key belongs to ${invitation.family} only.`,
        'Uangku does not store your Secret Key.',
        'Keep it safe. Losing it may prevent you from accessing your data.',
        'You can find your Family Secret Key in the Family menu.',
      ]"
      :owner="{ label: 'Family Name', value: invitation.family, icon: IconFamily }"
      key-name="Family Secret Key"
      :secret-key="invitation.secretKey"
      kit-name="Family Emergency Kit"
      file-name="Uangku-Family-Emergency-Kit.pdf"
      saved-note="You’re all set."
      hint="Save your Family Emergency Kit to continue to your Family page."
      :next="{ label: 'Go to Family', to: { name: 'family' } }"
    />
  </FamilyFlowLayout>
</template>
