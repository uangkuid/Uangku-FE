import { test, expect } from '@playwright/test'

test('adds a transaction in a sheet over the home page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'New transaction' }).click()
  await expect(page).toHaveURL((url) => url.pathname === '/transactions/new')

  const sheet = page.getByRole('dialog', { name: 'New transaction' })
  await expect(sheet.getByRole('textbox', { name: 'Amount' })).toBeFocused()
  await sheet.getByRole('textbox', { name: 'Amount' }).fill('45000')

  await sheet.getByRole('button', { name: 'More', exact: true }).click()
  const categories = page.getByRole('dialog', { name: 'Category' })
  await categories.getByRole('button', { name: 'Expand Food' }).click()
  await categories.getByRole('button', { name: 'Coffee' }).click()

  await sheet.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(sheet.getByRole('status')).toContainText('Expense Rp 45.000 saved')

  await sheet.getByRole('link', { name: 'Close' }).click()
  await expect(page).toHaveURL((url) => url.pathname === '/')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('dismisses the sheets one at a time on a tap outside', async ({ page }) => {
  await page.goto('/transactions/new')
  const sheet = page.getByRole('dialog', { name: 'New transaction' })
  await sheet.getByRole('button', { name: 'More', exact: true }).click()
  const categories = page.getByRole('dialog', { name: 'Category' })
  await expect(categories).toBeVisible()

  // The top left corner is outside both sheets.
  await page.mouse.click(8, 8)
  await expect(categories).toBeHidden()
  await expect(sheet).toBeVisible()

  await page.mouse.click(8, 8)
  await expect(page).toHaveURL((url) => url.pathname === '/')
})
