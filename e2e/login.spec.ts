import { test, expect } from '@playwright/test'

test('opens the home page at the app root', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Good evening, Orata')
})

test('goes from login to the home page', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('textbox', { name: 'Email' }).fill('orata@email.com')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByPlaceholder('Enter your password').fill('example-password')
  await page.getByPlaceholder('Enter your secret key').fill('example-key')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL((url) => url.pathname === '/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Good evening, Orata')
})
