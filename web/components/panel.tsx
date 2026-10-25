/**
 * Panel — a square, bordered surface with an optional label heading
 * (design system: Panel). The heading names the region for screen readers.
 */
import type { ComponentProps, ReactNode } from "react";
import { Glyph } from "@/components/glyph";
import { cn } from "@/lib/utils";

type PanelProps = Omit<ComponentProps<"section">, "title"> & {
  title?: ReactNode;
  actions?: ReactNode;
};

export function Panel({ title, actions, className, children, ...props }: PanelProps) {
  return (
    <section
      className={cn("flex flex-col border border-line bg-surface shadow-elevation", className)}
      {...props}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-2">
          {title && (
            <h2 className="font-mono text-label text-ink-muted uppercase">
              <Glyph className="mr-2 text-ink-muted">■</Glyph>
              {title}
            </h2>
          )}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
