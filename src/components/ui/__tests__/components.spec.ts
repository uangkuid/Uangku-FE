import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppButton from '../AppButton.vue'
import AppFab from '../AppFab.vue'
import AppIconButton from '../AppIconButton.vue'
import AppLinearProgress from '../AppLinearProgress.vue'
import AppCircularProgress from '../AppCircularProgress.vue'
import AppListItem from '../AppListItem.vue'
import AppTextField from '../AppTextField.vue'
import ComingSoonLink from '../ComingSoonLink.vue'

describe('AppButton', () => {
  it('is a non-submitting button that is not a toggle by default', () => {
    const button = mount(AppButton, { slots: { default: 'Save' } })

    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-pressed')).toBeUndefined()
  })

  it('exposes the toggle state and swaps shape when selected', async () => {
    const button = mount(AppButton, { props: { selected: false } })
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.classes()).toContain('rounded-[20px]')

    await button.setProps({ selected: true })
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.classes()).toContain('rounded-corner-md')
  })

  it('renders as a link without a button type', () => {
    const link = mount(AppButton, { props: { as: ComingSoonLink } })

    expect(link.element.tagName).toBe('A')
    expect(link.attributes('type')).toBeUndefined()
  })
})

describe('AppIconButton', () => {
  it('is named by its label', () => {
    const button = mount(AppIconButton, { props: { label: 'Notifications' } })

    expect(button.attributes('aria-label')).toBe('Notifications')
    expect(button.attributes('aria-pressed')).toBeUndefined()
  })
})

describe('AppFab', () => {
  it('shows its label only when extended', async () => {
    const fab = mount(AppFab, { props: { label: 'New transaction' } })
    expect(fab.text()).toBe('')
    expect(fab.attributes('title')).toBe('New transaction')

    await fab.setProps({ extended: true })
    expect(fab.text()).toBe('New transaction')
    expect(fab.attributes('title')).toBeUndefined()
  })
})

describe('AppTextField', () => {
  it('describes the input with the supporting text until there is an error', async () => {
    const field = mount(AppTextField, {
      props: { id: 'email', label: 'Email', modelValue: '', supportingText: 'Hint' },
    })
    expect(field.get('input').attributes('aria-describedby')).toBe('email-supporting')

    await field.setProps({ error: 'Email is required' })
    expect(field.get('input').attributes('aria-describedby')).toBe('email-error')
    expect(field.text()).not.toContain('Hint')
  })
})

describe('AppListItem', () => {
  it('is static unless it is given an element to act as', () => {
    const item = mount(AppListItem, { slots: { headline: 'Food' } })

    expect(item.find('a, button').exists()).toBe(false)
    expect(item.get('li > div').classes()).not.toContain('state-layer')
  })
})

describe('progress indicators', () => {
  it('reports the value of a linear indicator and drops the track when full', async () => {
    const progress = mount(AppLinearProgress, { props: { value: 1, max: 2, label: 'Step' } })
    expect(progress.attributes('aria-valuenow')).toBe('1')
    expect(progress.findAll(':scope > span')).toHaveLength(2)

    await progress.setProps({ value: 2 })
    expect(progress.findAll(':scope > span')).toHaveLength(1)
  })

  it('draws one circle when a circular indicator is empty or full', async () => {
    const progress = mount(AppCircularProgress, { props: { value: 0, label: 'Spent' } })
    expect(progress.findAll('circle')).toHaveLength(1)

    await progress.setProps({ value: 50 })
    expect(progress.findAll('circle')).toHaveLength(2)

    await progress.setProps({ value: 100 })
    expect(progress.findAll('circle')).toHaveLength(1)
  })
})
