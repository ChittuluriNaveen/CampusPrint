#!/bin/bash

# CampusPrint Database Disaster Recovery Restore Script
# Usage: ./scripts/restore-db.sh <path_to_backup.dump>

set -e

BACKUP_FILE="$1"

if [ -z "${BACKUP_FILE}" ]; then
  echo "Error: Please specify the backup file path to restore."
  echo "Example: ./scripts/restore-db.sh ./backups/campusprint_backup_20260730_120000.dump"
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file '${BACKUP_FILE}' does not exist."
  exit 1
fi

PGHOST="${POSTGRES_HOST:-localhost}"
PGPORT="${POSTGRES_PORT:-5432}"
PGUSER="${POSTGRES_USER:-postgres}"
PGDATABASE="${POSTGRES_DB:-campusprint}"

echo "=================================================="
echo "CampusPrint Database Disaster Recovery Restore"
echo "Restoring file: ${BACKUP_FILE}"
echo "Target Database: ${PGDATABASE}"
echo "=================================================="

read -p "⚠️ WARNING: This will overwrite existing database '${PGDATABASE}'. Continue? (y/N) " confirm
if [[ "${confirm}" != "y" && "${confirm}" != "Y" ]]; then
  echo "Restore operation cancelled."
  exit 0
fi

if command -v pg_restore >/dev/null 2>&1; then
  pg_restore -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" --clean --if-exists -v "${BACKUP_FILE}"
  echo "✓ Database restored successfully."
else
  echo "Restoring via Docker Container..."
  docker cp "${BACKUP_FILE}" campusprint-postgres:/tmp/restore.dump
  docker exec campusprint-postgres pg_restore -U "${PGUSER}" -d "${PGDATABASE}" --clean --if-exists /tmp/restore.dump
  docker exec campusprint-postgres rm /tmp/restore.dump
  echo "✓ Database restored via Docker successfully."
fi

echo "Restore Completed."
