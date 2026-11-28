import { describe, it, expect } from 'vitest'

import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from '../HomeView.vue'
import { useTransactionFormStore } from '@/stores/transactionForm'

function mountHome() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(HomeView, { global: { plugins: [pinia], stubs: { RouterLink: RouterLinkStub } } })
}

describe('HomeView', () => {
  it('shows the greeting, balance and recent transactions', () => {
    const wrapper = mountHome()

    expect(wrapper.get('h1').text()).toBe('Good evening, Orata')
    expect(wrapper.get('[data-testid="total-balance"]').text()).toBe('Rp 10.000.000')
    expect(wrapper.text()).toContain('−Rp 460.000')
    expect(wrapper.text()).toContain('+Rp 2.500.000')
  })

  it('hides and shows the balances', async () => {
    const wrapper = mountHome()

    await wrapper.get('[aria-label="Hide balance"]').trigger('click')
    expect(wrapper.get('[data-testid="total-balance"]').text()).toBe('Rp ••••••••')
    expect(wrapper.text()).not.toContain('Rp 1.250.000')

    await wrapper.get('[aria-label="Show balance"]').trigger('click')
    expect(wrapper.text()).toContain('Rp 1.250.000')
  })

  it('opens the new transaction form from the navigation', async () => {
    const wrapper = mountHome()
    const transactionForm = useTransactionFormStore()
    expect(transactionForm.isOpen).toBe(false)

    await wrapper.get('[aria-label="New transaction"]').trigger('click')

    expect(transactionForm.isOpen).toBe(true)
  })

  it('expands and collapses the navigation', async () => {
    const wrapper = mountHome()
    expect(wrapper.get('nav').text()).not.toContain('Orata Family')

    await wrapper.get('[aria-label="Expand navigation"]').trigger('click')
    expect(wrapper.get('nav').text()).toContain('Orata Family')

    await wrapper.get('[aria-label="Collapse navigation"]').trigger('click')
    expect(wrapper.get('nav').text()).not.toContain('Orata Family')
  })
})
