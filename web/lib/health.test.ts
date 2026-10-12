/**
 * Tests for fetchApiHealth — maps API responses and network failures to
 * the three display states.
 */
import { describe, expect, it } from "vitest";
import { fetchApiHealth } from "./health";

function stubFetch(response: Response | Error): typeof fetch {
  return async () => {
    if (response instanceof Error) throw response;
    return response;
  };
}

describe("fetchApiHealth", () => {
  it("returns ok for a 200 with status ok", async () => {
    const fetchImpl = stubFetch(Response.json({ status: "ok" }));
    await expect(fetchApiHealth(fetchImpl)).resolves.toBe("ok");
  });

  it("returns degraded for a non-2xx response", async () => {
    const fetchImpl = stubFetch(new Response(null, { status: 503 }));
    await expect(fetchApiHealth(fetchImpl)).resolves.toBe("degraded");
  });

  it("returns degraded for an unexpected body", async () => {
    const fetchImpl = stubFetch(Response.json({ status: "starting" }));
    await expect(fetchApiHealth(fetchImpl)).resolves.toBe("degraded");
  });

  it("returns unreachable when the request fails", async () => {
    const fetchImpl = stubFetch(new TypeError("Failed to fetch"));
    await expect(fetchApiHealth(fetchImpl)).resolves.toBe("unreachable");
  });
});
