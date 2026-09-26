#!/bin/bash

set -e

echo "Creating Keycloak database..."

psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --command "CREATE DATABASE keycloak"

echo "Keycloak database created."