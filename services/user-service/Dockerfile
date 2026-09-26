# TODO once project is devloped revist docker for improvements

ARG PYTHON_VERSION=3.14-slim-bookworm

FROM python:${PYTHON_VERSION} AS builder

COPY --from=ghcr.io/astral-sh/uv:0.11.19 /uv /uvx /bin/

WORKDIR /app

RUN apt-get update && apt-get install --no-install-recommends -y \
    gcc \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock ./

RUN uv sync --locked --no-dev --no-editable

COPY . .

# -------------------------
# Runtime
# -------------------------

FROM python:${PYTHON_VERSION} AS runtime

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:0.11.19 /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH"

RUN apt-get update && apt-get install --no-install-recommends -y \
    gcc \
    libpq5 \
    gettext \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app /app

RUN useradd --create-home appuser \
    && chown -R appuser:appuser /app

USER appuser
