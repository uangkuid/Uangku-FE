<script setup lang="ts">
import SecretKeyKit from '@/components/auth/SecretKeyKit.vue'
import StepProgress from '@/components/auth/StepProgress.vue'
import FamilyFlowLayout from '@/components/family/FamilyFlowLayout.vue'
import FamilyNetworkPanel from '@/components/family/FamilyNetworkPanel.vue'
import IconFamily from '@/components/icons/IconFamily.vue'
import IconKey from '@/components/icons/IconKey.vue'
import { familyData } from '@/data/family'
</script>

<template>
  <FamilyFlowLayout>
    <template #panel><FamilyNetworkPanel :badge="IconKey" light-badge /></template>

    <StepProgress :current="2" :total="2" />
    <SecretKeyKit
      title="Your Family Emergency Kit"
      intro="Your Family Secret Key is essential for protecting your family's shared data. Here's what you need to know:"
      :steps="[
        'This Secret Key is uniquely generated for your family.',
        'Uangku does not store your Secret Key.',
        'Keep it safe. Losing it may prevent you from accessing your data.',
        'You can find your Family Secret Key in the Family menu.',
      ]"
      :owner="{ label: 'Family Name', value: familyData.name, icon: IconFamily }"
      key-name="Family Secret Key"
      :secret-key="familyData.secretKey"
      kit-name="Family Emergency Kit"
      file-name="Uangku-Family-Emergency-Kit.pdf"
      saved-note="Your family is ready."
      hint="Save your Family Emergency Kit to continue to your Family page."
      :next="{ label: 'Go to Family', to: { name: 'family' } }"
    />
  </FamilyFlowLayout>
</template>
