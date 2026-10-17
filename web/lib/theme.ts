/**
 * Theme resolution — Night or Day. A stored choice wins; otherwise the OS
 * preference decides (light → Day, anything else → Night, the default).
 *
 * `themeScript` repeats `resolveTheme` as an inline string because it must run
 * in <head> before first paint, ahead of any bundle (see layout.tsx). The tests
 * run both against the same cases so they cannot drift.
 */

export type Theme = "night" | "day";

export const THEMES: readonly Theme[] = ["night", "day"];
export const THEME_STORAGE_KEY = "skacube-theme";
export const THEME_ATTRIBUTE = "data-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "night" || value === "day";
}

export function resolveTheme(stored: string | null, prefersLight: boolean): Theme {
  if (isTheme(stored)) return stored;
  return prefersLight ? "day" : "night";
}

export function readStoredTheme(storage: Pick<Storage, "getItem"> | undefined): string | null {
  try {
    return storage?.getItem(THEME_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function applyTheme(
  theme: Theme,
  root: HTMLElement,
  storage: Pick<Storage, "setItem"> | undefined,
): void {
  root.setAttribute(THEME_ATTRIBUTE, theme);
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the theme still applies for this page.
  }
}

export const themeScript = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}if(t!=="night"&&t!=="day"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"day":"night"}document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTRIBUTE,
)},t)})()`;
