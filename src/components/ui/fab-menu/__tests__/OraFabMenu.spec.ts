import { describe, it, expect } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import IconPlus from '@/components/icons/IconPlus.vue'
import OraFabMenu from '../OraFabMenu.vue'

describe('OraFabMenu', () => {
  it('turns into a close button while its actions show', async () => {
    const menu = mount(OraFabMenu, {
      attachTo: document.body,
      props: { label: 'Create', items: [{ value: 'wallet', label: 'Wallet', icon: IconPlus }] },
    })

    await menu.get('[aria-label="Create"]').trigger('click')
    await flushPromises()
    expect(menu.find('[aria-label="Close Create"]').exists()).toBe(true)
    expect(document.activeElement?.textContent).toContain('Wallet')

    await menu.get('[role="menuitem"]').trigger('click')
    await flushPromises()
    expect(menu.emitted('select')).toEqual([['wallet']])
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Create')
    menu.unmount()
  })
})
