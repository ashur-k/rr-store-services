#!/bin/bash

set -e
export PGPASSWORD="$POSTGRES_PASSWORD"

echo "Ensuring application databases exist..."

for database in "user-service" "keycloak" "store-service" "product-service"
do
    echo "Checking database: ${database}"

    exists=$(psql \
        --host "$PGHOST" \
        --username "$POSTGRES_USER" \
        --dbname "$POSTGRES_DB" \
        --no-password \
        --tuples-only \
        --no-align \
        --command "SELECT 1 FROM pg_database WHERE datname = '${database}'")

    if [ "$exists" != "1" ]; then
        createdb \
            --host "$PGHOST" \
            --username "$POSTGRES_USER" \
            --maintenance-db "$POSTGRES_DB" \
            --no-password \
            "$database"
        echo "Created database: ${database}"
    else
        echo "Database already exists: ${database}"
    fi
done

echo "Application databases are ready."