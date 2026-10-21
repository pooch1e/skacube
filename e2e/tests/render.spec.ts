/**
 * Render regression (S7.2) — one screenshot of the 3D view at the default
 * camera, compared with a committed baseline. Reduced motion keeps the camera
 * still; SwiftShader (playwright.config.ts) keeps the pixels deterministic.
 * When a shader change is intended, refresh with `--update-snapshots`.
 */
import { expect, openViewer, test } from "./fixtures";

test("3D view matches the baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openViewer(page);
  const scene = page.getByRole("img", { name: /^3D render of/ });
  await expect(scene.locator("canvas")).toBeVisible();
  await expect(scene).toHaveScreenshot("volume-default.png");
});
