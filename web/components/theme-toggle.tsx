/**
 * ThemeToggle — switches Night and Day and remembers the choice. Labelled in
 * words, so the current theme never relies on colour alone. The theme lives
 * on <html data-theme>, set before paint by the inline script; this reads it
 * as an external store so the server render ("night") hydrates without a
 * mismatch and then shows the real value.
 */
"use client";

import { useSyncExternalStore } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { THEME_ATTRIBUTE, applyTheme, isTheme, type Theme } from "@/lib/theme";

const labels: Record<Theme, string> = { night: "Night", day: "Day" };

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

function storage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={theme}
      aria-label="Theme"
      onValueChange={(value) => {
        if (isTheme(value)) applyTheme(value, document.documentElement, storage());
      }}
    >
      {(Object.keys(labels) as Theme[]).map((value) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {labels[value]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
