/**
 * useTheme — the current theme from <html data-theme>, read as an external
 * store so the server render ("night") hydrates without a mismatch and then
 * follows every change, including ones made by the inline head script.
 * useThemeColour reads a token's current value, for canvases that cannot use
 * CSS directly.
 */
"use client";

import { useSyncExternalStore } from "react";
import { THEME_ATTRIBUTE, isTheme, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: [THEME_ATTRIBUTE] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(value) ? value : "night";
}

function getServerSnapshot(): Theme {
  return "night";
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useThemeColour(variable: string): string {
  return useSyncExternalStore(
    subscribe,
    () => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
    () => "",
  );
}
