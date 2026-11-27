import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraListItem from '../OraListItem.vue'

describe('OraListItem', () => {
  it('is static unless it is given an element to act as', () => {
    const item = mount(OraListItem, { slots: { headline: 'Food' } })

    expect(item.find('a, button').exists()).toBe(false)
    expect(item.get('li > div').classes()).not.toContain('state-layer')
  })
})
