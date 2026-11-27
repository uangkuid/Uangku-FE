import { afterEach, describe, it, expect, vi } from 'vitest'

import { mount, RouterLinkStub } from '@vue/test-utils'
import LoginView from '../LoginView.vue'

const push = vi.fn<(to: unknown) => void>()

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRouter: () => ({ push }),
}))

afterEach(() => {
  vi.useRealTimers()
  push.mockClear()
})

function mountLogin() {
  return mount(LoginView, { global: { stubs: { RouterLink: RouterLinkStub } } })
}

async function goToUnlockStep() {
  const wrapper = mountLogin()
  await wrapper.get('#email').setValue('  orata@email.com ')
  await wrapper.get('form').trigger('submit')
  return wrapper
}

describe('LoginView', () => {
  it('requires a well-formed email before step 2', async () => {
    const wrapper = mountLogin()

    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[role="alert"]').text()).toBe('Email is required')

    await wrapper.get('#email').setValue('orata@email')
    expect(wrapper.get('[role="alert"]').text()).toContain('Email is invalid')
    expect(wrapper.find('#password').exists()).toBe(false)
  })

  it('shows the locked, trimmed email on step 2', async () => {
    const wrapper = await goToUnlockStep()

    const locked = wrapper.get<HTMLInputElement>('#locked-email')
    expect(locked.element.value).toBe('orata@email.com')
    expect(locked.attributes('readonly')).toBeDefined()
  })

  it('requires a password and secret key to sign in', async () => {
    const wrapper = await goToUnlockStep()

    await wrapper.get('form').trigger('submit')
    expect(wrapper.findAll('[role="alert"]').map((alert) => alert.text())).toEqual([
      'Password is required',
      'Secret key is required',
    ])
    expect(wrapper.find('[role="status"]').exists()).toBe(false)

    await wrapper.get('#password').setValue('example-password')
    await wrapper.get('#secret-key').setValue('example-key')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('opens the home page shortly after unlocking', async () => {
    const wrapper = await goToUnlockStep()
    await wrapper.get('#password').setValue('example-password')
    await wrapper.get('#secret-key').setValue('example-key')
    vi.useFakeTimers()

    await wrapper.get('form').trigger('submit')
    expect(push).not.toHaveBeenCalled()

    vi.runAllTimers()
    expect(push).toHaveBeenCalledExactlyOnceWith({ name: 'home' })
  })

  it('stays on the login page when a credential changes before it opens', async () => {
    const wrapper = await goToUnlockStep()
    await wrapper.get('#password').setValue('example-password')
    await wrapper.get('#secret-key').setValue('example-key')
    vi.useFakeTimers()

    await wrapper.get('form').trigger('submit')
    await wrapper.get('#password').setValue('another-password')

    vi.runAllTimers()
    expect(push).not.toHaveBeenCalled()
  })

  it('toggles password visibility', async () => {
    const wrapper = await goToUnlockStep()

    expect(wrapper.get('#password').attributes('type')).toBe('password')
    await wrapper.get('[aria-label="Show password"]').trigger('click')
    expect(wrapper.get('#password').attributes('type')).toBe('text')
  })

  it('clears the credentials when going back to the email step', async () => {
    const wrapper = await goToUnlockStep()
    await wrapper.get('#password').setValue('example-password')
    await wrapper.get('#secret-key').setValue('example-key')

    await wrapper.get('[aria-label="Change email"]').trigger('click')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get<HTMLInputElement>('#password').element.value).toBe('')
    expect(wrapper.get<HTMLInputElement>('#secret-key').element.value).toBe('')
  })
})
