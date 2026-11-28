<script setup lang="ts">
import { RouterLink } from 'vue-router'
import FamilyBenefits from '@/components/family/FamilyBenefits.vue'
import FamilyFlowLayout from '@/components/family/FamilyFlowLayout.vue'
import FamilyNetworkPanel from '@/components/family/FamilyNetworkPanel.vue'
import IconJoin from '@/components/icons/IconJoin.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
</script>

<template>
  <FamilyFlowLayout>
    <template #panel><FamilyNetworkPanel :badge="IconPlus" /></template>

    <span class="text-label-large text-on-surface-variant">Family</span>
    <div class="-mt-3 flex flex-col gap-4">
      <h1 class="font-display text-display-small font-bold">
        Create Your Family, Share Your Finances
      </h1>
      <p class="text-body-large text-on-surface-variant">
        With Family Sharing, you can securely share your wallet and transactions with up to 5 family
        members. Manage budgets together while keeping everything private &amp; secure.
      </p>
      <FamilyBenefits class="mt-2" />
      <div class="mt-4 flex flex-wrap gap-3">
        <OraButton
          :as="RouterLink"
          :to="{ name: 'family-join' }"
          variant="outlined"
          size="m"
          class="flex-1! border-outline!"
        >
          <IconJoin class="size-5!" />
          Join
        </OraButton>
        <OraButton :as="RouterLink" :to="{ name: 'family-create' }" size="m" class="flex-[1.4]!">
          <IconPlus class="size-5!" stroke-width="2.4" />
          Create
        </OraButton>
      </div>
    </div>
  </FamilyFlowLayout>
</template>
