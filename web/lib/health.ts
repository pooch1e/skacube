/**
 * API health check — fetches `/health` through the web origin (proxied to
 * Flask by Next rewrites) and reduces the result to a display state.
 */

export type ApiHealth = "ok" | "degraded" | "unreachable";

export async function fetchApiHealth(fetchImpl: typeof fetch = fetch): Promise<ApiHealth> {
  try {
    const response = await fetchImpl("/health", { cache: "no-store" });
    if (!response.ok) return "degraded";
    const body: unknown = await response.json();
    return isOkBody(body) ? "ok" : "degraded";
  } catch {
    return "unreachable";
  }
}

function isOkBody(body: unknown): boolean {
  return typeof body === "object" && body !== null && "status" in body && body.status === "ok";
}
