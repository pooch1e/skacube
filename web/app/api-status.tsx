/**
 * ApiStatus — client component that checks the API's health on mount and
 * shows the result as words, so state never relies on colour alone.
 */
"use client";

import { useEffect, useState } from "react";
import { fetchApiHealth, type ApiHealth } from "@/lib/health";

const labels: Record<ApiHealth | "checking", string> = {
  checking: "Checking…",
  ok: "OK",
  degraded: "Degraded",
  unreachable: "Unreachable",
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
      API: <span data-testid="api-health">{labels[health]}</span>
    </p>
  );
}
