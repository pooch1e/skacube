# API image — multi-stage: build the venv with uv, ship only the venv + runtime.
# See docs/docker.md for a line-by-line explanation.

FROM python:3.13-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:0.11 /uv /usr/local/bin/uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy UV_PYTHON_DOWNLOADS=never
WORKDIR /app

COPY pyproject.toml uv.lock README.md ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project

COPY src ./src
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-editable

FROM python:3.13-slim AS runtime
# gunicorn writes a control socket under $HOME, so the user needs one.
RUN useradd --system --uid 10001 --create-home app
WORKDIR /app
COPY --from=builder --chown=app:app /app/.venv /app/.venv
# Processed data comes from a named build context (`--build-context data=data/processed`,
# or compose's additional_contexts) so Cloud Run, which has no host folder to
# mount, gets it inside the image. Compose and e2e still override it with a mount.
COPY --from=data --chown=app:app . /app/data
ENV PATH="/app/.venv/bin:$PATH" PYTHONUNBUFFERED=1 SKACUBE_DATA_DIR=/app/data
USER app
EXPOSE 3001
# Threads keep one slow volume download from blocking GraphQL; Cloud Run's
# --concurrency is set to workers × threads (docs/deployment.md).
CMD ["gunicorn", "--bind", "0.0.0.0:3001", "--workers", "2", "--threads", "8", "skacube:create_app()"]
