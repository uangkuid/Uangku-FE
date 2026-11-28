import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraCircularProgress from '../OraCircularProgress.vue'

describe('OraCircularProgress', () => {
  it('draws one circle when a circular indicator is empty or full', async () => {
    const progress = mount(OraCircularProgress, { props: { value: 0, label: 'Spent' } })
    expect(progress.findAll('circle')).toHaveLength(1)

    await progress.setProps({ value: 50 })
    expect(progress.findAll('circle')).toHaveLength(2)

    await progress.setProps({ value: 100 })
    expect(progress.findAll('circle')).toHaveLength(1)
  })
})

describe('OraCircularProgress in motion', () => {
  it('reports no value while indeterminate', () => {
    const progress = mount(OraCircularProgress, { props: { label: 'Loading' } })

    expect(progress.attributes('aria-valuenow')).toBeUndefined()
    expect(progress.findAll('path')).toHaveLength(2)
  })

  it('is larger when wavy and drops the track when full', async () => {
    const progress = mount(OraCircularProgress, { props: { label: 'Step', value: 40, wavy: true } })
    expect(progress.attributes('style')).toContain('width: 48px')

    // A fresh mount, as the indicator eases toward a changed value over several frames.
    const full = mount(OraCircularProgress, { props: { label: 'Step', value: 100, wavy: true } })
    expect(full.find('[data-part="track"]').exists()).toBe(false)
  })
})
