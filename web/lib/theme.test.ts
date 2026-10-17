/**
 * Tests for theme resolution — the pure resolver, storage helpers, and the
 * inline pre-paint script, which must agree with the resolver on every case.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY, applyTheme, readStoredTheme, resolveTheme, themeScript } from "./theme";

const cases: [stored: string | null, prefersLight: boolean, expected: string][] = [
  [null, false, "night"],
  [null, true, "day"],
  ["day", false, "day"],
  ["night", true, "night"],
  ["sepia", true, "day"],
  ["sepia", false, "night"],
];

function stubMatchMedia(prefersLight: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: prefersLight && query === "(prefers-color-scheme: light)",
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("resolveTheme", () => {
  it.each(cases)("stored %s, prefers light %s → %s", (stored, prefersLight, expected) => {
    expect(resolveTheme(stored, prefersLight)).toBe(expected);
  });
});

describe("themeScript", () => {
  it.each(cases)("stored %s, prefers light %s → %s", (stored, prefersLight, expected) => {
    if (stored !== null) localStorage.setItem(THEME_STORAGE_KEY, stored);
    stubMatchMedia(prefersLight);

    new Function(themeScript)();

    expect(document.documentElement.getAttribute("data-theme")).toBe(expected);
  });

  it("falls back to the OS preference when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    stubMatchMedia(true);

    new Function(themeScript)();

    expect(document.documentElement.getAttribute("data-theme")).toBe("day");
    vi.restoreAllMocks();
  });
});

describe("storage helpers", () => {
  it("applyTheme sets the attribute and remembers the choice", () => {
    applyTheme("day", document.documentElement, localStorage);

    expect(document.documentElement.getAttribute("data-theme")).toBe("day");
    expect(readStoredTheme(localStorage)).toBe("day");
  });

  it("applyTheme still applies when storage throws", () => {
    const failing = {
      setItem: () => {
        throw new Error("quota");
      },
    };

    applyTheme("night", document.documentElement, failing);

    expect(document.documentElement.getAttribute("data-theme")).toBe("night");
  });

  it("readStoredTheme returns null without storage", () => {
    expect(readStoredTheme(undefined)).toBeNull();
  });
});
