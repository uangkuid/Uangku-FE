import { describe, it, expect } from 'vitest'

import { h } from 'vue'
import { mount } from '@vue/test-utils'
import OraTooltip from '../OraTooltip.vue'

describe('OraTooltip', () => {
  it('shows on keyboard focus, describes its control and closes on Escape', async () => {
    const tooltip = mount(OraTooltip, {
      props: { text: 'Download the report' },
      slots: {
        default: ({ describedBy }: { describedBy: string }) =>
          h('button', { 'aria-describedby': describedBy }),
      },
    })
    const tip = tooltip.get('[role="tooltip"]')
    const hidden = () => tip.element.parentElement?.classList.contains('invisible')
    expect(tooltip.get('button').attributes('aria-describedby')).toBe(tip.attributes('id'))
    expect(hidden()).toBe(true)

    await tooltip.get('button').trigger('focusin')
    expect(hidden()).toBe(false)

    await tooltip.get('button').trigger('keydown', { key: 'Escape' })
    expect(hidden()).toBe(true)
  })
})
