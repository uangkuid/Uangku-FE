<script setup lang="ts" generic="Value extends string">
import { computed } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import FamilyIcon from '@/components/ui/family-icon/FamilyIcon.vue'
import OraSleepingIcon from '@/components/ui/sleeping-icon/OraSleepingIcon.vue'

const props = defineProps<{
  /** Accessible name of the group. */
  label: string
  options: { value: Value; label: string; family?: boolean; sleeping?: boolean }[]
  /** Lays the options out in two columns. */
  twoColumns?: boolean
}>()

const selected = defineModel<Value[]>({ required: true })

const all = computed(() => selected.value.length === props.options.length)
const allState = computed(() => (all.value ? 'true' : selected.value.length ? 'mixed' : 'false'))

function toggleAll() {
  selected.value = all.value ? [] : props.options.map((option) => option.value)
}

function toggle(value: Value) {
  selected.value = selected.value.includes(value)
    ? selected.value.filter((other) => other !== value)
    : [...selected.value, value]
}

const rowClasses =
  'state-layer focus-ring transition-morph flex h-12 min-w-0 cursor-pointer items-center gap-3 pr-3 pl-2 text-left text-body-large'
const boxClasses = 'flex size-5 flex-none items-center justify-center rounded-[6px] border-2'
</script>

<!-- A group of checkboxes drawn as rows, led by "Select All". -->
<template>
  <div
    role="group"
    :aria-label="label"
    class="grid gap-x-2 gap-y-0.5"
    :class="twoColumns ? 'grid-cols-2' : 'grid-cols-1'"
  >
    <button
      type="button"
      role="checkbox"
      :aria-checked="allState"
      class="col-span-full rounded-[24px]"
      :class="rowClasses"
      @click="toggleAll"
    >
      <span
        aria-hidden="true"
        :class="[
          boxClasses,
          allState === 'false'
            ? 'border-on-surface-variant'
            : 'border-primary bg-primary text-on-primary',
        ]"
      >
        <IconCheck v-if="all" class="size-3.5" stroke-width="3.6" />
        <span v-else-if="allState === 'mixed'" class="h-0.5 w-2.5 rounded-full bg-current"></span>
      </span>
      Select All
    </button>

    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="checkbox"
      :aria-checked="selected.includes(option.value)"
      :class="[
        rowClasses,
        selected.includes(option.value)
          ? 'rounded-field bg-secondary-container font-semibold text-on-secondary-container'
          : 'rounded-[24px]',
      ]"
      @click="toggle(option.value)"
    >
      <span
        aria-hidden="true"
        :class="[
          boxClasses,
          selected.includes(option.value)
            ? 'border-primary bg-primary text-on-primary'
            : 'border-on-surface-variant',
        ]"
      >
        <IconCheck v-if="selected.includes(option.value)" class="size-3.5" stroke-width="3.6" />
      </span>
      <span class="truncate">{{ option.label }}</span>
      <FamilyIcon v-if="option.family" />
      <OraSleepingIcon v-if="option.sleeping" />
    </button>
  </div>
</template>
