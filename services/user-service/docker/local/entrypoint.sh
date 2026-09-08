#!/bin/sh
set -e

until python -c "
import psycopg
psycopg.connect(
    dbname='$POSTGRES_DB',
    user='$POSTGRES_USER',
    password='$POSTGRES_PASSWORD',
    host='$POSTGRES_HOST',
    port='$POSTGRES_PORT'
)
"; do
    echo "Waiting for PostgreSQL..."
    sleep 1
done

echo "PostgreSQL is available"

exec "$@"