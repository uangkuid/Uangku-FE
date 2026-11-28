<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconFamily from '@/components/icons/IconFamily.vue'
import IconLock from '@/components/icons/IconLock.vue'
import WalletNameField from '@/components/wallet/WalletNameField.vue'
import WalletPreview from '@/components/wallet/WalletPreview.vue'
import OraAvatar from '@/components/ui/avatar/OraAvatar.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraModalSheet from '@/components/ui/sheet/OraModalSheet.vue'
import OraSnackbar from '@/components/ui/snackbar/OraSnackbar.vue'
import OraSwitch from '@/components/ui/switch/OraSwitch.vue'
import { familyData } from '@/data/family'
import { useWalletsStore } from '@/stores/wallets'

const props = defineProps<{
  /** Starts as a family wallet. */
  initialFamily?: boolean
}>()

const emit = defineEmits<{
  close: []
  /** The wallet just created is to be shown. */
  show: [walletId: string]
}>()

const wallets = useWalletsStore()
const formId = useId()
const familyLabelId = useId()
const familyHintId = useId()

const name = ref('')
const family = ref(!!props.initialFamily)
const tried = ref(false)
/** The wallet this sheet created, while its confirmation is up. */
const created = ref<{ id: string; message: string }>()

const error = computed(() => (tried.value ? wallets.nameError(name.value) : ''))

// A further change starts another wallet.
watch([name, family], () => {
  if (!created.value) return
  created.value = undefined
  tried.value = false
})

function save() {
  // The name of the wallet just created is taken by now: saving again does nothing.
  if (created.value) return
  tried.value = true
  if (wallets.nameError(name.value)) return
  const wallet = wallets.create(name.value, family.value)
  // The name is the user's own again, not a duplicate of what was saved.
  tried.value = false
  const kind = family.value ? 'Family wallet' : 'Wallet'
  created.value = { id: wallet.id, message: `${kind} “${wallet.name}” created` }
}
</script>

<template>
  <OraModalSheet title="New Wallet" overline="Wallet" @close="emit('close')">
    <form :id="formId" class="flex flex-col gap-6 px-7 pt-2 pb-6" novalidate @submit.prevent="save">
      <p class="text-body-large text-on-surface-variant">
        Create a wallet to track your money. Make it a Family Wallet to share it with your family
        members.
      </p>

      <WalletPreview :name="name.trim()" :balance="0" :family="family" />
      <WalletNameField v-model="name" :error="error" />

      <div class="flex flex-col gap-2.5">
        <div
          class="flex items-center gap-4 rounded-list-outer bg-surface-container-lowest py-3.5 pr-4 pl-5"
        >
          <span class="flex min-w-0 flex-1 flex-col gap-0.5">
            <span :id="familyLabelId" class="text-title-small font-semibold">Family Wallet</span>
            <span :id="familyHintId" class="text-body-small text-on-surface-variant">
              Share this wallet with {{ familyData.name }}.
            </span>
          </span>
          <OraSwitch
            v-model="family"
            :aria-labelledby="familyLabelId"
            :aria-describedby="familyHintId"
          />
        </div>
        <div
          v-if="family"
          role="status"
          class="flex flex-col gap-3 rounded-list-outer bg-tertiary-container px-4.5 py-4 text-on-tertiary-container"
        >
          <span class="flex items-center gap-2.5 text-body-medium font-semibold">
            <IconFamily class="size-5" />
            {{ familyData.members.length }} members will see this wallet
          </span>
          <span class="flex -space-x-2">
            <OraAvatar
              v-for="member in familyData.members"
              :key="member"
              :initials="member.charAt(0)"
              class="ring-2 ring-tertiary-container"
            />
          </span>
          <span class="text-body-small">
            Its balance and every transaction in it are shared. It’s encrypted with the Family
            Secret Key.
          </span>
        </div>
      </div>

      <p class="flex items-center gap-2 text-body-small text-on-surface-variant">
        <IconLock class="size-4 flex-none" stroke-width="2.2" />
        Encrypted on this device before it syncs.
      </p>
    </form>

    <template #footer>
      <footer class="relative flex gap-3 bg-surface-container px-6 pt-4 pb-6">
        <OraSnackbar
          v-if="created"
          action="Open"
          class="absolute inset-x-6 bottom-full"
          @action="emit('show', created.id)"
        >
          <template #icon><IconCheck /></template>
          {{ created.message }}
        </OraSnackbar>
        <OraButton variant="outlined" size="m" class="flex-1!" @click="emit('close')">
          Cancel
        </OraButton>
        <OraButton type="submit" size="m" class="flex-[1.4]!" :form="formId">
          <IconCheck />
          {{ family ? 'Create family wallet' : 'Create wallet' }}
        </OraButton>
      </footer>
    </template>
  </OraModalSheet>
</template>
