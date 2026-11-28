<script setup lang="ts">
import { ref } from 'vue'
import IconClock from '@/components/icons/IconClock.vue'
import IconKeyboard from '@/components/icons/IconKeyboard.vue'
import OraIconButton from '../icon-button/OraIconButton.vue'
import PickerDialog from '../shared/PickerDialog.vue'
import OraTimePicker from './OraTimePicker.vue'

const props = defineProps<{
  /** 24-hour `HH:MM` the dialog opens on. */
  time: string
  title?: string
  hour12?: boolean
}>()

const emit = defineEmits<{ close: []; select: [time: string] }>()

const picked = ref(props.time)
const typing = ref(false)
</script>

<!-- M3 modal time picker, for `OraOverlay`, with a dial and a typed input mode. -->
<template>
  <PickerDialog
    :title="title ?? 'Select time'"
    @close="emit('close')"
    @confirm="emit('select', picked)"
  >
    <OraTimePicker v-model="picked" :hour12="hour12" :mode="typing ? 'input' : 'dial'" />
    <template #toggle>
      <OraIconButton :label="typing ? 'Use the dial' : 'Type the time'" @click="typing = !typing">
        <IconClock v-if="typing" />
        <IconKeyboard v-else />
      </OraIconButton>
    </template>
  </PickerDialog>
</template>
