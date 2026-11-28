import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraRadioButton from '../OraRadioButton.vue'

describe('OraRadioButton', () => {
  it('sets the model to its value when chosen', async () => {
    const radio = mount(OraRadioButton, {
      props: { modelValue: 'daily', value: 'weekly', name: 'frequency' },
    })

    await radio.get('input').setValue()

    expect(radio.emitted('update:modelValue')).toEqual([['weekly']])
  })
})
