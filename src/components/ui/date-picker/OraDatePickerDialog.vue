<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import IconCalendar from '@/components/icons/IconCalendar.vue'
import IconPencil from '@/components/icons/IconPencil.vue'
import { formatWeekday, type IsoDate } from '@/utils/date'
import OraIconButton from '../icon-button/OraIconButton.vue'
import PickerDialog from '../shared/PickerDialog.vue'
import OraTextField from '../text-field/OraTextField.vue'
import OraDatePicker from './OraDatePicker.vue'

const props = defineProps<{
  /** The date the dialog opens on. */
  date?: IsoDate
  title?: string
  min?: IsoDate
  max?: IsoDate
  today?: IsoDate
}>()

const emit = defineEmits<{ close: []; select: [date: IsoDate] }>()

const picked = ref(props.date)
const typing = ref(false)
const fieldId = useId()

const outOfRange = computed(() => {
  if (!picked.value) return false
  return Boolean((props.min && picked.value < props.min) || (props.max && picked.value > props.max))
})

const typed = computed({
  get: () => picked.value ?? '',
  set: (value: string) => (picked.value = value || undefined),
})
</script>

<!-- M3 modal date picker, for `OraOverlay`, with a calendar and a typed input mode. -->
<template>
  <PickerDialog
    :title="title ?? 'Select date'"
    :confirm-disabled="!picked || outOfRange"
    @close="emit('close')"
    @confirm="picked && emit('select', picked)"
  >
    <p
      class="w-full border-b border-outline-variant px-2 pb-3 font-display text-headline-large font-bold"
      aria-live="polite"
    >
      {{ picked ? formatWeekday(picked) : 'No date' }}
    </p>
    <OraDatePicker v-if="!typing" v-model="picked" :min="min" :max="max" :today="today" />
    <div v-else class="w-full px-2 pt-2">
      <!-- `class` lands on the input, whose own calendar follows the theme. -->
      <OraTextField
        :id="fieldId"
        v-model="typed"
        variant="outlined"
        type="date"
        label="Date"
        :min="min"
        :max="max"
        :error="outOfRange ? 'Pick a date in the allowed range' : undefined"
        class="scheme-light dark:scheme-dark"
      />
    </div>
    <template #toggle>
      <OraIconButton
        :label="typing ? 'Use the calendar' : 'Type the date'"
        @click="typing = !typing"
      >
        <IconCalendar v-if="typing" />
        <IconPencil v-else />
      </OraIconButton>
    </template>
  </PickerDialog>
</template>
