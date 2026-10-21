/**
 * Shared test fixtures — every test fails on browser console errors or
 * uncaught exceptions (this is what catches a shader that fails to compile,
 * which otherwise just leaves the 3D panel blank), plus helpers for waiting on
 * the viewer and reading the 2D slice's pixels.
 */
import { test as base, expect, type Page } from "@playwright/test";

export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      await use(errors);
      expect(errors, "browser console errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export async function openViewer(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Controls" })).toBeVisible();
}

export function channelSlider(page: Page) {
  return page.getByRole("slider", { name: "Channel" });
}

export function readout(page: Page, label: string) {
  return page.locator("dt", { hasText: label }).locator("xpath=following-sibling::dd");
}

export function sliceCanvas(page: Page) {
  return page.getByRole("img", { name: /^Channel \d+:/ });
}

/** The 2D slice's pixels as a data URL; 2D canvases are readable, unlike WebGL ones. */
export function slicePixels(page: Page) {
  return sliceCanvas(page).evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL());
}
