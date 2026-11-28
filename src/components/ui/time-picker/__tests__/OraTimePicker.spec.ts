import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraTimePicker from '../OraTimePicker.vue'

function mountPicker(props: { modelValue: string; hour12?: boolean; mode?: 'dial' | 'input' }) {
  const picker = mount(OraTimePicker, {
    props: {
      ...props,
      'onUpdate:modelValue': (value: string) => picker.setProps({ modelValue: value }),
    },
  })
  return picker
}

describe('OraTimePicker', () => {
  it('turns the dial with the arrow keys, one unit at a time', async () => {
    const picker = mountPicker({ modelValue: '23:59' })
    const dial = picker.get('[role="slider"]')

    await dial.trigger('keydown', { key: 'ArrowUp' })
    expect(picker.props('modelValue')).toBe('00:59')

    await picker.get('[aria-label="Minute, 59"]').trigger('click')
    await dial.trigger('keydown', { key: 'ArrowUp' })
    expect(picker.props('modelValue')).toBe('00:00')
  })

  it('picks from the inner ring and goes on to the minutes', async () => {
    const picker = mountPicker({ modelValue: '09:00' })
    const dial = picker.get('[role="slider"]')
    dial.element.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 256, height: 256 }) as DOMRect

    // Three o'clock on the inner ring is 15:00.
    await dial.trigger('pointerdown', { clientX: 128 + 68, clientY: 128, button: 0 })
    await dial.trigger('pointerup')

    expect(picker.props('modelValue')).toBe('15:00')
    expect(dial.attributes('aria-label')).toBe('Minute dial')
  })

  it('keeps 24-hour values behind a 12-hour clock', async () => {
    const picker = mountPicker({ modelValue: '00:30', hour12: true, mode: 'input' })
    const hour = picker.get<HTMLInputElement>('input[aria-label="Hour"]')
    expect(hour.element.value).toBe('12')

    await picker.findAll('[aria-label="AM or PM"] button')[1]?.trigger('click')
    expect(picker.props('modelValue')).toBe('12:30')

    await hour.setValue('3')
    expect(picker.props('modelValue')).toBe('15:30')
  })

  it('ignores a typed minute out of range', async () => {
    const picker = mountPicker({ modelValue: '10:15', mode: 'input' })
    const minute = picker.get<HTMLInputElement>('input[aria-label="Minute"]')

    await minute.setValue('75')
    await minute.trigger('blur')

    expect(picker.props('modelValue')).toBe('10:15')
    expect(minute.element.value).toBe('15')
  })
})
