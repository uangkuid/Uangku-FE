<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import PasswordStrength from '@/components/auth/PasswordStrength.vue'
import StepProgress from '@/components/auth/StepProgress.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconLock from '@/components/icons/IconLock.vue'
import IconMail from '@/components/icons/IconMail.vue'
import IconPassword from '@/components/icons/IconPassword.vue'
import IconPasswordCheck from '@/components/icons/IconPasswordCheck.vue'
import IconUser from '@/components/icons/IconUser.vue'
import OraBanner from '@/components/ui/banner/OraBanner.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraTextField from '@/components/ui/text-field/OraTextField.vue'
import { useRegistrationStore } from '@/stores/registration'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const registration = useRegistrationStore()

const form = reactive({ name: '', email: '', password: '', confirmation: '' })
const showPassword = ref(false)
const showConfirmation = ref(false)
const tried = ref(false)
const created = ref(false)

const isEmailValid = computed(() => EMAIL_PATTERN.test(form.email.trim()))
const matches = computed(() => !!form.confirmation && form.confirmation === form.password)

const errors = computed(() => ({
  name: tried.value && !form.name.trim() ? 'Name is required' : '',
  email:
    tried.value && !isEmailValid.value
      ? form.email.trim()
        ? 'Email is invalid. Use a format like name@email.com'
        : 'Email is required'
      : '',
  password:
    tried.value && form.password.length < 8
      ? form.password
        ? 'Password must be at least 8 characters'
        : 'Password is required'
      : '',
  confirmation: confirmationError(),
}))

/** A mismatch shows once the confirmation is as long as the password, or on submitting. */
function confirmationError() {
  if (!form.confirmation) return tried.value ? 'Please confirm your password' : ''
  const due = tried.value || form.confirmation.length >= form.password.length
  return due && !matches.value ? "Passwords don't match" : ''
}

watch(form, () => (created.value = false))

/** Nothing is stored yet: a valid form only shows the confirmation. */
function submit() {
  tried.value = true
  const valid = form.name.trim() && isEmailValid.value && form.password.length >= 8 && matches.value
  if (!valid) return
  registration.email = form.email.trim()
  created.value = true
}
</script>

<template>
  <AuthLayout>
    <OraIconButton
      :as="RouterLink"
      :to="{ name: 'login' }"
      label="Back to sign in"
      class="-mb-2 -ml-2 self-start text-on-surface!"
    >
      <IconArrowLeft />
    </OraIconButton>

    <StepProgress :current="1" :total="4" />

    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <h1 class="text-headline-medium font-semibold">Join Uangku Today</h1>
      <p class="text-body-large text-on-surface-variant">
        Take control of your finances and achieve your goals. Create your account in just a few
        simple steps!
      </p>

      <OraTextField
        id="name"
        v-model="form.name"
        label="Name"
        type="text"
        autocomplete="name"
        placeholder="Enter your name"
        required
        :error="errors.name"
      >
        <template #icon><IconUser /></template>
      </OraTextField>

      <OraTextField
        id="email"
        v-model="form.email"
        label="Email"
        type="email"
        autocomplete="email"
        placeholder="Enter email address"
        required
        :error="errors.email"
      >
        <template #icon><IconMail /></template>
      </OraTextField>

      <div class="flex flex-col gap-2">
        <OraTextField
          id="password"
          v-model="form.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="Enter your password"
          required
          :error="errors.password"
        >
          <template #icon><IconPassword /></template>
          <template #trailing>
            <OraIconButton
              :label="showPassword ? 'Hide password' : 'Show password'"
              :selected="showPassword"
              @click="showPassword = !showPassword"
            >
              <IconEye :off="showPassword" />
            </OraIconButton>
          </template>
        </OraTextField>
        <PasswordStrength v-if="form.password" :password="form.password" />
      </div>

      <div class="flex flex-col gap-2">
        <OraTextField
          id="password-confirmation"
          v-model="form.confirmation"
          label="Password Confirmation"
          :type="showConfirmation ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="Enter your password confirmation"
          required
          :error="errors.confirmation"
        >
          <template #icon><IconPasswordCheck /></template>
          <template #trailing>
            <OraIconButton
              :label="showConfirmation ? 'Hide confirmation' : 'Show confirmation'"
              :selected="showConfirmation"
              @click="showConfirmation = !showConfirmation"
            >
              <IconEye :off="showConfirmation" />
            </OraIconButton>
          </template>
        </OraTextField>
        <span
          v-if="matches"
          role="status"
          class="inline-flex items-center gap-1.5 text-body-small font-semibold text-success"
        >
          <IconCheck class="size-4" stroke-width="2.6" />
          Passwords match
        </span>
      </div>

      <OraButton type="submit" size="m" class="mt-2">Create account</OraButton>

      <OraBanner v-if="created" tone="success" role="status">
        <strong class="font-semibold">Account created.</strong> We sent a verification code to
        {{ registration.email }}. Next you'll generate your secret key.
        <RouterLink
          :to="{ name: 'verify-email' }"
          class="focus-ring rounded-corner-xs font-semibold underline"
        >
          Enter the code
        </RouterLink>
      </OraBanner>
    </form>

    <p class="flex items-start gap-2 text-body-small text-on-surface-variant">
      <IconLock class="mt-px size-4 flex-none" stroke-width="2.2" />
      Your password never leaves this device in readable form. Your data is end-to-end encrypted.
    </p>
    <p class="text-center text-body-medium text-on-surface-variant">
      Already have an account?
      <RouterLink
        :to="{ name: 'login' }"
        class="focus-ring rounded-corner-xs text-label-large font-semibold text-primary hover:underline"
      >
        Sign in
      </RouterLink>
    </p>
  </AuthLayout>
</template>
