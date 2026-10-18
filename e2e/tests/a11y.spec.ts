/**
 * Accessibility (S7.3, ADR 0027) — axe on the page once the viewer has
 * loaded, in both themes. Serious or critical violations fail. axe cannot
 * see inside the WebGL canvas, so its information must also exist as text,
 * which the journey tests check.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, openViewer, test } from "./fixtures";

for (const theme of ["night", "day"] as const) {
  test(`no serious or critical axe violations (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("skacube-theme", value), theme);
    await openViewer(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations
      .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
      .map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target.join(" ")),
      }));
    expect(blocking).toEqual([]);
  });
}
