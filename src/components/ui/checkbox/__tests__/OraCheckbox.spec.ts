import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraCheckbox from '../OraCheckbox.vue'

describe('OraCheckbox', () => {
  it('toggles its model and passes attributes to the input', async () => {
    const checkbox = mount(OraCheckbox, {
      props: { modelValue: false },
      attrs: { 'aria-label': 'Notify', class: 'extra' },
    })
    const input = checkbox.get('input')
    expect(input.attributes('aria-label')).toBe('Notify')
    expect(checkbox.classes()).toContain('extra')

    await input.setValue(true)

    expect(checkbox.emitted('update:modelValue')).toEqual([[true]])
  })

  it('stays indeterminate while asked to', async () => {
    const checkbox = mount(OraCheckbox, { props: { modelValue: false, indeterminate: true } })
    const input = checkbox.get('input').element
    expect(input.indeterminate).toBe(true)

    await checkbox.setProps({ indeterminate: false })

    expect(input.indeterminate).toBe(false)
  })
})
