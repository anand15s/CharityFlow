import { test, expect } from '@playwright/test'

test.describe('CharityFlow Dashboard', () => {
  test('landing page loads with correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/CharityFlow/)
    await expect(page.locator('text=The Operating System for')).toBeVisible()
  })

  test('landing page shows pricing tiers', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Starter')).toBeVisible()
    await expect(page.locator('text=Growth')).toBeVisible()
    await expect(page.locator('text=Pro')).toBeVisible()
  })

  test('dashboard overview loads with stats', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('text=Money Coming In')).toBeVisible()
    await expect(page.locator('text=Compliance Score')).toBeVisible()
  })

  test('transactions page shows money tracker', async ({ page }) => {
    await page.goto('/dashboard/transactions')
    await expect(page.locator('text=Money Tracker')).toBeVisible()
    await expect(page.locator('text=Add Transaction')).toBeVisible()
  })

  test('compliance page shows location info', async ({ page }) => {
    await page.goto('/dashboard/compliance')
    await expect(page.locator('text=Compliance Co-Pilot')).toBeVisible()
    await expect(page.locator('text=Health Score')).toBeVisible()
  })

  test('tax center shows Form 990 status', async ({ page }) => {
    await page.goto('/dashboard/tax')
    await expect(page.locator('text=Tax Center')).toBeVisible()
    await expect(page.locator('text=Annual Tax Report')).toBeVisible()
  })

  test('sidebar navigation works', async ({ page }) => {
    await page.goto('/dashboard')
    await page.click('text=Donor Hub')
    await expect(page).toHaveURL(/\/dashboard\/donors/)
    await page.click('text=Events')
    await expect(page).toHaveURL(/\/dashboard\/events/)
  })
})
