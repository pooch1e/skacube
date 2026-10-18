# Architecture decision records

Each ADR records one decision: the context, the options considered, what was chosen and what it costs. New ADRs copy the [template](template.md). Accepted ADRs are not edited; a later ADR supersedes an earlier one.

| # | Decision | Status |
|---|---|---|
| [0001](0001-staged-delivery.md) | No fixed deadline; deliver in stages | Accepted |
| [0002](0002-typescript.md) | TypeScript, strict mode | Accepted |
| [0003](0003-public-repo-github-flow.md) | Public GitHub repo, GitHub flow | Accepted |
| [0004](0004-single-curated-dataset.md) | Start from one curated SKA-Low FITS file | Accepted |
| [0005](0005-flask-backend.md) | Flask backend with Strawberry GraphQL and astropy | Accepted |
| [0006](0006-viewer-only-scope.md) | Scope: the viewer only | Accepted |
| [0007](0007-monorepo.md) | Monorepo | Accepted |
| [0008](0008-graphql-metadata-rest-binary.md) | GraphQL for metadata, REST for binary data | Accepted |
| [0009](0009-tanstack-query.md) | TanStack Query for data fetching | Accepted |
| [0010](0010-react-three-fiber.md) | react-three-fiber for rendering | Accepted |
| [0011](0011-app-router-client-viewer.md) | App Router; static splash, client-side viewer | Accepted |
| [0012](0012-tooling.md) | Tooling | Accepted |
| [0013](0013-one-time-ingest.md) | Ingest once, serve the processed files | Superseded by 0028 |
| [0014](0014-viewer-modes.md) | Viewer modes | Accepted |
| [0015](0015-diverging-colormap.md) | Diverging colormap for signed data | Accepted |
| [0016](0016-texture-resolution.md) | 3D texture at 256³, block-averaged | Accepted |
| [0017](0017-dataset-provenance.md) | Label the data as a simulation, with credit | Accepted |
| [0018](0018-graphql-codegen.md) | Generate TypeScript types from the GraphQL schema | Accepted |
| [0019](0019-local-first-then-cloud.md) | Local first, cloud later | Accepted |
| [0020](0020-browser-channel-slice.md) | Channel slice cut from the 3D texture first | Accepted |
| [0021](0021-data-storage.md) | Raw file stays local; processed files are committed | Accepted |
| [0022](0022-testing-strategy.md) | Testing strategy | Accepted |
| [0023](0023-shadcn-tailwind.md) | shadcn/ui primitives, styled with Skacube tokens | Accepted |
| [0024](0024-ci-pipeline.md) | CI pipeline and commit convention | Accepted |
| [0025](0025-local-dev-compose.md) | Native dev, Docker Compose for the full stack | Accepted |
| [0026](0026-api-serves-volume.md) | The API serves the processed volume | Accepted |
| [0027](0027-accessibility-checks.md) | Automated accessibility checks | Accepted |
| [0028](0028-standalone-ingest-script.md) | Ingest is a standalone script, not part of the API | Accepted |
| [0029](0029-webgl2-fallback.md) | Without WebGL2, keep the 2D slice | Proposed |
