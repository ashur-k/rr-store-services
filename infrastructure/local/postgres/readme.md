# PostgreSQL Database Backups

This directory contains the PostgreSQL setup and backup/restore scripts used by the local Docker environment.

## Backup Commands

### 1. View Existing Backups

List the database backups currently available:

```bash
docker compose -f local.yml exec postgres backups.sh
```

### 2. Create a Database Backup

Create a new compressed PostgreSQL backup:

```bash
docker compose -f local.yml exec postgres backup.sh
```

The backup is created inside the PostgreSQL container's backup directory.

Backup files use a timestamped filename, for example:

```text
backup_2026_09_08T15_59_52.sql.gz
```

The `.sql.gz` extension means the SQL dump is compressed using gzip.

## Restore Database

To restore a database from an existing backup:

```bash
docker compose -f local.yml exec postgres restore.sh backup_2026_09_08T15_59_52.sql.gz
```

The backup file must exist in the container's backup directory.

> **Warning:** Restoring a backup can overwrite existing database data. Make sure you understand what the restore script does before running it against important data.

## Where Are Backups Stored?

Backups are stored in the PostgreSQL container at the directory configured by the backup scripts/volume.

You can check the available backup files with:

```bash
docker compose -f local.yml exec postgres backups.sh
```

To inspect the container directly:

```bash
docker compose -f local.yml exec postgres sh
```

Then:

```bash
ls -lah /path/to/backups
```

Replace `/path/to/backups` with the actual backup directory configured in your Docker setup.

### Docker Volume

If the backup directory is mounted as a Docker volume, the backups can survive container recreation.

For example:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
  - postgres_backups:/backups
```

In this example:

* `/var/lib/postgresql/data` → PostgreSQL database data
* `/backups` → Database backup files
* `postgres_data` → Docker volume containing database data
* `postgres_backups` → Docker volume containing backups

Check your `local.yml` to confirm the actual volume and backup paths.

## Useful Commands

### Check PostgreSQL Container

```bash
docker compose -f local.yml ps postgres
```

### Open a Shell in PostgreSQL Container

```bash
docker compose -f local.yml exec postgres sh
```

### Check Backup Files

```bash
docker compose -f local.yml exec postgres backups.sh
```

### Create Backup

```bash
docker compose -f local.yml exec postgres backup.sh
```

### Restore Backup

```bash
docker compose -f local.yml exec postgres restore.sh <backup_filename>
```

Example:

```bash
docker compose -f local.yml exec postgres restore.sh backup_2026_09_08T15_59_52.sql.gz
```

## Recommended Backup Workflow

For local development:

```text
1. Make database changes
       ↓
2. Create backup
       ↓
3. Backup stored in /backups
       ↓
4. Continue development
       ↓
5. Restore backup if required
```

### Important Notes

* Always create a backup before performing a potentially destructive database operation.
* Keep backup filenames with timestamps so they are easy to identify.
* `.sql.gz` backups are compressed to reduce storage space.
* A Docker container being recreated does **not necessarily mean backups are lost**; this depends on whether the backup directory is backed by a Docker volume or bind mount.
* For production, backups should additionally be copied to external/remote storage. A backup stored only on the same machine as the database does not protect against machine or disk failure.
* Test restores periodically. A backup is only useful if it can actually be restored.
