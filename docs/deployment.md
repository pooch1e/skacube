# Deployment

How Skacube goes live: the web app on **Vercel**, the API on **Google Cloud Run** ([ADR 0030](adr/0030-hosting.md)). This page is the runbook for the first deploy and for every deploy after it. Backlog: [E8](../backlog/e8-deploy.md).

```
browser ──► Vercel (skacube-blond.vercel.app)
             ├─ /                     static page, Vercel CDN
             ├─ /health, /graphql  ─┐ external rewrites (same origin, no CORS)
             └─ /data/volume/<id>  ─┤ cached on Vercel's CDN from the API's
                                    │ immutable Cache-Control
                                    ▼
                         Cloud Run: skacube-api (gunicorn, port 3001)
                         image in Artifact Registry, data baked in
```

| Piece | Deployed by                                    | When                                                     |
| ----- | ---------------------------------------------- | -------------------------------------------------------- |
| Web   | Vercel Git integration                         | Every push to `main` (production) and every PR (preview) |
| API   | GitHub Actions → Artifact Registry → Cloud Run | Pushes to `main` that touch `api/` or `data/processed/`  |

The site uses the default `*.vercel.app` domain: <https://skacube-blond.vercel.app>. The API is at `https://skacube-api-1044914767088.us-central1.run.app`. Both were deployed on 2026-10-25 by following this runbook. Nothing secret is stored in GitHub. Actions authenticates to Google Cloud with Workload Identity Federation (OIDC). The project id, pool and service account names are configuration, kept as repository **variables**.

## Before the first deploy

### 1. Protect `main` (owner, GitHub settings)

Vercel deploys whatever reaches `main`, so `main` must only accept merged PRs with green checks ([ADR 0003](adr/0003-public-repo-github-flow.md), [ADR 0024](adr/0024-ci-pipeline.md)). In Settings → Branches, add a rule for `main`: require a pull request, and require the `api`, `web`, `contract`, `e2e` and `pr-title` checks.

### 2. What the code already does

- **Data is baked into the API image.** Cloud Run has no host folder to mount, so `api/Dockerfile` copies `data/processed` from a named build context and sets `SKACUBE_DATA_DIR=/app/data`. Build it with `docker build --build-context data=data/processed api`; Compose passes the same context through `additional_contexts` and still mounts `/data` over it locally.
- **gunicorn runs 2 workers × 8 threads**, so one slow volume download doesn't block GraphQL. Cloud Run's `--concurrency=16` matches that.
- **`.github/workflows/deploy-api.yml`** deploys the API. It skips itself until the repository variables in step 3 exist.

### 3. Google Cloud, once

Run from a machine with `gcloud` signed in as the project owner. Values in capitals are yours to choose. The flags were checked against Cloud SDK 580; still confirm each step's output on the first run.

```bash
PROJECT_ID=project-4ba79de3-c1ce-4e57-a81   # existing project, shared with another portfolio API
REGION=us-central1
REPO=pooch1e/skacube

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  iamcredentials.googleapis.com sts.googleapis.com

gcloud artifacts repositories create skacube \
  --repository-format=docker --location="$REGION"

# Runtime identity for the service: needs no roles, it only reads its own image's files
gcloud iam service-accounts create skacube-api-runtime

# Identity that GitHub Actions deploys as
gcloud iam service-accounts create skacube-deployer
DEPLOYER=skacube-deployer@$PROJECT_ID.iam.gserviceaccount.com
RUNTIME=skacube-api-runtime@$PROJECT_ID.iam.gserviceaccount.com
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$DEPLOYER" --role=roles/run.admin
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$DEPLOYER" --role=roles/artifactregistry.writer
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME" --member="serviceAccount:$DEPLOYER" --role=roles/iam.serviceAccountUser

# Let this repository, and only this repository, act as the deployer
gcloud iam workload-identity-pools create github --location=global
gcloud iam workload-identity-pools providers create-oidc github \
  --location=global --workload-identity-pool=github \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository=='$REPO'"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding "$DEPLOYER" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/$REPO"
```

Then add these as GitHub repository **variables** (Settings → Secrets and variables → Actions → Variables), not secrets:

| Variable           | Value                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `GCP_PROJECT_ID`   | `$PROJECT_ID`                                                                             |
| `GCP_REGION`       | `$REGION`                                                                                 |
| `GCP_WIF_PROVIDER` | `projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github` |
| `GCP_DEPLOYER_SA`  | `$DEPLOYER`                                                                               |

