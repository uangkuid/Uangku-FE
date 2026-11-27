import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraFab from '../OraFab.vue'

describe('OraFab', () => {
  it('shows its label only when extended', async () => {
    const fab = mount(OraFab, { props: { label: 'New transaction' } })
    expect(fab.text()).toBe('')
    expect(fab.attributes('title')).toBe('New transaction')

    await fab.setProps({ extended: true })
    expect(fab.text()).toBe('New transaction')
    expect(fab.attributes('title')).toBeUndefined()
  })
})
