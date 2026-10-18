# Web image — multi-stage: install deps, build Next.js, ship the standalone output.
# See docs/docker.md for a line-by-line explanation.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# next.config.ts bakes the rewrite targets in at build time, so the API
# address must be known here, not at container start.
ARG API_URL=http://api:3001
# Inlined into the client bundle at build time; e2e builds with "synthetic".
ARG NEXT_PUBLIC_DATASET_ID=
ENV API_URL=$API_URL NEXT_PUBLIC_DATASET_ID=$NEXT_PUBLIC_DATASET_ID NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
RUN addgroup -S -g 10001 app && adduser -S -u 10001 -G app app
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
