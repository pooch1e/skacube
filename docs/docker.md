# Docker in Skacube

How the containers work, what each Dockerfile does, and why. Decision record: [ADR 0025](adr/0025-local-dev-compose.md).

## Why containers at all

Day to day you run the apps natively (`pnpm dev`, `uv run flask run`) for hot reload. Containers answer a different question: **"does this run on a machine that isn't mine?"**

- A reviewer can run the whole app with one command and no Node, Python or uv installed.
- The exact same images can later be deployed to a host ([ADR 0019](adr/0019-local-first-then-cloud.md)).
- It forces you to write down everything the app needs to run (runtime, dependencies, port, start command).

## Vocabulary

| Term | Meaning |
|---|---|
| **Image** | A read-only snapshot: filesystem + metadata (start command, env). Built from a Dockerfile. |
| **Container** | A running instance of an image: an isolated process, not a VM. |
| **Dockerfile** | The recipe for building an image, one instruction per line. |
| **Layer** | Each instruction produces a layer. Layers are cached; if an instruction and everything before it is unchanged, Docker reuses it. |
| **Build context** | The folder sent to the builder (`./api`, `./web`). `COPY` can only see inside it. |
| **Compose** | A YAML file describing several containers and how they connect. |

## The big picture

```
 browser ──► web :3000 (Next.js) ──/health, /graphql, /data/*──► api :3001 (Flask + gunicorn)
              ▲ published to your machine                          ▲ also published, for debugging
              └── inside Compose's private network, "api" resolves to the api container
```

The browser only ever talks to `web`. Next.js **rewrites** (`web/next.config.ts`) forward `/health`, `/graphql` and `/data/*` to the API, so the browser sees one origin and there is no CORS to configure.

## Running it

```bash
docker compose up --build      # build both images, start both containers
# http://localhost:3000        # the placeholder; "API: OK" means web reached api
docker compose down            # stop and remove the containers
```

Useful extras: `docker compose logs -f web`, `docker compose build --no-cache api`, `docker compose ps`.

## Multi-stage builds (the idea behind both Dockerfiles)

Building an app needs tools (compilers, package managers, dev dependencies, source) that running it does not. A **multi-stage** Dockerfile has several `FROM` lines. Each is a separate stage; later stages copy only what they need from earlier ones with `COPY --from=<stage>`. Everything else is thrown away. The result is a smaller, safer final image.

## `api/Dockerfile`

**Stage 1: `builder`** builds a virtualenv.

