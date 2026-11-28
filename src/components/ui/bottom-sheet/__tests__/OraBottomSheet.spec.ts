import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraBottomSheet from '../OraBottomSheet.vue'

describe('OraBottomSheet', () => {
  it('asks to close from its handle, its scrim and Escape', async () => {
    const sheet = mount(OraBottomSheet, { props: { title: 'Options' }, attachTo: document.body })
    expect(document.activeElement?.getAttribute('role')).toBe('dialog')

    await sheet.get('[aria-label="Close sheet"]').trigger('click')
    await sheet.get('[data-testid="scrim"]').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(sheet.emitted('close')).toHaveLength(3)
    sheet.unmount()
  })

  it('closes after a long enough drag of the handle, not a short one', async () => {
    const sheet = mount(OraBottomSheet, { props: { title: 'Options' } })
    const handle = sheet.get('[aria-label="Close sheet"]')

    async function drag(distance: number) {
      await handle.trigger('pointerdown', { clientY: 0 })
      await handle.trigger('pointermove', { clientY: distance })
      await handle.trigger('pointerup')
      await handle.trigger('click')
    }

    await drag(40)
    expect(sheet.emitted('close')).toBeUndefined()

    await drag(150)
    expect(sheet.emitted('close')).toHaveLength(1)
    sheet.unmount()
  })
})
