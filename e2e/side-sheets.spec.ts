import { test, expect } from '@playwright/test'

test('filters transactions from a sheet over the list', async ({ page }) => {
  await page.goto('/transactions')
  await page.getByRole('button', { name: 'Filter', exact: true }).click()
  const sheet = page.getByRole('dialog', { name: 'Filter' })
  await expect(page).toHaveURL((url) => url.pathname === '/transactions')

  await sheet.getByRole('button', { name: 'This month' }).click()
  await sheet.getByRole('button', { name: /^Transaction Type/ }).click()
  await sheet.getByRole('checkbox', { name: 'Income' }).click()
  await sheet.getByRole('button', { name: 'Search' }).click()

  // The results are a state of the same screen.
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL((url) => url.pathname === '/transactions')
  await expect(page.getByRole('heading', { name: 'Showing 4 transactions' })).toBeVisible()
  const calendar = page.getByRole('region', { name: 'Calendar' })
  await expect(calendar).toBeHidden()

  await page.getByRole('button', { name: 'Remove type filter: Income' }).click()
  await expect(page.getByRole('heading', { name: 'Showing 13 transactions' })).toBeVisible()

  await page.getByRole('button', { name: /^Remove date filter/ }).click()
  await expect(calendar).toBeVisible()
  await expect(page.getByRole('button', { name: 'Filter', exact: true })).toBeFocused()
})

test('deletes a transaction from its detail sheet', async ({ page }) => {
  await page.goto('/transactions')
  await page.getByRole('button', { name: /Bitcoin.*Bank Jago/ }).click()
  const sheet = page.getByRole('dialog', { name: 'Transaction Detail' })

  await sheet.getByRole('button', { name: 'Delete' }).click()
  await sheet.getByRole('button', { name: 'Keep it' }).click()
  await expect(sheet.getByRole('button', { name: 'Delete' })).toBeFocused()

  await sheet.getByRole('button', { name: 'Delete' }).click()
  await sheet.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click()

  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByText('January 2025 · 12 transactions')).toBeVisible()
})

test('closes the dialog, then the sheet, then leaves the page on Back', async ({ page }) => {
  // Opening the wallet from the list leaves a page of the app to go back to.
  await page.goto('/wallets')
  await page.getByRole('link', { name: /Bank BCA/ }).click()
  const opener = page.getByRole('button', { name: 'Edit wallet' })
  await opener.click()
  const sheet = page.getByRole('dialog', { name: 'Edit Wallet' })
  await sheet.getByRole('button', { name: 'Put to sleep' }).click()
  const dialog = page.getByRole('alertdialog', { name: 'Put wallet to sleep?' })
  await expect(dialog).toBeVisible()

  await page.goBack()
  await expect(dialog).toHaveCount(0)
  await expect(sheet).toBeVisible()

  await page.goBack()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(opener).toBeFocused()
  await expect(page).toHaveURL((url) => url.pathname === '/wallets/bank-bca')

  await page.goBack()
  await expect(page).toHaveURL((url) => url.pathname === '/wallets')
})

test('puts a wallet to sleep and undoes it', async ({ page }) => {
  await page.goto('/wallets/bank-bca')
  await page.getByRole('button', { name: 'Edit wallet' }).click()
  const sheet = page.getByRole('dialog', { name: 'Edit Wallet' })

  await sheet.getByRole('button', { name: 'Put to sleep' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Put to sleep' }).click()
  await expect(page.getByRole('alertdialog')).toHaveCount(0)
  await expect(sheet.getByRole('button', { name: 'Wake up' })).toBeVisible()

  await sheet.getByRole('button', { name: 'Undo' }).click()
  await expect(sheet.getByRole('button', { name: 'Put to sleep' })).toBeVisible()

  // The button that was pressed is gone, so focus is no longer in the sheet.
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('opens a wallet that was just created', async ({ page }) => {
  await page.goto('/wallets')
  await page.getByRole('button', { name: 'New wallet' }).click()
  const sheet = page.getByRole('dialog', { name: 'New Wallet' })
  await sheet.getByRole('textbox', { name: 'Name' }).fill('Holiday savings')
  await sheet.getByRole('button', { name: 'Create wallet' }).click()
  await sheet.getByRole('button', { name: 'Open' }).click()

  await expect(page).toHaveURL((url) => url.pathname === '/wallets/holiday-savings')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Holiday savings')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
