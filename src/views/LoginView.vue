<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthBrandPanel from '@/components/auth/AuthBrandPanel.vue'
import StepProgress from '@/components/auth/StepProgress.vue'
import IconApple from '@/components/icons/IconApple.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconGoogle from '@/components/icons/IconGoogle.vue'
import IconKey from '@/components/icons/IconKey.vue'
import IconMail from '@/components/icons/IconMail.vue'
import IconPassword from '@/components/icons/IconPassword.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTextField from '@/components/ui/AppTextField.vue'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const step = ref<'email' | 'unlock'>('email')
const email = ref('')
const password = ref('')
const secretKey = ref('')
const showPassword = ref(false)
const triedContinue = ref(false)
const triedSignIn = ref(false)
const unlocked = ref(false)

const isEmailValid = computed(() => EMAIL_PATTERN.test(email.value.trim()))

const emailError = computed(() => {
  if (!triedContinue.value || isEmailValid.value) return ''
  return email.value.trim()
    ? 'Email is invalid. Use a format like name@email.com'
    : 'Email is required'
})
const passwordError = computed(() =>
  triedSignIn.value && !password.value ? 'Password is required' : '',
)
const secretKeyError = computed(() =>
  triedSignIn.value && !secretKey.value.trim() ? 'Secret key is required' : '',
)

function onContinue() {
  triedContinue.value = !isEmailValid.value
  if (isEmailValid.value) step.value = 'unlock'
}

/** Return to step 1 and drop the credentials typed in step 2. */
function backToEmail() {
  step.value = 'email'
  password.value = ''
  secretKey.value = ''
  showPassword.value = false
  triedSignIn.value = false
  unlocked.value = false
}

function onSignIn() {
  triedSignIn.value = true
  // TODO: no authentication backend yet. Unlock the data here once it exists;
  // for now a complete form only shows the success state from the design.
  unlocked.value = !passwordError.value && !secretKeyError.value
}
</script>

<template>
  <main
    class="grid min-h-dvh grid-cols-1 content-start gap-4 p-4 split:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] split:content-normal"
  >
    <AuthBrandPanel />

    <section class="flex items-center justify-center py-6 split:px-6">
      <div class="flex w-full max-w-110 flex-col gap-6">
        <AppButton
          v-if="step === 'unlock'"
          variant="icon"
          class="-mb-2 -ml-3 self-start"
          aria-label="Back to email"
          @click="backToEmail"
        >
          <IconArrowLeft />
        </AppButton>

        <StepProgress :current="step === 'email' ? 1 : 2" :total="2" />

        <form
          v-if="step === 'email'"
          class="flex flex-col gap-4.5"
          novalidate
          @submit.prevent="onContinue"
        >
          <h1 class="text-headline-medium font-medium">Welcome Back to Uangku</h1>
          <p class="text-body-large text-on-surface-variant">
            Your journey to smarter financial management continues. Log in to access your
            personalized dashboard.
          </p>

          <AppButton variant="outlined">
            <IconGoogle />
            <span class="flex-1 pr-8.5 text-center">Sign in with Google</span>
          </AppButton>
          <AppButton variant="outlined">
            <IconApple />
            <span class="flex-1 pr-8.5 text-center">Sign in with Apple</span>
          </AppButton>

          <div
            class="flex items-center gap-3.5 text-on-surface-variant before:h-px before:flex-1 before:bg-outline-variant after:h-px after:flex-1 after:bg-outline-variant"
          >
            <span class="text-label-medium">OR</span>
          </div>

          <AppTextField
            id="email"
            v-model="email"
            label="Email"
            type="email"
            inputmode="email"
            autocomplete="username"
            placeholder="Enter your email address"
            required
            :error="emailError"
          >
            <template #icon><IconMail /></template>
          </AppTextField>

          <AppButton type="submit">Continue</AppButton>
        </form>

        <form v-else class="flex flex-col gap-4.5" novalidate @submit.prevent="onSignIn">
          <h1 class="text-headline-medium font-medium">Unlock your data</h1>
          <p class="text-body-large text-on-surface-variant">
            Enter your password and secret key. Both stay on this device and are never sent to us.
          </p>

          <AppTextField
            id="locked-email"
            :model-value="email.trim()"
            label="Email"
            type="email"
            autocomplete="username"
            required
            readonly
          >
            <template #icon><IconMail /></template>
            <template #trailing>
              <span class="h-8 w-px bg-outline-variant" aria-hidden="true"></span>
              <AppButton variant="text" aria-label="Change email" @click="backToEmail">
                Change
              </AppButton>
            </template>
          </AppTextField>

          <AppTextField
            id="password"
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Enter your password"
            required
            :error="passwordError"
            @input="unlocked = false"
          >
            <template #icon><IconPassword /></template>
            <template #trailing>
              <AppButton
                variant="icon"
                class="text-on-surface-variant"
                :aria-pressed="showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <IconEye width="22" height="22" :off="showPassword" />
              </AppButton>
            </template>
          </AppTextField>

          <AppTextField
            id="secret-key"
            v-model="secretKey"
            label="Secret Key"
            type="text"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            placeholder="Enter your secret key"
            required
            :error="secretKeyError"
            @input="unlocked = false"
          >
            <template #icon><IconKey /></template>
          </AppTextField>

          <AppButton type="submit">Sign in</AppButton>

          <div
            v-if="unlocked"
            role="status"
            class="rounded-[20px] bg-success-container px-4.5 py-3.5 text-body-medium font-medium text-on-success-container"
          >
            Unlocked on this device. Opening your wallets…
          </div>
        </form>

        <p class="mt-1 text-center text-body-medium text-on-surface-variant">
          New to Uangku?
          <RouterLink
            to="/register"
            class="focus-ring rounded-sm text-label-large font-semibold text-primary hover:underline"
          >
            Create account
          </RouterLink>
        </p>
      </div>
    </section>
  </main>
</template>
