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