| Instruction | What and why |
|---|---|
| `FROM python:3.13-slim` | Base image: Python 3.13 on slim Debian. Matches `.python-version`. |
| `COPY --from=ghcr.io/astral-sh/uv:0.11 /uv ...` | Borrows the single `uv` binary from uv's official image. No pip install, no extra layers. |
| `ENV UV_COMPILE_BYTECODE=1 ...` | Pre-compile `.pyc` files (faster start). `UV_LINK_MODE=copy` copies packages instead of hardlinking (links don't work across the cache mount). `UV_PYTHON_DOWNLOADS=never` makes uv use the image's Python. |
| `COPY pyproject.toml uv.lock README.md ./` | Copy **only the dependency manifests first**. |
| `RUN uv sync --locked --no-dev --no-install-project` | Install third-party dependencies only. `--locked` fails if `uv.lock` is out of date; `--no-dev` skips ruff/mypy/pytest. |
| `COPY src ./src` then `uv sync ... --no-editable` | Now copy the source and install the `skacube` package itself, as a real (non-editable) install into the venv. |
| `--mount=type=cache,target=/root/.cache/uv` | A build-time cache directory that persists between builds but never ends up in the image. |

The manifest-first split is **layer caching**: dependencies change rarely, source changes constantly. Because the dependency layer comes before `COPY src`, editing a Python file doesn't reinstall every dependency.

**Stage 2: `runtime`** is what actually ships.

| Instruction | What and why |
|---|---|
| `FROM python:3.13-slim` | A fresh base. No uv, no build leftovers. |
| `useradd --system --uid 10001 --create-home app` / `USER app` | Run as a non-root user, so a compromised process has far less power. gunicorn needs a home directory for its control socket. |
| `COPY --from=builder --chown=app:app /app/.venv /app/.venv` | The one thing taken from stage 1: the finished venv. |
| `COPY --from=data . /app/data` | The processed data, from a **named build context** called `data` (Compose's `additional_contexts`, or `docker build --build-context data=data/processed api`). It lives outside `./api`, so a plain `COPY` couldn't see it. Baking it in lets Cloud Run run the image with no mounts ([deployment](deployment.md)). |
| `ENV PATH="/app/.venv/bin:$PATH"` | Makes `gunicorn` and `python` resolve to the venv's copies. |
| `PYTHONUNBUFFERED=1` | Logs appear immediately instead of being buffered. |
| `SKACUBE_DATA_DIR=/app/data` | Points the app at the baked-in data. Compose overrides it with `/data` and a mount, so local data changes need no rebuild. |
| `EXPOSE 3001` | **Documentation only.** It declares the port; it publishes nothing. Publishing is `ports:` in Compose. |
| `CMD ["gunicorn", "--bind", "0.0.0.0:3001", "--workers", "2", "--threads", "8", "skacube:create_app()"]` | Start command. gunicorn is a production WSGI server (Flask's dev server isn't). `0.0.0.0` means "accept connections from outside the container"; `127.0.0.1` would only accept connections from inside it. Two processes with eight threads each serve 16 requests at once, so a slow 10 MB volume download doesn't block GraphQL. `skacube:create_app()` calls the app factory. |

`api/.dockerignore` keeps `.venv`, caches and tests out of the build context.

## `web/Dockerfile`

**`base`**: Node 22 on Alpine (a tiny Linux), with `corepack enable`, which makes the `pnpm` version pinned in `package.json` (`packageManager`) available.

**`deps`** installs dependencies. Same manifest-first trick: only `package.json` and `pnpm-lock.yaml` are copied, then `pnpm install --frozen-lockfile` (fails if the lockfile is stale). Editing app code doesn't invalidate this layer. A cache mount holds pnpm's download store.

**`builder`** runs the production build.
- Copies `node_modules` from `deps`, then the rest of the source.
- `ARG API_URL` / `ENV API_URL`: `next.config.ts` reads `API_URL` **while building** and bakes the rewrite destinations into the output. So the API's address is a **build argument**, not a runtime variable: setting it on the running container would do nothing. Compose passes `http://api:3001`.
- `pnpm build` produces `.next/standalone`, a minimal self-contained server (`output: "standalone"`) that includes only the `node_modules` files it actually uses.

**`runtime`** ships.
- Fresh Node/Alpine base, non-root user (`app`, uid 10001).
- Copies three things from `builder`: the standalone server, `.next/static` (JS/CSS assets) and `public/`. The standalone output deliberately omits the last two, so they are copied explicitly.
- `HOSTNAME=0.0.0.0` and `PORT=3000` make the server listen on all interfaces on 3000.
- `CMD ["node", "server.js"]` runs the standalone server directly. No `pnpm`, no Next CLI.

`web/.dockerignore` keeps the host's `node_modules` and `.next` out of the build, so the image is built from a clean install.

## `compose.yaml`

```yaml
services:
  api:   build: ./api      # build context = ./api, plus additional_contexts data: ./data/processed
  web:   build: ./web      # ...with args: API_URL: http://api:3001
```

- **Service names are hostnames.** Compose puts both containers on a private network where `api` resolves to the API container. That is why `API_URL` is `http://api:3001`, not `localhost` (inside the web container, `localhost` is the web container itself).
- **`ports: "3000:3000"`** is `host:container`. It publishes the container's port on your machine. The API's `3001:3001` is published too so you can curl it while debugging; the app doesn't need it, and it can be removed if you'd rather keep the API private.
- **`healthcheck`** on `api` runs a one-line Python request against `/health` every 10 s (Python is used because slim images have no `curl`).
- **`depends_on: condition: service_healthy`** starts `web` only after `api` reports healthy.

## Common gotchas

- **Changed `API_URL`? Rebuild `web`.** It's baked in at build time: `docker compose up --build`.
- **Slow first build, fast later ones.** Layer caching and cache mounts at work. `--no-cache` forces a full rebuild.
- **`localhost` inside a container is the container.** Use service names to reach other containers.
- **Image changed but behaviour didn't?** You probably ran `up` without `--build`.
- **Build can't reach the internet?** The web build no longer needs it: fonts are self-hosted in `web/app/fonts/` via `next/font/local`. `pnpm install` in the `deps` stage still downloads packages, so DNS must work for that.
