<script setup lang="ts">
import { ref } from 'vue'
import OraBottomSheet from '@/components/ui/bottom-sheet/OraBottomSheet.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraCarousel from '@/components/ui/carousel/OraCarousel.vue'
import OraDatePicker from '@/components/ui/date-picker/OraDatePicker.vue'
import OraDatePickerDialog from '@/components/ui/date-picker/OraDatePickerDialog.vue'
import OraFullScreenDialog from '@/components/ui/full-screen-dialog/OraFullScreenDialog.vue'
import OraLoadingIndicator from '@/components/ui/loading-indicator/OraLoadingIndicator.vue'
import OraOverlay from '@/components/ui/overlay/OraOverlay.vue'
import { useOverlay } from '@/components/ui/shared/useOverlay'
import OraTextField from '@/components/ui/text-field/OraTextField.vue'
import OraTimePicker from '@/components/ui/time-picker/OraTimePicker.vue'
import OraTimePickerDialog from '@/components/ui/time-picker/OraTimePickerDialog.vue'
import { formatLongDate, type IsoDate } from '@/utils/date'

// The prototype's "today".
const today = '2025-01-05'
const date = ref<IsoDate | undefined>(today)
const time = ref('14:30')
const title = ref('')

const datePicker = useOverlay()
const timePicker = useOverlay()
const bottomSheet = useOverlay()
const fullScreen = useOverlay()

const slides = [
  { label: 'Food', color: 'bg-primary-container text-on-primary-container' },
  { label: 'Transport', color: 'bg-secondary-container text-on-secondary-container' },
  { label: 'Bills', color: 'bg-tertiary-container text-on-tertiary-container' },
  { label: 'Savings', color: 'bg-success-container text-on-success-container' },
  { label: 'Health', color: 'bg-warning-container text-on-warning-container' },
]
const carousels = ['multi-browse', 'hero', 'uncontained'] as const
</script>

<template>
  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-loading">
    <h2 id="ds-loading" class="text-title-large font-medium">Loading indicator</h2>
    <div class="flex flex-wrap items-center gap-6">
      <OraLoadingIndicator label="Loading" />
      <OraLoadingIndicator label="Loading, contained" contained />
      <OraLoadingIndicator label="Loading, large" contained :size="96" />
    </div>
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-date">
    <h2 id="ds-date" class="text-title-large font-medium">Date and time pickers</h2>
    <p class="text-body-medium text-on-surface-variant">
      {{ date ? formatLongDate(date) : 'No date' }}, {{ time }}
    </p>
    <div class="flex flex-wrap gap-3">
      <OraButton aria-haspopup="dialog" @click="datePicker.open()">Pick a date</OraButton>
      <OraButton variant="tonal" aria-haspopup="dialog" @click="timePicker.open()">
        Pick a time
      </OraButton>
    </div>
    <div class="flex flex-wrap items-start gap-8">
      <div class="rounded-corner-lg bg-surface-container-high p-3">
        <OraDatePicker v-model="date" :today="today" />
      </div>
      <div class="rounded-corner-lg bg-surface-container-high p-2">
        <OraTimePicker v-model="time" hour12 />
      </div>
    </div>
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-carousel">
    <h2 id="ds-carousel" class="text-title-large font-medium">Carousel</h2>
    <OraCarousel
      v-for="variant in carousels"
      :key="variant"
      :label="variant"
      :variant="variant"
      :items="slides"
    >
      <template #item="{ item }">
        <div class="flex h-40 items-end p-4 text-title-medium" :class="item.color">
          {{ item.label }}
        </div>
      </template>
    </OraCarousel>
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-more-overlays">
    <h2 id="ds-more-overlays" class="text-title-large font-medium">
      Bottom sheet and full-screen dialog
    </h2>
    <div class="flex flex-wrap gap-3">
      <OraButton aria-haspopup="dialog" @click="bottomSheet.open()">Open bottom sheet</OraButton>
      <OraButton variant="tonal" aria-haspopup="dialog" @click="fullScreen.open()">
        Open full-screen dialog
      </OraButton>
    </div>
  </OraCard>

  <OraOverlay>
    <OraDatePickerDialog
      v-if="datePicker.isOpen"
      :date="date"
      :today="today"
      @close="datePicker.close()"
      @select="((date = $event), datePicker.close())"
    />
  </OraOverlay>
  <OraOverlay>
    <OraTimePickerDialog
      v-if="timePicker.isOpen"
      :time="time"
      @close="timePicker.close()"
      @select="((time = $event), timePicker.close())"
    />
  </OraOverlay>
  <OraOverlay>
    <OraBottomSheet
      v-if="bottomSheet.isOpen"
      title="Bottom sheet title"
      @close="bottomSheet.close()"
    >
      <p class="text-body-medium">Escape, the scrim, the handle and Back all close it.</p>
    </OraBottomSheet>
  </OraOverlay>
  <OraOverlay>
    <OraFullScreenDialog
      v-if="fullScreen.isOpen"
      title="New goal"
      action="Save"
      :action-disabled="!title"
      @close="fullScreen.close()"
      @action="fullScreen.close()"
    >
      <OraTextField
        id="ds-goal"
        v-model="title"
        variant="outlined"
        label="Goal name"
        data-autofocus
      />
    </OraFullScreenDialog>
  </OraOverlay>
</template>
