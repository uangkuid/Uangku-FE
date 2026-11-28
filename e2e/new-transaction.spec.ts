import { test, expect, type Page } from '@playwright/test'

const atHome = (url: URL) => url.pathname === '/'

async function openForm(page: Page) {
  await page.getByRole('button', { name: 'New transaction' }).click()
  return page.getByRole('dialog', { name: 'New transaction' })
}

test('adds a transaction in a sheet over the current page', async ({ page }) => {
  await page.goto('/')
  const sheet = await openForm(page)
  await expect(page).toHaveURL(atHome)
  await expect(sheet.getByRole('textbox', { name: 'Amount' })).toBeFocused()
  await sheet.getByRole('textbox', { name: 'Amount' }).fill('45000')

  await sheet.getByRole('button', { name: 'More', exact: true }).click()
  const categories = page.getByRole('dialog', { name: 'Category' })
  await categories.getByRole('button', { name: 'Expand Food' }).click()
  await categories.getByRole('button', { name: 'Coffee' }).click()

  await sheet.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(sheet.getByRole('status')).toContainText('Expense Rp 45.000 saved')

  await sheet.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL(atHome)
})

test('dismisses the sheets one at a time on a tap outside', async ({ page }) => {
  await page.goto('/')
  const sheet = await openForm(page)
  await sheet.getByRole('button', { name: 'More', exact: true }).click()
  const categories = page.getByRole('dialog', { name: 'Category' })
  await expect(categories).toBeVisible()

  // The top left corner is outside both sheets.
  await page.mouse.click(8, 8)
  await expect(categories).toBeHidden()
  await expect(sheet).toBeVisible()

  await page.mouse.click(8, 8)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('only closes the form on Back', async ({ page }) => {
  // Signing in leaves a page of the app to go back to.
  await page.goto('/login')
  await page.getByRole('textbox', { name: 'Email' }).fill('orata@email.com')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByPlaceholder('Enter your password').fill('example-password')
  await page.getByPlaceholder('Enter your secret key').fill('example-key')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(atHome)
  const sheet = await openForm(page)
  await expect(sheet).toBeVisible()

  await page.goBack()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL(atHome)

  await page.goBack()
  await expect(page).toHaveURL((url) => url.pathname === '/login')
})
