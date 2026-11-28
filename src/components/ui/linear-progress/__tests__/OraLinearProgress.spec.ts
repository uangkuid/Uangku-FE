import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraLinearProgress from '../OraLinearProgress.vue'

describe('OraLinearProgress', () => {
  it('reports the value of a linear indicator and drops the track when full', async () => {
    const progress = mount(OraLinearProgress, { props: { value: 1, max: 2, label: 'Step' } })
    expect(progress.attributes('aria-valuenow')).toBe('1')
    expect(progress.findAll(':scope > span')).toHaveLength(2)

    await progress.setProps({ value: 2 })
    expect(progress.findAll(':scope > span')).toHaveLength(1)
  })
})

describe('OraLinearProgress in motion', () => {
  it('reports no value while indeterminate', () => {
    const progress = mount(OraLinearProgress, { props: { label: 'Loading' } })

    expect(progress.attributes('aria-valuenow')).toBeUndefined()
    expect(progress.attributes('aria-valuemax')).toBeUndefined()
    expect(progress.find('[data-part="active"]').exists()).toBe(true)
  })

  it('cuts a wave out of the active indicator and keeps its value', () => {
    const progress = mount(OraLinearProgress, { props: { label: 'Step', value: 50, wavy: true } })

    expect(progress.attributes('aria-valuenow')).toBe('50')
    expect(progress.find('[data-part="active"]').exists()).toBe(true)
    expect(progress.find('[data-part="track"]').exists()).toBe(true)
  })
})
