/**
 * Next.js config — standalone output for the web Docker image, and
 * same-origin rewrites that proxy API routes to the Flask service.
 */
import type { NextConfig } from "next";

// next.config is serialised at build time, so in Docker this must be passed
// as a build arg rather than set on the running container.
const apiUrl = process.env.API_URL ?? "http://127.0.0.1:5000";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      { source: "/health", destination: `${apiUrl}/health` },
      { source: "/graphql", destination: `${apiUrl}/graphql` },
      { source: "/data/:path*", destination: `${apiUrl}/data/:path*` },
    ];
  },
};

export default nextConfig;
