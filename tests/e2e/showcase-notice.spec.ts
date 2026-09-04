import { expect, test } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 800 }
] as const

for (const viewport of viewports) {
  test(`showcase notice stays one line tall on ${viewport.name}`, async ({
    page
  }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const notice = page.getByRole('complementary', {
      name: 'Portfolio showcase notice'
    })
    await expect(notice).toHaveCSS('height', '36px')

    const wraps = await notice.locator('div').evaluate((element) => {
      return element.scrollHeight > element.clientHeight
    })
    expect(wraps).toBe(false)
  })
}