### 4. First API deploy (by hand, once)

The API has to exist before Vercel can point at it. Build, push and deploy from the repo root:

```bash
IMAGE=$REGION-docker.pkg.dev/$PROJECT_ID/skacube/api:$(git rev-parse --short HEAD)
gcloud auth configure-docker "$REGION-docker.pkg.dev"
docker build --platform linux/amd64 --build-context data=data/processed -t "$IMAGE" api
docker push "$IMAGE"

gcloud run deploy skacube-api --image="$IMAGE" --region="$REGION" \
  --service-account="$RUNTIME" --allow-unauthenticated \
  --port=3001 --concurrency=16 --cpu=1 --memory=512Mi \
  --min-instances=0 --max-instances=3 --cpu-boost
```

- `--port=3001`: gunicorn binds 3001 rather than reading `$PORT`.
- `--min-instances=0`: free when idle. The first visit after an idle spell waits a few seconds for a cold start (ADR 0030).
- `--max-instances=3`: caps spend if the URL is ever hammered.

Note the service URL it prints (`https://skacube-api-….run.app`) and check `curl -s <url>/health`.

### 5. Vercel, once

1. Import `pooch1e/skacube` in Vercel and set **Root Directory** to `web`. Vercel detects Next.js and uses pnpm from `packageManager`.
2. Environment variables, for **Production** and **Preview**:
   - `API_URL` = the Cloud Run URL from step 4, with no trailing slash. Rewrites are built in at build time ([ADR 0011](adr/0011-app-router-client-viewer.md)), so changing this needs a redeploy.
   - Leave `NEXT_PUBLIC_DATASET_ID` unset, so the app uses `eor-h21cm`.
3. Deploy. `output: "standalone"` is for the Docker image; Vercel uses its own Next.js build. Confirm on the first deploy that the build log shows no warning about it.

## Every deploy after that

- **Web**: merge to `main`. Vercel builds and promotes it. Each PR gets a preview URL. Previews call the production API, so keep schema changes backward-compatible and deploy the API side first.
- **API**: `.github/workflows/deploy-api.yml` runs on pushes to `main` that touch `api/` or `data/processed/`, or by hand from the Actions tab:
  1. Signs in to Google Cloud with Workload Identity Federation (`GCP_WIF_PROVIDER`, `GCP_DEPLOYER_SA`)
  2. Builds with the data context, tags the image with the commit SHA, and pushes it
  3. Deploys a **candidate** revision with no traffic, at its own tagged URL
  4. Smoke-tests the candidate: `/health`, a GraphQL query, and the volume decoding to 16,777,216 bytes
  5. Only if that passes, moves all traffic to the candidate. A failure leaves the previous revision serving.

## Smoke test

Run against the **Vercel** URL, because that is the path visitors take (task T8.2.3):

```bash
SITE=https://skacube-blond.vercel.app
curl -fsS "$SITE/health"                                   # {"status":"ok"}
curl -fsS "$SITE/graphql" -H 'content-type: application/json' \
  -d '{"query":"{ dataset(id: \"eor-h21cm\") { id shape { frequency } } }"}'
curl -sI -H 'accept-encoding: gzip' "$SITE/data/volume/eor-h21cm" \
  | grep -iE '^(content-encoding|cache-control|x-vercel-cache)'
curl -s --compressed "$SITE/data/volume/eor-h21cm" | wc -c  # 16777216
```

Expect:

- `content-encoding: gzip`, so Vercel passed the body through untouched
- `cache-control: public, max-age=31536000, immutable`
- `x-vercel-cache: HIT` on a repeat request
- exactly 16,777,216 decoded bytes

If the encoding or caching checks fail, switch to the fallback in [ADR 0026](adr/0026-api-serves-volume.md): serve the volume from `web/public/`.

Then open the site in a browser and work through the visual part of the [release checklist](release-checklist.md).

## Rollback

- **Web**: in Vercel → Deployments, promote the previous production deployment.
- **API**: `gcloud run services update-traffic skacube-api --region="$REGION" --to-revisions=<previous-revision>=100`, or redeploy an earlier image tag.

## Cost at portfolio traffic

- **Vercel Hobby**: free, for non-commercial personal use. It includes 100 GB a month of edge transfer, about 10,000 cached volume loads, and 10 GB of origin transfer.
- **Cloud Run**: within the free tier when scaled to zero. A minimum instance or heavy uncached traffic would cost money.
- **Artifact Registry**: the API image is well under the free storage tier. Delete old tags now and then.
