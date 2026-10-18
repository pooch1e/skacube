/**
 * ThemeToggle — switches Night and Day and remembers the choice. Labelled in
 * words, so the current theme never relies on colour alone. The theme lives
 * on <html data-theme>, set before paint by the inline script (see useTheme).
 */
"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { applyTheme, isTheme, type Theme } from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

const labels: Record<Theme, string> = { night: "Night", day: "Day" };

function storage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function ThemeToggle() {
  const theme = useTheme();

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
