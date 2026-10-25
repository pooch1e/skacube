/**
 * Glyph — a decorative pixel glyph from Departure Mono (blocks, shapes,
 * stars). Hidden from assistive tech: the words next to it always carry the
 * meaning.
 */
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Glyph({ className, ...props }: ComponentProps<"span">) {
  return <span aria-hidden className={cn("select-none", className)} {...props} />;
}
