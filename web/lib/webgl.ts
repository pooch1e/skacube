/**
 * WebGL2 detection — the volume shader needs 3D textures, which only WebGL2
 * provides (ADR 0010). Probes once with a throwaway canvas and frees it.
 */

export function supportsWebGL2(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context != null;
  } catch {
    return false;
  }
}
