import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraIconButton from '../OraIconButton.vue'

describe('OraIconButton', () => {
  it('is named by its label', () => {
    const button = mount(OraIconButton, { props: { label: 'Notifications' } })

    expect(button.attributes('aria-label')).toBe('Notifications')
    expect(button.attributes('aria-pressed')).toBeUndefined()
  })
})
