
#!/usr/bin/env bash
set -Eeuo pipefail

IMAGE_TAG="${1:-}"
RELEASE_DIR="${2:-}"

if [[ ! "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]]; then
    echo "Error: Commit SHA must be exactly 40 lowercase hexadecimal characters." >&2
    exit 2
fi

if [[ ! "$RELEASE_DIR" =~ ^/opt/rr-store/releases/[0-9a-f]{40}$ ]]; then
    echo "Error: Invalid release directory." >&2
    exit 2
fi

if [[ ! -f "$RELEASE_DIR/infrastructure/production/compose.yml" ]]; then
    echo "Error: Release Compose file is missing." >&2
    exit 1
fi

ENV_FILE="/opt/rr-store/production.env"
COMPOSE_FILE="$RELEASE_DIR/infrastructure/production/compose.yml"

if [[ ! -f "$ENV_FILE" ]]; then
    echo "Error: Production environment file is missing." >&2
    exit 1
fi

services=(
    user-service
    store-service
    product-service
    user-service-outbox-worker
    nginx
    kong
)

compose() {
    IMAGE_TAG="$IMAGE_TAG" docker compose \
        --project-name production \
        --env-file "$ENV_FILE" \
        --file "$COMPOSE_FILE" \
        "$@"
}

echo "Validating Compose configuration for $IMAGE_TAG..."
compose config --quiet

echo "Pulling application images..."
compose pull \
    user-service \
    store-service \
    product-service \
    product-service-migrate \
    user-service-outbox-worker \
    nginx

echo "Ensuring Product Service database and role exist..."

compose run --rm --no-deps --entrypoint sh postgres -c \
    'PGPASSWORD="$POSTGRES_PASSWORD" psql \
        --host postgres \
        --username "$POSTGRES_USER" \
        --dbname postgres \
        --set=ON_ERROR_STOP=1 \
        --set=product_service_password="$PRODUCT_SERVICE_DB_PASSWORD"' <<'SQL'
SELECT format(
    'CREATE ROLE product_service LOGIN PASSWORD %L',
    :'product_service_password'
)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'product_service'
)
\gexec

ALTER ROLE product_service
    WITH LOGIN PASSWORD :'product_service_password';

SELECT format(
    'CREATE DATABASE %I OWNER %I',
    'product-service',
    'product_service'
)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_database WHERE datname = 'product-service'
)
\gexec

ALTER DATABASE "product-service" OWNER TO product_service;
SQL

echo "Running Product Service database migrations..."
compose run --rm product-service-migrate

echo "Updating application services and Kong..."
compose up -d --no-deps "${services[@]}"

echo "Current service status:"
compose ps "${services[@]}"
