<script setup lang="ts">
import { ref } from 'vue'
import IconBell from '@/components/icons/IconBell.vue'
import IconCalendar from '@/components/icons/IconCalendar.vue'
import IconUser from '@/components/icons/IconUser.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraCard from '@/components/ui/card/OraCard.vue'
import OraCheckbox from '@/components/ui/checkbox/OraCheckbox.vue'
import OraChip from '@/components/ui/chip/OraChip.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraInputChip from '@/components/ui/input-chip/OraInputChip.vue'
import OraRadioButton from '@/components/ui/radio-button/OraRadioButton.vue'
import OraSlider from '@/components/ui/slider/OraSlider.vue'
import OraStandardButtonGroup from '@/components/ui/standard-button-group/OraStandardButtonGroup.vue'

const notify = ref(true)
const all = ref(false)
const frequency = ref('weekly')
const frequencies = ['daily', 'weekly', 'monthly']
const volume = ref(40)
const balance = ref(20)
const price = ref<[number, number]>([20, 70])
const rating = ref(3)
const people = ref(['Ayu', 'Budi', 'Citra'])
const sizes = ['xs', 's', 'm', 'l', 'xl'] as const
</script>

<template>
  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-checkbox">
    <h2 id="ds-checkbox" class="text-title-large font-medium">Checkboxes and radio buttons</h2>
    <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
      <label class="flex cursor-pointer items-center gap-1">
        <OraCheckbox v-model="notify" />Notify me
      </label>
      <label class="flex cursor-pointer items-center gap-1">
        <OraCheckbox v-model="all" :indeterminate="!all" />Indeterminate
      </label>
      <label class="flex cursor-pointer items-center gap-1">
        <OraCheckbox v-model="notify" error />Error
      </label>
      <OraCheckbox :model-value="true" disabled aria-label="Disabled checkbox on" />
      <OraCheckbox :model-value="false" disabled aria-label="Disabled checkbox off" />
    </div>
    <div role="radiogroup" aria-label="Frequency" class="flex flex-wrap items-center gap-x-6">
      <label
        v-for="option in frequencies"
        :key="option"
        class="flex cursor-pointer items-center gap-1 capitalize"
      >
        <OraRadioButton v-model="frequency" name="ds-frequency" :value="option" />{{ option }}
      </label>
      <OraRadioButton
        model-value="on"
        value="on"
        name="ds-disabled-radio"
        disabled
        aria-label="Disabled radio button"
      />
    </div>
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-slider">
    <h2 id="ds-slider" class="text-title-large font-medium">Sliders</h2>
    <OraSlider v-model="volume" label="Standard" />
    <OraSlider v-model="balance" label="Centered" :min="-50" :max="50" centered />
    <OraSlider v-model="price" label="Range" :format="(value) => `${value}%`" />
    <OraSlider v-model="rating" label="With stops" :max="10" stops />
    <OraSlider
      v-for="size in sizes"
      :key="size"
      v-model="volume"
      :label="`Size ${size}`"
      :size="size"
    />
    <OraSlider :model-value="60" label="Disabled" disabled />
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-chips">
    <h2 id="ds-chips" class="text-title-large font-medium">Assist, suggestion and input chips</h2>
    <div class="flex flex-wrap items-center gap-3">
      <OraChip variant="assist">
        <template #icon><IconCalendar /></template>
        Add to calendar
      </OraChip>
      <OraChip variant="assist" elevated>Elevated assist</OraChip>
      <OraChip variant="suggestion">Suggestion</OraChip>
      <OraChip variant="suggestion" disabled>Disabled</OraChip>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <OraInputChip
        v-for="person in people"
        :key="person"
        :label="person"
        @remove="people = people.filter((other) => other !== person)"
      >
        <template #leading><IconUser /></template>
      </OraInputChip>
      <OraButton v-if="people.length < 3" variant="text" @click="people = ['Ayu', 'Budi', 'Citra']">
        Reset
      </OraButton>
    </div>
  </OraCard>

  <OraCard variant="outlined" class="gap-4 p-5" aria-labelledby="ds-standard-group">
    <h2 id="ds-standard-group" class="text-title-large font-medium">Standard button group</h2>
    <OraStandardButtonGroup label="Example actions">
      <OraButton>Save</OraButton>
      <OraButton variant="tonal">Share</OraButton>
      <OraIconButton variant="tonal" label="Notify"><IconBell /></OraIconButton>
    </OraStandardButtonGroup>
  </OraCard>
</template>
