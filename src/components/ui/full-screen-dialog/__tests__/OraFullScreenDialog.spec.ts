import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraFullScreenDialog from '../OraFullScreenDialog.vue'

describe('OraFullScreenDialog', () => {
  it('closes or confirms from its header', async () => {
    const dialog = mount(OraFullScreenDialog, { props: { title: 'New goal', action: 'Save' } })

    await dialog.get('[aria-label="Close"]').trigger('click')
    await dialog.findAll('button')[1]?.trigger('click')

    expect(dialog.emitted('close')).toHaveLength(1)
    expect(dialog.emitted('action')).toHaveLength(1)
    dialog.unmount()
  })
})
