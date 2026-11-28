<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StepProgress from '@/components/auth/StepProgress.vue'
import FamilyBenefits from '@/components/family/FamilyBenefits.vue'
import FamilyFlowLayout from '@/components/family/FamilyFlowLayout.vue'
import FamilyNetworkPanel from '@/components/family/FamilyNetworkPanel.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconJoin from '@/components/icons/IconJoin.vue'
import IconShield from '@/components/icons/IconShield.vue'
import OraAvatar from '@/components/ui/avatar/OraAvatar.vue'
import OraButton from '@/components/ui/button/OraButton.vue'
import OraIconButton from '@/components/ui/icon-button/OraIconButton.vue'
import OraTag from '@/components/ui/tag/OraTag.vue'
import { familyData } from '@/data/family'

const { invitation } = familyData
</script>

<template>
  <FamilyFlowLayout>
    <template #panel><FamilyNetworkPanel :badge="IconJoin" /></template>

    <OraIconButton
      :as="RouterLink"
      :to="{ name: 'family-join' }"
      label="Back to scan"
      class="-mb-2 -ml-2 self-start text-on-surface!"
    >
      <IconArrowLeft />
    </OraIconButton>
    <StepProgress :current="2" :total="3" />

    <div class="flex flex-col gap-4">
      <h1 class="font-display text-display-small font-bold">
        {{ invitation.family }} has invited you
      </h1>
      <div
        class="flex items-center gap-3.5 rounded-list-outer bg-surface-container-low px-4 py-3.5"
      >
        <OraAvatar size="sm" :initials="invitation.invitedBy.charAt(0)" />
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span class="text-title-small font-semibold">Invited by {{ invitation.invitedBy }}</span>
          <span class="text-body-small text-on-surface-variant">
            Family admin · {{ invitation.members }} members
          </span>
        </span>
        <OraTag size="m">Admin</OraTag>
      </div>
      <p class="text-body-large text-on-surface-variant">
        Join Family Sharing to manage money together with your trusted circle. Share wallets and
        track spending as a team, securely and privately.
      </p>
      <FamilyBenefits class="mt-1" />
      <p class="mt-1 flex items-start gap-2 text-body-small text-on-surface-variant">
        <IconShield class="mt-px size-4 flex-none" />
        Only join a family you know. Members can see the wallets and transactions shared with the
        family, not your personal ones.
      </p>
      <div class="mt-2 flex flex-wrap gap-3">
        <OraButton
          :as="RouterLink"
          :to="{ name: 'family-start' }"
          variant="outlined"
          size="m"
          class="flex-1! border-outline!"
        >
          Not now
        </OraButton>
        <OraButton :as="RouterLink" :to="{ name: 'family-join-kit' }" size="m" class="flex-[1.4]!">
          <IconJoin class="size-5!" />
          Join family
        </OraButton>
      </div>
    </div>
  </FamilyFlowLayout>
</template>
