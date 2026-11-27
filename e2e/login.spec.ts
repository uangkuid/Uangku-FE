import { test, expect } from '@playwright/test'

test('opens the login screen from the app root', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome Back to Uangku')
})
