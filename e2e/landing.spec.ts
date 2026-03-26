import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Operating System')
    await expect(page.locator('h1')).toContainText('Small Nonprofits')
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Start Free Trial').first()).toBeVisible()
    await expect(page.getByText('Log In')).toBeVisible()
  })

  test('should display plain language translations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Money Categories')).toBeVisible()
    await expect(page.getByText('Match Your Bank')).toBeVisible()
    await expect(page.getByText('Money with Rules')).toBeVisible()
  })

  test('should display pricing plans', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('$79')).toBeVisible()
    await expect(page.getByText('$149')).toBeVisible()
    await expect(page.getByText('$199')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Dashboard', () => {
  test('should display sidebar navigation', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByText('Money Tracker')).toBeVisible()
    await expect(page.getByText('Annual Tax Report')).toBeVisible()
    await expect(page.getByText('Compliance')).toBeVisible()
    await expect(page.getByText('Donor Hub')).toBeVisible()
  })

  test('should show stats cards', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByText('Total Money In')).toBeVisible()
    await expect(page.getByText('Total Money Out')).toBeVisible()
    await expect(page.getByText('Active Donors')).toBeVisible()
  })
})
