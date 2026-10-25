/**
 * ApiStatus — client component that checks the API's health on mount and
 * shows the result as words, so state never relies on colour alone.
 */
"use client";

import { useEffect, useState } from "react";
import { Glyph } from "@/components/glyph";
import { fetchApiHealth, type ApiHealth } from "@/lib/health";

const labels: Record<ApiHealth | "checking", string> = {
  checking: "Checking…",
  ok: "OK",
  degraded: "Degraded",
  unreachable: "Unreachable",
};

const glyphs: Record<ApiHealth | "checking", string> = {
  checking: "□",
  ok: "■",
  degraded: "▲",
  unreachable: "▼",
};

export function ApiStatus() {
  const [health, setHealth] = useState<ApiHealth | "checking">("checking");

  useEffect(() => {
    let cancelled = false;
    fetchApiHealth().then((result) => {
      if (!cancelled) setHealth(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <p role="status" className="font-mono text-data tabular-nums">
      <Glyph className="mr-2 text-ink-muted">{glyphs[health]}</Glyph>API:{" "}
      <span data-testid="api-health">{labels[health]}</span>
    </p>
  );
}
