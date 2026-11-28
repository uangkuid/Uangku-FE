<script setup lang="ts">
import IconMoon from '@/components/icons/IconMoon.vue'
import IconSun from '@/components/icons/IconSun.vue'
import IconWallet from '@/components/icons/IconWallet.vue'
import ShapeScallop from '@/components/shapes/ShapeScallop.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraDialog from '@/components/ui/dialog/OraDialog.vue'
import { familyData } from '@/data/family'

defineProps<{
  /** What is being asked: to put the wallet to sleep, or to wake it. */
  action: 'sleep' | 'wake'
  walletName: string
  family: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <OraDialog
    :title="action === 'sleep' ? 'Put wallet to sleep?' : 'Wake up wallet?'"
    @close="emit('close')"
  >
    <template #hero>
      <div
        aria-hidden="true"
        class="relative flex h-42 flex-none items-center justify-center overflow-hidden rounded-corner-lg-inc"
        :class="action === 'sleep' ? 'bg-surface-container-highest' : 'bg-primary-container'"
      >
        <ShapeScallop
          class="absolute -top-15 -right-12.5 size-55 opacity-55"
          :class="action === 'sleep' ? 'text-outline-variant' : 'text-tertiary-container'"
        />
        <span
          class="relative flex h-23 w-33 flex-col justify-between rounded-corner-lg-inc bg-surface-container-lowest p-3.5 text-on-surface-variant shadow-elevation-1"
          :class="action === 'sleep' && 'opacity-60'"
        >
          <IconWallet class="size-5.5" />
          <span class="h-2 w-3/5 rounded-full bg-surface-container-highest"></span>
        </span>
        <span
          class="absolute top-7 left-[calc(50%+40px)] flex size-14 items-center justify-center rounded-corner-lg-inc text-surface-container-lowest shadow-elevation-1"
          :class="action === 'sleep' ? 'bg-inverse-surface' : 'bg-primary'"
        >
          <component :is="action === 'sleep' ? IconMoon : IconSun" class="size-7" />
        </span>
      </div>
    </template>

    <template v-if="action === 'sleep'">
      “{{ walletName }}” stops accepting new transactions until you wake it up. Its balance and
      history stay in your reports<template v-if="family"
        >, and {{ familyData.name }} members see it as asleep too</template
      >.
    </template>
    <template v-else>
      “{{ walletName }}” becomes active again, so you can record transactions in it and track it in
      your budget.
    </template>

    <template #actions>
      <OraButton variant="outlined" @click="emit('close')">Cancel</OraButton>
      <OraButton :class="action === 'sleep' && 'bg-error! text-on-error!'" @click="emit('confirm')">
        {{ action === 'sleep' ? 'Put to sleep' : 'Wake up' }}
      </OraButton>
    </template>
  </OraDialog>
</template>
