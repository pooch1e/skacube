# 0030. Host the web app on Vercel and the API on Cloud Run

- Status: Accepted
- Date: 2026-10-21

## Context

[ADR 0019](0019-local-first-then-cloud.md) deferred hosting until the deployable artefacts were known. They are now:

- **web**: a Next.js app whose page is static. The viewer loads in the browser and calls `/health`, `/graphql` and `/data/volume/<id>` on the same origin. Next rewrites proxy those paths to the API. The rewrite target, `API_URL`, is baked in at build time ([ADR 0011](0011-app-router-client-viewer.md)).
- **api**: a Flask container (gunicorn) serving small GraphQL responses and one immutable ~10 MB gzip volume per dataset ([ADR 0026](0026-api-serves-volume.md)).

The panel will likely open the link once, cold, possibly from Australia. Cost should stay near zero. No secrets may live in GitHub (backlog S8.2).

## Options

1. **Cloud Run for both.**
   - Both existing Docker images deploy as they are, so what is deployed is exactly what the e2e suite tests. One platform, one bill.
   - Same origin still works: the web container's Next server proxies to the API's URL.
   - There is no CDN without a paid load balancer and Cloud CDN, so every visitor's volume download comes from Cloud Run.
   - Both services cold-start when scaled to zero, including the page itself.
   - No preview deployments per PR.
2. **Vercel for web, Cloud Run for the API.**
   - Vercel builds Next.js natively. The static page is served from its CDN, so it never cold-starts. Every PR gets a preview URL.
   - Next rewrites become Vercel external rewrites: the browser stays same-origin, so no CORS is needed. Vercel honours the upstream `Cache-Control` on external rewrites by default for projects created after 6 April 2026, so the volume's `public, max-age=31536000, immutable` should let Vercel's CDN serve it after the first request.
   - Cost: the Hobby plan is free but limited to non-commercial, personal use. Cloud Run's free tier covers the API at portfolio traffic.
   - Two platforms. Vercel builds the web app itself rather than running the tested Docker image, so a post-deploy smoke test has to cover that gap.
3. **Vercel for both**, with the API as Vercel Python functions. This drops the Flask container and the Linux/containers story the JD asks for ([overview](../overview.md#jd-mapping)), so it is rejected.

| | Cloud Run for both | Vercel + Cloud Run |
|---|---|---|
| Cost at portfolio traffic | Free tier | Free tier on both (Hobby is non-commercial only) |
| Cold start on first visit | Page and API | API only; the page is static on the CDN |
| Same origin | Yes, the Next server proxies | Yes, Vercel external rewrites |
| Volume caching | None without a load balancer and CDN | Vercel CDN, from the upstream headers |
| PR previews | No | Yes |
| Deployed = tested artefact | Yes, for both | API yes; web is rebuilt by Vercel |

## Decision

Option 2. The web app is deployed by Vercel's Git integration from `web/`. The API is built from `api/Dockerfile`, pushed to Artifact Registry and deployed to Cloud Run by GitHub Actions, authenticated with Workload Identity Federation.

Routing stays same-origin through rewrites, which settles the [open question](../open-questions.md) on CORS: `SKACUBE_ALLOWED_ORIGIN` stays unset in production.

If the smoke test shows that Vercel does not pass the volume through intact or does not cache it, the volume moves to `web/public/` and is served by Vercel directly. That is the fallback [ADR 0026](0026-api-serves-volume.md) already names.

### Settings

- **Region `us-central1`**, in the existing Google Cloud project that already hosts another portfolio API, so both stay on one billing account's free tier. An Australian visitor's GraphQL calls cross the Pacific, which adds latency to small requests only; the volume comes from Vercel's edge once cached.
- **`min-instances` 0.** The API scales to zero when idle. After an idle period, the first visit pays a cold start of a few seconds on its GraphQL request; a designed loading or intro state on the splash page (E6) covers it. A warm instance would remove it at a small monthly cost.
- **Domain**: the default `*.vercel.app` URL. No custom domain.

## Consequences

- `main` must be protected with required checks, because Vercel deploys whatever lands on it.
- The API image must contain the processed data, because Cloud Run has no host folder to mount (see [deployment](../deployment.md#2-code-changes-before-the-first-deploy)).
- `API_URL` lives in Vercel's project settings. Changing it needs a redeploy, because rewrites are built in.
- Preview deployments use the production API. A PR that changes the GraphQL schema on both sides will mismatch in its preview, so deploy the API first and keep schema changes backward-compatible.
- A smoke test against the live URL covers the gap between the Docker image the e2e suite tests and the build Vercel actually serves.
