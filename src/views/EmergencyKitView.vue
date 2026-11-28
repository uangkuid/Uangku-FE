<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import EmergencyKitArt from '@/components/auth/EmergencyKitArt.vue'
import SecretKeyKit from '@/components/auth/SecretKeyKit.vue'
import StepProgress from '@/components/auth/StepProgress.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconMail from '@/components/icons/IconMail.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import { useRegistrationStore } from '@/stores/registration'

/** A stand-in: no key is generated yet. */
const SECRET_KEY = 'UANGKU-7KQ2-M9XD-R4T-8HV'

const registration = useRegistrationStore()
</script>

<template>
  <AuthLayout>
    <template #art><EmergencyKitArt /></template>

    <OraIconButton
      :as="RouterLink"
      :to="{ name: 'secret-key' }"
      label="Back to Generate Secret Key"
      class="-mb-2 -ml-2 self-start text-on-surface!"
    >
      <IconArrowLeft />
    </OraIconButton>

    <StepProgress :current="4" :total="4" />

    <SecretKeyKit
      title="Your Emergency Kit"
      intro="Your Secret Key is essential for protecting your account. Here's what you need to know:"
      :steps="[
        'This Secret Key is uniquely generated for you.',
        'Uangku does not store your Secret Key.',
        'Keep it safe. Losing it may prevent you from accessing your data.',
      ]"
      :owner="{
        label: 'Your registered email address',
        value: registration.email,
        icon: IconMail,
      }"
      key-name="Secret Key"
      :secret-key="SECRET_KEY"
      kit-name="Emergency Kit"
      file-name="Uangku-Emergency-Kit.pdf"
      saved-note="Store it somewhere only you can reach."
      hint="Save your Emergency Kit to continue. We can't recover this key for you."
      :next="{ label: 'Continue to Uangku', to: { name: 'home' } }"
    />
  </AuthLayout>
</template>
