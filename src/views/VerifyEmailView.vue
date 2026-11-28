<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import OtpField from '@/components/auth/OtpField.vue'
import StepProgress from '@/components/auth/StepProgress.vue'
import VerifyEmailArt from '@/components/auth/VerifyEmailArt.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import OraBanner from '@/components/ui/banner/OraBanner.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import { useRegistrationStore } from '@/stores/registration'

const LENGTH = 6

const registration = useRegistrationStore()

const code = ref('')
const tried = ref(false)
const verified = ref(false)
const resent = ref(false)

const error = computed(() => {
  if (!tried.value || code.value.length === LENGTH) return ''
  return code.value ? 'Enter all 6 digits of the code' : 'Enter the 6-digit code from your email'
})

watch(code, () => (verified.value = false))

/** No code is sent or checked yet: any six digits pass. */
function verify() {
  tried.value = true
  verified.value = code.value.length === LENGTH
}

function resend() {
  code.value = ''
  tried.value = false
  resent.value = true
}
</script>

<template>
  <AuthLayout>
    <template #art><VerifyEmailArt /></template>

    <OraIconButton
      :as="RouterLink"
      :to="{ name: 'register' }"
      label="Back to create account"
      class="-mb-2 -ml-2 self-start text-on-surface!"
    >
      <IconArrowLeft />
    </OraIconButton>

    <StepProgress :current="2" :total="4" />

    <form class="flex flex-col gap-4" novalidate @submit.prevent="verify">
      <h1 class="text-headline-medium font-semibold">Verify Your Email</h1>
      <p class="text-body-large text-on-surface-variant">
        We've sent a 6-digit code to your email. Enter the code below to verify your account and
        continue.
      </p>

      <OtpField v-model="code" class="mt-2" :length="LENGTH" :error="error">
        <template #label>
          Verification code sent to
          <strong class="font-semibold">{{ registration.email }}</strong>
        </template>
      </OtpField>

      <div
        class="flex flex-wrap items-center justify-between gap-3 text-body-medium text-on-surface-variant"
      >
        <span role="status">
          {{ resent ? 'New code sent. Check your inbox.' : "Didn't get the code?" }}
        </span>
        <span class="inline-flex gap-1">
          <OraButton variant="text" @click="resend">Resend code</OraButton>
          <OraButton :as="RouterLink" :to="{ name: 'register' }" variant="text">
            Change email
          </OraButton>
        </span>
      </div>

      <OraButton v-if="!verified" type="submit" size="m" class="mt-2">Verify</OraButton>
      <template v-else>
        <OraBanner tone="success" role="status">
          <strong class="font-semibold">Email verified.</strong> Next, create the Secret Key that
          protects your data.
        </OraBanner>
        <OraButton :as="RouterLink" :to="{ name: 'secret-key' }" size="m">
          Continue
          <IconArrowRight class="size-5!" />
        </OraButton>
      </template>
    </form>

    <p class="flex items-start gap-2 text-body-small text-on-surface-variant">
      <IconInfo class="mt-px size-4 flex-none" />
      Can't find the email? Check your spam folder. The code expires in 10 minutes.
    </p>
  </AuthLayout>
</template>
