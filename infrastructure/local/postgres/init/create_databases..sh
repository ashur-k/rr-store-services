#!/bin/bash

set -e

echo "Creating application databases..."

psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --command "CREATE DATABASE \"user-service\""

psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --command "CREATE DATABASE keycloak"

psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --command "CREATE DATABASE \"store-service\""

echo "Application databases created successfully."