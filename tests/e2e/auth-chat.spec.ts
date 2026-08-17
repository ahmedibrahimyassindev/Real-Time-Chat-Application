import { expect, test } from '@playwright/test'

test('user can login and send a mock message', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Sarah Hassan' })).toBeVisible()

  await page.getByPlaceholder('Message').fill('Playwright smoke message')
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByText('Playwright smoke message')).toBeVisible()
})

test('mobile viewport keeps primary routes reachable', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 })
  await page.goto('/login')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Channels' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Notifications' })).toBeVisible()
})
