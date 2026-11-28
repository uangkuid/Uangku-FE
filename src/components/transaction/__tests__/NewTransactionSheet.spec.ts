import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'

import { enableAutoUnmount, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useWalletsStore } from '@/stores/wallets'
import NewTransactionSheet from '../NewTransactionSheet.vue'

// The form listens on `window`, so each test has to leave nothing behind.
enableAutoUnmount(afterEach)
beforeEach(() => setActivePinia(createPinia()))

function mountForm() {
  return mount(NewTransactionSheet, { attachTo: document.body })
}

function button(wrapper: VueWrapper, text: string) {
  const found = wrapper.findAll('button').find((candidate) => candidate.text() === text)
  if (!found) throw new Error(`No button "${text}"`)
  return found
}

const amount = (wrapper: VueWrapper) => wrapper.get<HTMLInputElement>('input[inputmode="numeric"]')
const alerts = (wrapper: VueWrapper) => wrapper.findAll('[role="alert"]').map((item) => item.text())
const status = (wrapper: VueWrapper) => wrapper.find('[role="status"]')

async function pressEscape() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  await Promise.resolve()
}

describe('NewTransactionSheet', () => {
  it('formats the amount as Rupiah digits and adds quick amounts', async () => {
    const wrapper = mountForm()

    await amount(wrapper).setValue('00a25000')
    expect(amount(wrapper).element.value).toBe('25.000')

    await button(wrapper, '+100rb').trigger('click')
    expect(amount(wrapper).element.value).toBe('125.000')
  })

  it('rolls the digits that a quick amount changes, then shows the field again', async () => {
    vi.useFakeTimers()
    const wrapper = mountForm()
    await amount(wrapper).setValue('680000')

    await button(wrapper, '+50rb').trigger('click')

    // The value is set at once. Only the digits that change turn: 6 up to 7, and 8 down to 3.
    expect(amount(wrapper).element.value).toBe('730.000')
    const reels = wrapper.findAll('[data-testid="reel"]')
    expect(reels.map((reel) => reel.attributes('data-direction'))).toEqual(['up', 'down'])
    expect(amount(wrapper).classes()).toContain('text-transparent')

    // Each strip runs from the old digit to the new one, with one more to overshoot into.
    // An upward strip starts at its top; a downward one starts at its bottom.
    const [growing = '', shrinking = ''] = reels.map((reel) => reel.text().replace(/\s/g, ''))
    expect([growing[0], growing[growing.length - 2]]).toEqual(['6', '7'])
    expect([shrinking[shrinking.length - 1], shrinking[1]]).toEqual(['8', '3'])

    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.find('[data-testid="reel"]').exists()).toBe(false)
    expect(amount(wrapper).classes()).not.toContain('text-transparent')
    vi.useRealTimers()
  })

  it('stops the roll as soon as the amount is typed', async () => {
    const wrapper = mountForm()
    await button(wrapper, '+50rb').trigger('click')
    expect(wrapper.find('[data-testid="reel"]').exists()).toBe(true)

    await amount(wrapper).setValue('7000')

    expect(wrapper.find('[data-testid="reel"]').exists()).toBe(false)
    expect(amount(wrapper).classes()).not.toContain('text-transparent')
  })

  it('leaves out sleeping wallets and picks another default', () => {
    useWalletsStore().setSleeping('cash', true)
    const wrapper = mountForm()

    const offered = wrapper.findAll('button[aria-pressed]').map((chip) => chip.text())
    expect(offered).not.toContain('Cash')
    expect(button(wrapper, 'Bank Permata').attributes('aria-pressed')).toBe('true')
  })

  it('asks for an amount and a category before saving', async () => {
    const wrapper = mountForm()
    expect(alerts(wrapper)).toEqual([])

    await button(wrapper, 'Save').trigger('click')

    expect(alerts(wrapper)).toEqual(['Enter an amount above Rp 0', 'Choose a category'])
    expect(status(wrapper).exists()).toBe(false)
  })

  it('confirms a complete expense until it is undone or changed', async () => {
    const wrapper = mountForm()
    await amount(wrapper).setValue('50000')
    await button(wrapper, 'Food').trigger('click')

    await button(wrapper, 'Save').trigger('click')
    expect(status(wrapper).text()).toContain('Expense Rp 50.000 saved')

    await button(wrapper, 'Undo').trigger('click')
    expect(status(wrapper).exists()).toBe(false)

    await button(wrapper, 'Save').trigger('click')
    await button(wrapper, '+10rb').trigger('click')
    expect(status(wrapper).exists()).toBe(false)
  })

  it('offers other save options in a menu', async () => {
    const wrapper = mountForm()
    await wrapper.get('[aria-label="More save options"]').trigger('click')
    expect(wrapper.findAll('[role="menuitem"]').map((item) => item.text())).toEqual([
      'Save & add another',
      'Save as recurring',
    ])

    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('needs two different wallets for a transfer, and no category', async () => {
    const wrapper = mountForm()
    await button(wrapper, '⇄ Transfer').trigger('click')
    await amount(wrapper).setValue('1000')
    expect(wrapper.find('[role="radiogroup"][aria-labelledby]').exists()).toBe(false)

    const [from] = wrapper.findAll('[role="group"][aria-labelledby]')
    await from!.findAll('button')[0]!.trigger('click') // Cash, the same as "To wallet"
    expect(alerts(wrapper)).toEqual(['Pick two different wallets'])
    await button(wrapper, 'Save').trigger('click')
    expect(status(wrapper).exists()).toBe(false)

    await from!.findAll('button')[1]!.trigger('click')
    await button(wrapper, 'Save').trigger('click')
    expect(status(wrapper).text()).toContain('Transfer Rp 1.000 saved')
  })

  it('warns that a family wallet is shared', async () => {
    const wrapper = mountForm()
    expect(wrapper.text()).not.toContain('members will see this transaction')

    await button(wrapper, 'Bank BCA').trigger('click')

    expect(wrapper.text()).toContain('Orata Family members will see this transaction')
  })

  it('picks a category from the full list, including a subcategory', async () => {
    const wrapper = mountForm()
    await button(wrapper, 'More').trigger('click')
    expect(button(wrapper, 'More').attributes('aria-expanded')).toBe('true')

    await wrapper.get('[aria-label="Expand Bills"]').trigger('click')
    await button(wrapper, 'Water').trigger('click')

    expect(button(wrapper, 'More').attributes('aria-expanded')).toBe('false')
    // It takes the last place in the grid, so the choice stays visible.
    const checked = wrapper.get('[role="radiogroup"][aria-labelledby] [aria-checked="true"]')
    expect(checked.text()).toBe('Water')
  })

  it('selects a date only once it is confirmed', async () => {
    const wrapper = mountForm()
    await button(wrapper, 'Pick date…').trigger('click')
    await wrapper.get('[aria-label^="3 Jan 2025"]').trigger('click')
    expect(wrapper.text()).toContain('Fri, 3 Jan 2025 · has income & expense')
    expect(wrapper.text()).toContain('Pick date…')

    await button(wrapper, 'Confirm').trigger('click')

    expect(wrapper.find('[role="grid"]').exists()).toBe(false)
    expect(button(wrapper, 'Fri, 3 Jan').attributes('aria-pressed')).toBe('true')
  })

  it('walks the calendar with the arrow keys', async () => {
    const wrapper = mountForm()
    await button(wrapper, 'Pick date…').trigger('click')

    await wrapper.get('[data-date="2025-01-05"]').trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.get('[role="grid"]').attributes('aria-label')).toBe('Dec 2024')
    expect(wrapper.get('[data-date="2024-12-29"]').attributes('aria-selected')).toBe('true')
  })

  it('asks to be closed by the Close and Cancel buttons', async () => {
    const wrapper = mountForm()

    await wrapper.get('[aria-label="Close"]').trigger('click')
    await button(wrapper, 'Cancel').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(2)
  })

  it('dismisses the top sheet on a tap outside it', async () => {
    const wrapper = mountForm()
    const scrim = wrapper.get('[data-testid="scrim"]')
    await button(wrapper, 'More').trigger('click')

    await scrim.trigger('pointerdown')
    await scrim.trigger('click')
    expect(button(wrapper, 'More').attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('close')).toBeUndefined()

    await scrim.trigger('pointerdown')
    await scrim.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('only closes an open menu on the first tap outside', async () => {
    const wrapper = mountForm()
    const scrim = wrapper.get('[data-testid="scrim"]')
    await button(wrapper, 'Pick date…').trigger('click')

    for (const opener of ['[aria-label="More save options"]', '[aria-haspopup="listbox"]']) {
      await wrapper.get(opener).trigger('click')

      await scrim.trigger('pointerdown')
      await scrim.trigger('click')

      expect(wrapper.find('[role="menu"], [role="listbox"]').exists()).toBe(false)
      expect(wrapper.emitted('close')).toBeUndefined()
    }
  })

  it('backs out one layer at a time with Escape', async () => {
    const wrapper = mountForm()
    await button(wrapper, 'Pick date…').trigger('click')
    await button(wrapper, 'More').trigger('click')

    await pressEscape()
    expect(button(wrapper, 'More').attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[role="grid"]').exists()).toBe(true)

    await pressEscape()
    expect(wrapper.find('[role="grid"]').exists()).toBe(false)
    expect(wrapper.emitted('close')).toBeUndefined()

    await pressEscape()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
