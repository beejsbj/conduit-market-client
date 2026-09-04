import { expect, test } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 800 }
] as const

for (const viewport of viewports) {
  test(`adding a product opens the cart HUD on ${viewport.name}`, async ({
    page
  }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await page.getByRole('button', { name: /add to cart/i }).first().click()

    await expect(
      page.getByRole('heading', { name: 'Subtotal' })
    ).toBeInViewport({ timeout: 1500 })
  })
}
