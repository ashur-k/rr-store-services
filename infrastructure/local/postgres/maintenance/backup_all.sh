#!/bin/bash

set -e

echo "Backing up all databases..."

date_folder=$(date +'%Y_%m_%d')
timestamp=$(date +'%Y_%m_%dT%H_%M_%S')

mkdir -p "/backups/${date_folder}"

for database in "user-service" "keycloak" "store-service"
do
    echo "Backing up ${database}..."

    pg_dump \
        --username "$POSTGRES_USER" \
        --dbname "$database" \
        | gzip > "/backups/${date_folder}/${database}_${timestamp}.sql.gz"

    echo "${database} backup completed."
done

echo "All database backups completed successfully."
echo "Backups stored in: /backups/${date_folder}"