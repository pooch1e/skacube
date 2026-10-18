/**
 * Core journey (S7.1) on the synthetic 16³ cube: the page and API come up,
 * the viewer renders, the channel slider moves the slice and readouts
 * together, the theme toggle persists, and the reduced-motion and no-WebGL2
 * paths behave (S5.4, S5.5).
 */
import {
  channelSlider,
  expect,
  openViewer,
  readout,
  sliceCanvas,
  slicePixels,
  test,
} from "./fixtures";

test("page loads and reaches the API", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Skacube" })).toBeVisible();
  await expect(page.getByTestId("api-health")).toHaveText("OK");
});

test("viewer renders the 3D canvas and the 2D slice", async ({ page }) => {
  await openViewer(page);
  const scene = page.getByRole("img", {
    name: /^3D render of Synthetic test cube/,
  });
  await expect(scene).toBeVisible();
  await expect(scene.locator("canvas")).toBeVisible();
  await expect(sliceCanvas(page)).toBeVisible();
});

test("channel slider moves the slice and the readouts together", async ({ page }) => {
  await openViewer(page);
  const slider = channelSlider(page);
  await expect(readout(page, "Channel")).toHaveText("9/ 16");
  const before = await slicePixels(page);

  await slider.focus();
  await page.keyboard.press("End");

  await expect(readout(page, "Channel")).toHaveText("16/ 16");
  await expect(readout(page, "Frequency")).toHaveText("109.05MHz");
  await expect(slider).toHaveAttribute("aria-valuetext", /^Channel 16 of 16, 109\.05 MHz/);
  await expect(sliceCanvas(page)).toHaveAccessibleName(/^Channel 16: 109\.05 MHz/);
  expect(await slicePixels(page)).not.toEqual(before);

  await page.keyboard.press("Home");
  await expect(readout(page, "Channel")).toHaveText("1/ 16");
});

test("theme toggle switches to Day and remembers it", async ({ page }) => {
  await openViewer(page);
  await page.getByRole("radio", { name: "Day" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "day");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "day");
});

test.describe("motion preference", () => {
  test("auto-rotates by default", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await openViewer(page);
    await expect(page.getByRole("button", { name: "Auto-rotate" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("starts still under reduced motion, and can still be turned on", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openViewer(page);
    const toggle = page.getByRole("button", { name: "Auto-rotate" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});

test("without WebGL2 the 2D slice and readouts still work", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type === "webgl2") return null;
      return (getContext as (...args: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof getContext;
  });
  await openViewer(page);
  await expect(page.getByText("The 3D view needs WebGL2")).toBeVisible();
  await expect(page.getByRole("button", { name: "Auto-rotate" })).toHaveCount(0);
  await expect(sliceCanvas(page)).toBeVisible();
  await channelSlider(page).focus();
  await page.keyboard.press("End");
  await expect(readout(page, "Channel")).toHaveText("16/ 16");
});
