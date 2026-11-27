import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraButton from '../OraButton.vue'
import ComingSoonLink from '../../coming-soon-link/ComingSoonLink.vue'

describe('OraButton', () => {
  it('is a non-submitting button that is not a toggle by default', () => {
    const button = mount(OraButton, { slots: { default: 'Save' } })

    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-pressed')).toBeUndefined()
  })

  it('exposes the toggle state and swaps shape when selected', async () => {
    const button = mount(OraButton, { props: { selected: false } })
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.classes()).toContain('rounded-[20px]')

    await button.setProps({ selected: true })
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.classes()).toContain('rounded-corner-md')
  })

  it('renders as a link without a button type', () => {
    const link = mount(OraButton, { props: { as: ComingSoonLink } })

    expect(link.element.tagName).toBe('A')
    expect(link.attributes('type')).toBeUndefined()
  })
})
