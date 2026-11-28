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

describe('OraTextField with a floating label', () => {
  it('floats the label while the field has focus or a value', async () => {
    const field = mount(OraTextField, {
      props: { id: 'name', label: 'Name', modelValue: '', variant: 'filled' },
    })
    const label = field.get('label')
    expect(label.attributes('for')).toBe('name')
    expect(label.classes()).toContain('text-body-large')

    await field.get('input').trigger('focus')
    expect(label.classes()).toContain('text-body-small')

    await field.get('input').trigger('blur')
    expect(label.classes()).toContain('text-body-large')

    await field.setProps({ modelValue: 'Ayu' })
    expect(label.classes()).toContain('text-body-small')
  })

  it('opens a notch in the outline only for a floated label', async () => {
    const field = mount(OraTextField, {
      props: { id: 'name', label: 'Name', modelValue: '', variant: 'outlined' },
    })
    expect(field.get('legend').classes()).toContain('max-w-0')

    await field.setProps({ modelValue: 'Ayu' })
    expect(field.get('legend').classes()).toContain('max-w-full')
  })

  it('keeps the label up on inputs that show their format', () => {
    const field = mount(OraTextField, {
      props: { id: 'date', label: 'Date', modelValue: '', variant: 'outlined' },
      attrs: { type: 'date' },
    })

    expect(field.get('label').classes()).toContain('text-body-small')
  })
})
