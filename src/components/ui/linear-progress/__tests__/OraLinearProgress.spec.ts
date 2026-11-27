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
