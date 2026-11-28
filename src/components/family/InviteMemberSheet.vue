<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId } from 'vue'
import IconClock from '@/components/icons/IconClock.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconRefresh from '@/components/icons/IconRefresh.vue'
import IconShield from '@/components/icons/IconShield.vue'
import MockQr from '@/components/family/MockQr.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraDivider from '@/components/ui/divider/OraDivider.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraModalSheet from '@/components/ui/sheet/OraModalSheet.vue'
import { familyData } from '@/data/family'

const emit = defineEmits<{ close: [] }>()

const { inviteCodes, inviteSeconds } = familyData
const codeId = useId()

const issued = ref(0)
const left = ref(inviteSeconds)
const copied = ref(false)

const code = computed(() => inviteCodes[issued.value % inviteCodes.length]!)
const expired = computed(() => left.value <= 0)
const low = computed(() => left.value <= 60)
const timeLeft = computed(() => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(Math.floor(left.value / 60))}:${pad(left.value % 60)}`
})
/** Announced at the two moments that matter, not every second. */
const announcement = computed(() => {
  if (expired.value) return 'The invite code has expired. Generate a new code.'
  return left.value === 60 ? 'One minute left before the code expires.' : ''
})

let timer: ReturnType<typeof setInterval>
onMounted(() => (timer = setInterval(() => left.value > 0 && left.value--, 1000)))
onUnmounted(() => clearInterval(timer))

function renew() {
  issued.value++
  left.value = inviteSeconds
  copied.value = false
}

async function copy() {
  try {
    await navigator.clipboard.writeText(code.value)
    copied.value = true
  } catch {
    // The clipboard is unavailable or refused; the code stays on screen to be typed.
    copied.value = false
  }
}
</script>

<template>
  <OraModalSheet title="Invite a New Member" :overline="familyData.name" @close="emit('close')">
    <div class="flex flex-col gap-5 px-7 pt-2 pb-6">
      <p class="text-body-large text-on-surface-variant">
        Grow your family circle. Ask them to open
        <strong class="font-semibold text-on-surface">Family › Join</strong> in Uangku and scan this
        code.
      </p>

      <div
        class="flex flex-col items-center gap-4 rounded-card bg-surface-container-lowest px-6 pt-7 pb-5"
      >
        <!-- A QR code stays dark on white in both themes, so that it can be scanned. -->
        <div
          class="relative size-62 rounded-corner-xl bg-white p-4 inset-ring inset-ring-outline-variant"
        >
          <div
            role="img"
            :aria-label="
              expired ? 'Expired invite QR code' : `Invite QR code for ${familyData.name}`
            "
            class="relative size-54 text-black"
            :class="expired && 'opacity-35 blur-sm'"
          >
            <MockQr :seed="code" class="size-full" />
            <span
              aria-hidden="true"
              class="absolute top-1/2 left-1/2 flex size-13 -translate-1/2 items-center justify-center rounded-corner-lg bg-white"
            >
              <span
                class="flex size-10 items-center justify-center rounded-corner-md bg-primary font-display text-headline-small leading-none font-bold text-on-primary"
              >
                U
              </span>
            </span>
          </div>
          <div
            v-if="expired"
            class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center"
          >
            <span class="text-title-medium font-semibold text-black">QR code expired</span>
            <OraButton @click="renew">
              <IconRefresh />
              New code
            </OraButton>
          </div>
        </div>

        <span
          role="timer"
          aria-live="off"
          class="inline-flex h-9 items-center gap-2 rounded-full pr-3.5 pl-2.5 text-label-large"
          :class="
            expired || low
              ? 'bg-error-container text-on-error-container'
              : 'bg-secondary-container text-on-secondary-container'
          "
        >
          <IconClock class="size-4.5" />
          <span>{{ expired ? 'Code expired' : 'Valid for' }}</span>
          <b v-if="!expired" class="tabular-nums">{{ timeLeft }}</b>
        </span>
        <span aria-live="polite" class="sr-only">{{ announcement }}</span>
        <div
          aria-hidden="true"
          class="h-1 w-full overflow-hidden rounded-full bg-secondary-container"
        >
          <div
            class="h-full rounded-full [transition:width_1s_linear] motion-reduce:transition-none"
            :class="low ? 'bg-error' : 'bg-primary'"
            :style="{ width: `${(left / inviteSeconds) * 100}%` }"
          ></div>
        </div>
      </div>

      <OraDivider>or share an invite code</OraDivider>

      <div class="flex flex-col gap-2">
        <span :id="codeId" class="text-label-large">Invite code</span>
        <div
          class="flex h-14 items-center gap-2 rounded-field bg-surface-container-highest pr-2 pl-4.5"
          :class="expired && 'opacity-50'"
        >
          <span
            :aria-labelledby="codeId"
            class="flex-1 text-title-medium font-semibold tracking-[3px] tabular-nums"
          >
            {{ expired ? '••••-••••' : code }}
          </span>
          <OraIconButton label="Copy invite code" :disabled="expired" @click="copy">
            <IconCopy />
          </OraIconButton>
        </div>
        <span role="status" class="min-h-4 text-body-small text-on-surface-variant">
          {{ copied && !expired ? 'Code copied.' : '' }}
        </span>
      </div>

      <p class="flex items-start gap-2 text-body-small text-on-surface-variant">
        <IconShield class="mt-px size-4 flex-none" />
        Share it only with people you trust. Anyone with this code can ask to join until it expires,
        and each code works once.
      </p>
    </div>

    <template #footer>
      <footer class="flex gap-3 bg-surface-container px-6 pt-4 pb-6">
        <OraButton variant="outlined" size="m" class="flex-1!" @click="emit('close')">
          Done
        </OraButton>
        <OraButton variant="tonal" size="m" class="flex-[1.4]!" @click="renew">
          <IconRefresh />
          Generate new code
        </OraButton>
      </footer>
    </template>
  </OraModalSheet>
</template>
