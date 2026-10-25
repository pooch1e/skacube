# Skacube

Skacube is a demonstration project utilising Next.Js and a Flask backend to render a FITS file cube in 3d. I want to demonstrate my experience and skills with UI/UX, simple containerisation, design systems and my Agentic workflow process.

**Live:** <https://skacube-blond.vercel.app>

## Why I built this

I am very interested in working at SKA-Low as I like the UX challenge of communicating complicated technical instructions to a wide audience. I am not from a STEM background, so even in dissecting the SKA-Low docs and api, I was finding it very difficult to parse. I feel there is a good meeting point where design and UI can meet the extrodinarily exciting and technical disoveries the SKA-Low radioscope provides and demonstrate it to a wide audience. 

## Run it

Everything, one command:

```bash
docker compose up --build
```

Then open <http://localhost:3000>. Details in [docs/docker.md](docs/docker.md).

For day-to-day development ([ADR 0025](docs/adr/0025-local-dev-compose.md)):

```bash
cd api && uv run flask run     # http://localhost:3001/health
cd web && pnpm dev             # http://localhost:3000
```

Checks, the same ones CI runs:

```bash
cd api && uv run ruff check && uv run ruff format --check && uv run mypy && uv run pytest
cd web && pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm build
docker compose -f compose.yaml -f compose.e2e.yaml run --rm --build e2e   # Playwright + axe, see e2e/README.md
```

## Layout

| Path | What |
|---|---|
| `web/` | Next.js (App Router, TypeScript) front end |
| `api/` | Flask API: GraphQL for metadata, REST for the binary volume |
| `e2e/` | Playwright and axe tests, run in Docker against the whole stack |
| `data/` | Processed volume and its README (the raw FITS file is not committed - taken from SKA-Low website) |
| `docs/` | Overview, architecture, design, background, ADRs |
| `backlog/` | Epics, stories and tasks |

## Data

The dataset is SKAO's simulated 21 cm Epoch of Reionisation cube (Bonaldi et al. 2025, [arXiv:2503.11740](https://arxiv.org/abs/2503.11740)), downloaded from the [SKA-Low page](https://www.skao.int/en/science-users/170/simulated-data-products/ska-low-eor). The 981 MB raw file is not committed. `uv run data/ingest.py <fits>` reduces it to a 256³ volume of about 10 MB, which is. See [data/README.md](data/README.md).

## Decisions and design

- In this demonstration I have ingested and compressed the FITS file locally, then have committed the compressed file. In a real life situation, this would have to be hosted somewhere, accessed probably with a presigned URL, processed as a batch job then streamed to client in a blob or chunks. The files are far too big to download and display in the client. 


## How it maps to the role


| React / Next.js | `web/`, [architecture](docs/architecture/README.md) |
| Flask and GraphQL | `api/`, [ADR 0005](docs/adr/0005-flask-backend.md) |
| Version control, CI/CD, testing, docs | [SDLC](docs/sdlc.md), `.github/workflows/` |
| UX and reusable components | [design system](docs/design/README.md) |
| Linux and containers | `Dockerfile`s, `compose.yaml`, [ADR 0025](docs/adr/0025-local-dev-compose.md) |


## Docs

Start at [docs/README.md](docs/README.md). Every significant choice has an [ADR](docs/adr/README.md).

## Licence

[MIT](LICENSE).
