import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraSlider from '../OraSlider.vue'

describe('OraSlider', () => {
  it('moves by steps and stops at the ends', async () => {
    const slider = mount(OraSlider, { props: { modelValue: 95, step: 10, label: 'Volume' } })
    const handle = slider.get('[role="slider"]')

    await handle.trigger('keydown', { key: 'ArrowRight' })
    await slider.setProps({ modelValue: 100 })
    await handle.trigger('keydown', { key: 'ArrowRight' })
    await handle.trigger('keydown', { key: 'Home' })

    expect(slider.emitted('update:modelValue')).toEqual([[100], [0]])
  })

  it('keeps the handles of a range in order', async () => {
    const slider = mount(OraSlider, {
      props: { modelValue: [20, 30] as [number, number], label: 'Price' },
    })
    const [start, end] = slider.findAll('[role="slider"]')
    expect(start?.attributes('aria-label')).toBe('Price, start')
    expect(end?.attributes('aria-valuemin')).toBe('20')

    await start?.trigger('keydown', { key: 'End' })

    expect(slider.emitted('update:modelValue')).toEqual([[[30, 30]]])
  })

  it('takes the value under a press', async () => {
    const slider = mount(OraSlider, { props: { modelValue: 0, label: 'Volume' } })
    slider.element.getBoundingClientRect = () => ({ left: 100, width: 200 }) as DOMRect

    await slider.trigger('pointerdown', { clientX: 150, button: 0 })

    expect(slider.emitted('update:modelValue')).toEqual([[25]])
  })

  it('ignores input while disabled', async () => {
    const slider = mount(OraSlider, { props: { modelValue: 50, label: 'Volume', disabled: true } })

    await slider.get('[role="slider"]').trigger('keydown', { key: 'End' })

    expect(slider.emitted('update:modelValue')).toBeUndefined()
  })
})
