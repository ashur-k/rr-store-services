
#!/usr/bin/env bash
set -Eeuo pipefail

: "${USER_SERVICE_DB_PASSWORD:?USER_SERVICE_DB_PASSWORD must be set}"
: "${STORE_SERVICE_DB_PASSWORD:?STORE_SERVICE_DB_PASSWORD must be set}"
: "${KEYCLOAK_DB_PASSWORD:?KEYCLOAK_DB_PASSWORD must be set}"
: "${PRODUCT_SERVICE_DB_PASSWORD:?PRODUCT_SERVICE_DB_PASSWORD must be set}"

psql \
    --username "$POSTGRES_USER" \
    --dbname postgres \
    --set ON_ERROR_STOP=1 \
    --set user_service_password="$USER_SERVICE_DB_PASSWORD" \
    --set store_service_password="$STORE_SERVICE_DB_PASSWORD" \
    --set keycloak_password="$KEYCLOAK_DB_PASSWORD" \
    --set product_service_password="$PRODUCT_SERVICE_DB_PASSWORD" \
    <<'SQL'

-- Create a separate login role for each application.
SELECT format(
    'CREATE ROLE %I LOGIN PASSWORD %L',
    'user_service',
    :'user_service_password'
) \gexec

SELECT format(
    'CREATE ROLE %I LOGIN PASSWORD %L',
    'store_service',
    :'store_service_password'
) \gexec

SELECT format(
    'CREATE ROLE %I LOGIN PASSWORD %L',
    'keycloak',
    :'keycloak_password'
) \gexec

-- Give each application its own database.
SELECT format(
    'CREATE DATABASE %I OWNER %I',
    'user-service',
    'user_service'
) \gexec

SELECT format(
    'CREATE DATABASE %I OWNER %I',
    'store-service',
    'store_service'
) \gexec

SELECT format(
    'CREATE DATABASE %I OWNER %I',
    'keycloak',
    'keycloak'
) \gexec

SELECT format(
    'CREATE ROLE %I LOGIN PASSWORD %L',
    'product_service',
    :'product_service_password'
) \gexec

SELECT format(
    'CREATE DATABASE %I OWNER %I',
    'product-service',
    'product_service'
) \gexec

SQL
