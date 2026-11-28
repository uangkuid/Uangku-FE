<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import StepProgress from '@/components/auth/StepProgress.vue'
import IconApple from '@/components/icons/IconApple.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconGoogle from '@/components/icons/IconGoogle.vue'
import IconKey from '@/components/icons/IconKey.vue'
import IconMail from '@/components/icons/IconMail.vue'
import IconPassword from '@/components/icons/IconPassword.vue'
import OraBanner from '@/components/ui/banner/OraBanner.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraDivider from '@/components/ui/divider/OraDivider.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraTextField from '@/components/ui/text-field/OraTextField.vue'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** How long the success message stays up before the home page opens. */
const OPEN_HOME_DELAY_MS = 900

const router = useRouter()

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
  // for now any complete form is accepted.
  unlocked.value = !passwordError.value && !secretKeyError.value
}

// Editing a credential, going back or leaving the page cancels the pending navigation.
watch(unlocked, (isUnlocked, _, onCleanup) => {
  if (!isUnlocked) return
  const timer = setTimeout(() => router.push({ name: 'home' }), OPEN_HOME_DELAY_MS)
  onCleanup(() => clearTimeout(timer))
})
</script>

<template>
  <AuthLayout>
    <OraIconButton
      v-if="step === 'unlock'"
      label="Back to email"
      class="-mb-2 -ml-2 self-start text-on-surface!"
      @click="backToEmail"
    >
      <IconArrowLeft />
    </OraIconButton>

    <StepProgress :current="step === 'email' ? 1 : 2" :total="2" />

    <form
      v-if="step === 'email'"
      class="flex flex-col gap-4.5"
      novalidate
      @submit.prevent="onContinue"
    >
      <h1 class="text-headline-medium font-medium">Welcome Back to Uangku</h1>
      <p class="text-body-large text-on-surface-variant">
        Your journey to smarter financial management continues. Log in to access your personalized
        dashboard.
      </p>

      <OraButton variant="outlined" size="m">
        <IconGoogle />
        <span class="flex-1 pr-8.5 text-center">Sign in with Google</span>
      </OraButton>
      <OraButton variant="outlined" size="m">
        <IconApple />
        <span class="flex-1 pr-8.5 text-center">Sign in with Apple</span>
      </OraButton>

      <OraDivider>OR</OraDivider>

      <OraTextField
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
      </OraTextField>

      <OraButton type="submit" size="m">Continue</OraButton>
    </form>

    <form v-else class="flex flex-col gap-4.5" novalidate @submit.prevent="onSignIn">
      <h1 class="text-headline-medium font-medium">Unlock your data</h1>
      <p class="text-body-large text-on-surface-variant">
        Enter your password and secret key. Both stay on this device and are never sent to us.
      </p>

      <OraTextField
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
          <OraDivider vertical />
          <OraButton variant="text" aria-label="Change email" @click="backToEmail">
            Change
          </OraButton>
        </template>
      </OraTextField>

      <OraTextField
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
          <OraIconButton
            :label="showPassword ? 'Hide password' : 'Show password'"
            :selected="showPassword"
            @click="showPassword = !showPassword"
          >
            <IconEye :off="showPassword" />
          </OraIconButton>
        </template>
      </OraTextField>

      <OraTextField
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
      </OraTextField>

      <OraButton type="submit" size="m">Sign in</OraButton>

      <OraBanner v-if="unlocked" tone="success" role="status">
        Unlocked on this device. Opening your wallets…
      </OraBanner>
    </form>

    <p class="mt-1 text-center text-body-medium text-on-surface-variant">
      New to Uangku?
      <RouterLink
        :to="{ name: 'register' }"
        class="focus-ring rounded-corner-xs text-label-large font-semibold text-primary hover:underline"
      >
        Create account
      </RouterLink>
    </p>
  </AuthLayout>
</template>
