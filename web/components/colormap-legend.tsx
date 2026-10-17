/**
 * ColormapLegend — the colour bar for the data colormap with tick labels in
 * real units (design system: Colormap). Ticks are placed by the caller, so a
 * non-linear stretch shows its true spacing. The bar is decorative; the
 * caption and ticks carry the information as text.
 */
import { cn } from "@/lib/utils";

export type LegendTick = { position: number; label: string };

type ColormapLegendProps = {
  gradient: string;
  ticks: readonly LegendTick[];
  caption: string;
  className?: string;
};

export function ColormapLegend({ gradient, ticks, caption, className }: ColormapLegendProps) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <figcaption className="font-mono text-label text-ink-muted uppercase">{caption}</figcaption>
      <div aria-hidden className="h-3 w-full border border-line" style={{ background: gradient }} />
      <ol className="relative h-5 font-mono text-data tabular-nums">
        {ticks.map((tick) => (
          <li
            key={tick.label}
            className="absolute -translate-x-1/2 whitespace-nowrap first:translate-x-0 last:-translate-x-full"
            style={{ left: `${tick.position * 100}%` }}
          >
            {tick.label}
          </li>
        ))}
      </ol>
    </figure>
  );
}
