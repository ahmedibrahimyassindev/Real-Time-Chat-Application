import { expect, test } from '@playwright/test'

test('user can login and send a mock message', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Sarah Hassan' })).toBeVisible()

  await page.getByPlaceholder('Message').fill('Playwright smoke message')
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByText('Playwright smoke message')).toBeVisible()
})

test('user can register and reach chat', async ({ page }) => {
  await page.goto('/register')
  await page.getByLabel('Name').fill('Ahmed Yassin')
  await page.getByLabel('Email').fill('ahmedyassin@example.com')
  await page.getByLabel('Password', { exact: true }).fill('password123')
  await page.getByLabel('Confirm password').fill('password123')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/chat/)
  await expect(page.getByRole('heading', { name: 'Sarah Hassan' })).toBeVisible()
})

test('mobile viewport keeps primary routes reachable', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 })
  await page.goto('/login')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Channels' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Notifications' })).toBeVisible()
})
