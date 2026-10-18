/**
 * ViewerLoader — loads the viewer in the browser only (ADR 0011). three.js
 * and WebGL have nothing to do on the server, and `ssr: false` is only
 * allowed inside a client component, so the static page imports this.
 */
"use client";

import dynamic from "next/dynamic";
import { Panel } from "@/components/panel";

export const DATASET_ID = process.env.NEXT_PUBLIC_DATASET_ID || "eor-h21cm";

const Viewer = dynamic(() => import("./viewer").then((m) => m.Viewer), {
  ssr: false,
  loading: () => (
    <Panel title="Loading" className="min-h-80 items-center justify-center p-8">
      <p role="status">Starting the viewer…</p>
    </Panel>
  ),
});

export function ViewerLoader() {
  return <Viewer datasetId={DATASET_ID} />;
}
