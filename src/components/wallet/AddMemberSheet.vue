<script setup lang="ts">
import { computed, ref } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraList from '@/components/ui/list/OraList.vue'
import OraSearchField from '@/components/ui/search-field/OraSearchField.vue'
import OraModalSheet from '@/components/ui/sheet/OraModalSheet.vue'
import { memberCandidates } from '@/data/wallets'

const props = defineProps<{
  walletName: string
  /** Emails already invited to the wallet. */
  invited: string[]
}>()

const emit = defineEmits<{
  close: []
  add: [emails: string[]]
}>()

const search = ref('')
const picked = ref<string[]>([])

const colors = [
  'bg-primary-container text-on-primary-container rounded-full',
  'bg-tertiary-container text-on-tertiary-container rounded-field',
  'bg-success-container text-on-success-container rounded-[50%_50%_50%_14px]',
  'bg-warning-container text-on-warning-container rounded-[22px_8px]',
]

const candidates = computed(() =>
  memberCandidates
    .filter((candidate) => !props.invited.includes(candidate.email))
    .map((candidate, index) => ({ ...candidate, color: colors[index % colors.length] })),
)
const shown = computed(() => {
  const query = search.value.trim().toLowerCase()
  return candidates.value.filter((candidate) => candidate.email.includes(query))
})

function toggle(email: string) {
  picked.value = picked.value.includes(email)
    ? picked.value.filter((other) => other !== email)
    : [...picked.value, email]
}

function add() {
  if (picked.value.length) emit('add', picked.value)
}
</script>

<template>
  <OraModalSheet title="Add Member" :overline="walletName" @close="emit('close')">
    <div class="flex flex-col gap-3 px-7 pt-1 pb-4">
      <p class="text-body-medium text-on-surface-variant">
        Pick people from your family to share
        <strong class="font-semibold text-on-surface">{{ walletName }}</strong> with.
      </p>
      <OraSearchField
        v-model="search"
        label="Search members by email"
        placeholder="Search"
        autocomplete="off"
        data-autofocus
      />
      <OraList role="listbox" aria-multiselectable="true" aria-label="Family members">
        <li
          v-for="candidate in shown"
          :key="candidate.email"
          role="option"
          :aria-selected="picked.includes(candidate.email)"
          tabindex="0"
          class="state-layer focus-ring transition-morph flex cursor-pointer items-center gap-3.5 rounded-list-inner px-4 py-3.5 first:rounded-t-list-outer last:rounded-b-list-outer"
          :class="
            picked.includes(candidate.email)
              ? 'rounded-list-outer bg-secondary-container inset-ring-2 inset-ring-primary'
              : 'bg-surface-container-high'
          "
          @click="toggle(candidate.email)"
          @keydown.space.prevent="toggle(candidate.email)"
          @keydown.enter.prevent="toggle(candidate.email)"
        >
          <span
            aria-hidden="true"
            class="flex size-11 flex-none items-center justify-center text-title-small font-semibold uppercase"
            :class="candidate.color"
          >
            {{ candidate.email.charAt(0) }}
          </span>
          <span class="flex min-w-0 flex-1 flex-col gap-0.5">
            <span class="truncate text-body-large font-semibold">{{ candidate.email }}</span>
            <span class="inline-flex items-center gap-1.5 text-body-medium text-on-surface-variant">
              <span
                v-if="candidate.status === 'Pending'"
                aria-hidden="true"
                class="size-2 rounded-full bg-warning"
              ></span>
              {{ candidate.status }}
            </span>
          </span>
          <span
            aria-hidden="true"
            class="flex size-7 flex-none items-center justify-center rounded-full border-2 [transition:scale_var(--motion-fast-spatial),background-color_var(--motion-fast-effects)]"
            :class="
              picked.includes(candidate.email)
                ? 'scale-108 border-primary bg-primary text-on-primary'
                : 'border-outline'
            "
          >
            <IconCheck v-if="picked.includes(candidate.email)" class="size-4" stroke-width="3" />
          </span>
        </li>
      </OraList>
      <p
        v-if="!shown.length"
        class="rounded-list-outer bg-surface-container p-6 text-center text-body-medium text-on-surface-variant"
      >
        {{
          candidates.length
            ? `No family member matches “${search}”.`
            : 'Everyone in your family has been invited.'
        }}
      </p>
    </div>

    <template #footer>
      <footer class="flex gap-3 border-t border-outline-variant px-7 pt-4 pb-6">
        <OraButton
          variant="outlined"
          size="m"
          class="flex-1! border-primary!"
          @click="emit('close')"
        >
          Cancel
        </OraButton>
        <OraButton size="m" class="flex-1!" :disabled="!picked.length" @click="add">
          {{ picked.length ? `Add ${picked.length}` : 'Add' }}
        </OraButton>
      </footer>
    </template>
  </OraModalSheet>
</template>
