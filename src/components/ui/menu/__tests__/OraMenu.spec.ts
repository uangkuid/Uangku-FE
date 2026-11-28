import { describe, it, expect } from 'vitest'

import { h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import OraMenu from '../OraMenu.vue'

function mountMenu() {
  return mount(OraMenu, {
    attachTo: document.body,
    props: {
      label: 'Actions',
      items: [
        { value: 'edit', label: 'Edit' },
        { value: 'archive', label: 'Archive', disabled: true },
        { value: 'delete', label: 'Delete' },
      ],
    },
    slots: {
      trigger: ({ props, toggle }: { props: object; toggle: () => void }) =>
        h('button', { ...props, onClick: toggle }, 'Open'),
    },
  })
}

describe('OraMenu', () => {
  it('skips disabled items and returns focus to its trigger after a choice', async () => {
    const menu = mountMenu()
    const trigger = menu.get('button')

    await trigger.trigger('click')
    await flushPromises()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement?.textContent).toContain('Edit')

    await menu.get('[role="menuitem"]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement?.textContent).toContain('Delete')

    await menu.findAll('[role="menuitem"]')[2]?.trigger('click')
    expect(menu.emitted('select')).toEqual([['delete']])
    expect(menu.find('[role="menu"]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
    menu.unmount()
  })

  it('closes on Escape without choosing', async () => {
    const menu = mountMenu()
    await menu.get('button').trigger('click')

    await menu.get('[role="menu"]').trigger('keydown', { key: 'Escape' })

    expect(menu.find('[role="menu"]').exists()).toBe(false)
    expect(menu.emitted('select')).toBeUndefined()
    menu.unmount()
  })
})
