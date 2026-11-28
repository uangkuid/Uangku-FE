import { describe, it, expect } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import OraDatePicker from '../OraDatePicker.vue'
import OraDatePickerDialog from '../OraDatePickerDialog.vue'

const day = (label: string) => `[role="gridcell"][aria-label="${label}"]`

describe('OraDatePicker', () => {
  it('picks a day and refuses one outside the allowed range', async () => {
    const picker = mount(OraDatePicker, {
      props: { modelValue: undefined, today: '2025-01-05', max: '2025-01-20' },
    })
    expect(picker.get(day('5 January 2025')).attributes('aria-current')).toBe('date')
    expect(picker.get(day('21 January 2025')).attributes('disabled')).toBeDefined()
    expect(picker.get('[aria-label="Next month"]').attributes('disabled')).toBeDefined()

    await picker.get(day('12 January 2025')).trigger('click')

    expect(picker.emitted('update:modelValue')).toEqual([['2025-01-12']])
  })

  it('moves between months with the arrow keys', async () => {
    const picker = mount(OraDatePicker, {
      props: { modelValue: '2025-01-31' },
      attachTo: document.body,
    })

    await picker.get(day('31 January 2025')).trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()

    expect(document.activeElement?.getAttribute('aria-label')).toBe('1 February 2025')
    picker.unmount()
  })

  it('jumps to another year', async () => {
    const picker = mount(OraDatePicker, { props: { modelValue: '2025-01-05' } })
    await picker.get('[aria-label="January 2025, choose year"]').trigger('click')

    const year = picker.findAll('[data-year]').find((button) => button.text() === '2027')
    await year?.trigger('click')

    expect(picker.find(day('5 January 2027')).exists()).toBe(true)
  })
})

describe('OraDatePickerDialog', () => {
  it('reports the picked date only once confirmed', async () => {
    const dialog = mount(OraDatePickerDialog, { props: { date: '2025-01-05' } })
    await dialog.get(day('9 January 2025')).trigger('click')
    expect(dialog.emitted('select')).toBeUndefined()

    await dialog.get('form').trigger('submit')

    expect(dialog.emitted('select')).toEqual([['2025-01-09']])
    dialog.unmount()
  })

  it('does not confirm a typed date outside the range', async () => {
    const dialog = mount(OraDatePickerDialog, { props: { date: '2025-01-05', max: '2025-01-20' } })
    await dialog.get('[aria-label="Type the date"]').trigger('click')
    await dialog.get('input').setValue('2025-02-01')

    await dialog.get('form').trigger('submit')

    expect(dialog.text()).toContain('Pick a date in the allowed range')
    expect(dialog.emitted('select')).toBeUndefined()
    dialog.unmount()
  })
})
