import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraChip from '../OraChip.vue'

describe('OraChip', () => {
  it('is a toggle only as a filter chip', () => {
    const filter = mount(OraChip)
    const assist = mount(OraChip, { props: { variant: 'assist' } })

    expect(filter.attributes('aria-pressed')).toBe('false')
    expect(assist.attributes('aria-pressed')).toBeUndefined()
  })
})
