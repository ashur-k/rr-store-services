#!/bin/bash

set -e

database="$1"
backup_file="$2"

if [[ -z "$database" || -z "$backup_file" ]]; then
    echo "Usage: restore.sh <database> <backup-file>"
    exit 1
fi

case "$database" in
    user-service|keycloak|store-service)
        ;;
    *)
        echo "Invalid database: $database"
        echo "Available databases: user-service, keycloak, store-service"
        exit 1
        ;;
esac

if [[ ! -f "/backups/$backup_file" ]]; then
    echo "Backup file not found: /backups/$backup_file"
    exit 1
fi

echo "Restoring database: $database"
echo "Backup file: $backup_file"

dropdb \
    --username "$POSTGRES_USER" \
    "$database"

createdb \
    --username "$POSTGRES_USER" \
    "$database"

gunzip -c "/backups/$backup_file" | \
    psql \
        --username "$POSTGRES_USER" \
        --dbname "$database"

echo "Database '$database' restored successfully."