/**
 * Readout — a labelled value with its unit, in the data typeface (design
 * system: Readout). Renders a dt/dd pair, so place readouts inside a <dl>.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ReadoutProps = {
  label: string;
  value: ReactNode;
  unit?: string;
  className?: string;
};

export function Readout({ label, value, unit, className }: ReadoutProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <dt className="font-mono text-label text-ink-muted uppercase">{label}</dt>
      <dd className="font-mono text-readout tabular-nums">
        {value}
        {unit && <span className="ml-1 text-data text-ink-muted">{unit}</span>}
      </dd>
    </div>
  );
}
