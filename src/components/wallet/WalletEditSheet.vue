<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconLock from '@/components/icons/IconLock.vue'
import IconMoon from '@/components/icons/IconMoon.vue'
import IconSun from '@/components/icons/IconSun.vue'
import SleepWakeDialog from '@/components/wallet/SleepWakeDialog.vue'
import WalletNameField from '@/components/wallet/WalletNameField.vue'
import WalletPreview from '@/components/wallet/WalletPreview.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraOverlay from '@/components/ui/overlay/OraOverlay.vue'
import { useOverlay } from '@/components/ui/shared/useOverlay'
import OraModalSheet from '@/components/ui/sheet/OraModalSheet.vue'
import OraSnackbar from '@/components/ui/snackbar/OraSnackbar.vue'
import OraSwitch from '@/components/ui/switch/OraSwitch.vue'
import { familyData } from '@/data/family'
import type { WalletAccount } from '@/data/wallets'
import { useWalletsStore } from '@/stores/wallets'

const props = defineProps<{ wallet: WalletAccount }>()

const emit = defineEmits<{ close: [] }>()

const wallets = useWalletsStore()
const formId = useId()
const familyLabelId = useId()
const familyHintId = useId()

const name = ref(props.wallet.name)
const tried = ref(false)
const error = computed(() => (tried.value ? wallets.nameError(name.value, props.wallet.id) : ''))

/** The confirmation on screen; `undo` puts the wallet back as it was. */
const notice = ref<{ message: string; undo?: () => void }>()
watch(name, () => (notice.value = undefined))

const dialog = useOverlay<'sleep' | 'wake'>()

function confirm() {
  const sleeping = dialog.payload === 'sleep'
  const { id } = props.wallet
  wallets.setSleeping(id, sleeping)
  dialog.close()
  notice.value = {
    message: sleeping ? 'Wallet put to sleep.' : 'Wallet is awake and ready to use.',
    undo: () => wallets.setSleeping(id, !sleeping),
  }
}

function undo() {
  notice.value?.undo?.()
  notice.value = undefined
}

function save() {
  tried.value = true
  if (wallets.nameError(name.value, props.wallet.id)) {
    notice.value = undefined
    return
  }
  wallets.rename(props.wallet.id, name.value)
  notice.value = { message: 'Changes saved.' }
}
</script>

<template>
  <OraModalSheet
    title="Edit Wallet"
    overline="Wallet"
    :covered="dialog.isOpen"
    @close="emit('close')"
  >
    <form :id="formId" class="flex flex-col gap-6 px-7 pt-2 pb-6" novalidate @submit.prevent="save">
      <p class="text-body-large text-on-surface-variant">
        Update your wallet info to keep everything organized.
      </p>

      <WalletPreview
        :name="name.trim()"
        :balance="wallet.balance"
        :family="wallet.family"
        :sleeping="wallet.sleeping"
      />

      <div
        v-if="wallet.sleeping"
        role="status"
        class="flex items-start gap-3 rounded-corner-lg-inc bg-surface-container-highest px-4.5 py-3.5"
      >
        <IconMoon class="mt-px size-5 flex-none text-on-surface-variant" />
        <span class="text-body-medium">
          <strong class="font-semibold">This wallet is asleep.</strong> It won’t show up when you
          add a transaction. Wake it up to use it again.
        </span>
      </div>

      <WalletNameField v-model="name" :error="error" />

      <div
        class="flex items-center gap-4 rounded-list-outer bg-surface-container-lowest py-3.5 pr-4 pl-5"
      >
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span :id="familyLabelId" class="text-title-small font-semibold text-on-surface/38">
            Family Wallet
          </span>
          <span :id="familyHintId" class="text-body-small text-on-surface-variant">
            {{
              wallet.family ? `Shared with ${familyData.name}.` : 'Only you can see this wallet.'
            }}
            This can’t be changed after the wallet is created.
          </span>
        </span>
        <OraSwitch
          :model-value="wallet.family"
          disabled
          :aria-labelledby="familyLabelId"
          :aria-describedby="familyHintId"
        />
      </div>

      <p class="flex items-center gap-2 text-body-small text-on-surface-variant">
        <IconLock class="size-4 flex-none" stroke-width="2.2" />
        Encrypted on this device before it syncs.
      </p>
    </form>

    <template #footer>
      <footer class="relative flex gap-3 bg-surface-container px-6 pt-4 pb-6">
        <OraSnackbar
          v-if="notice"
          :action="notice.undo ? 'Undo' : undefined"
          class="absolute inset-x-6 bottom-full"
          @action="undo"
        >
          <template #icon><IconCheck /></template>
          {{ notice.message }}
        </OraSnackbar>
        <OraButton
          v-if="wallet.sleeping"
          variant="outlined"
          size="m"
          class="flex-1! border-outline!"
          aria-haspopup="dialog"
          @click="dialog.open('wake')"
        >
          <IconSun class="size-5!" />
          Wake up
        </OraButton>
        <OraButton
          v-else
          variant="outlined"
          size="m"
          class="flex-1! border-error! text-error!"
          aria-haspopup="dialog"
          @click="dialog.open('sleep')"
        >
          <IconMoon class="size-5!" />
          Put to sleep
        </OraButton>
        <OraButton type="submit" size="m" class="flex-1!" :form="formId">
          <IconCheck />
          Save
        </OraButton>
      </footer>

      <!-- Inside the sheet, so that this component keeps one root for the sheet's transition. -->
      <OraOverlay>
        <SleepWakeDialog
          v-if="dialog.isOpen && dialog.payload"
          :action="dialog.payload"
          :wallet-name="wallet.name"
          :family="wallet.family"
          @close="dialog.close()"
          @confirm="confirm"
        />
      </OraOverlay>
    </template>
  </OraModalSheet>
</template>
