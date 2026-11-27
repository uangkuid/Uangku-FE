import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraTextField from '../OraTextField.vue'

describe('OraTextField', () => {
  it('describes the input with the supporting text until there is an error', async () => {
    const field = mount(OraTextField, {
      props: { id: 'email', label: 'Email', modelValue: '', supportingText: 'Hint' },
    })
    expect(field.get('input').attributes('aria-describedby')).toBe('email-supporting')

    await field.setProps({ error: 'Email is required' })
    expect(field.get('input').attributes('aria-describedby')).toBe('email-error')
    expect(field.text()).not.toContain('Hint')
  })
})
