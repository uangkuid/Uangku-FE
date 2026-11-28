import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraInputChip from '../OraInputChip.vue'

describe('OraInputChip', () => {
  it('asks to be removed by its button and by Delete', async () => {
    const chip = mount(OraInputChip, { props: { label: 'Ayu' } })

    await chip.get('[aria-label="Remove Ayu"]').trigger('click')
    await chip.get('button').trigger('keydown', { key: 'Delete' })

    expect(chip.emitted('remove')).toHaveLength(2)
    expect(chip.emitted('click')).toBeUndefined()
  })
})
