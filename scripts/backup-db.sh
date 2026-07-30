#!/bin/bash

# CampusPrint Database Automated Backup Script
# Usage: ./scripts/backup-db.sh

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/campusprint_backup_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Database Credentials
PGHOST="${POSTGRES_HOST:-localhost}"
PGPORT="${POSTGRES_PORT:-5432}"
PGUSER="${POSTGRES_USER:-postgres}"
PGDATABASE="${POSTGRES_DB:-campusprint}"

echo "=================================================="
echo "CampusPrint Database Backup Task"
echo "Timestamp: ${TIMESTAMP}"
echo "Host: ${PGHOST}:${PGPORT} | Database: ${PGDATABASE}"
echo "=================================================="

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Execute PostgreSQL Dump
echo "Creating database SQL dump..."
if command -v pg_dump >/dev/null 2>&1; then
  pg_dump -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" -F c -b -v -f "${BACKUP_FILE}.dump"
  echo "✓ Backup created successfully: ${BACKUP_FILE}.dump"
else
  echo "⚠️ Local pg_dump not found. Attempting Docker container backup..."
  docker exec campusprint-postgres pg_dump -U "${PGUSER}" -d "${PGDATABASE}" -F c -f "/tmp/backup.dump"
  docker cp campusprint-postgres:/tmp/backup.dump "${BACKUP_FILE}.dump"
  docker exec campusprint-postgres rm /tmp/backup.dump
  echo "✓ Docker Container Backup created: ${BACKUP_FILE}.dump"
fi

# Clean up backups older than retention policy (30 days)
echo "Enforcing backup retention policy (${RETENTION_DAYS} days)..."
find "${BACKUP_DIR}" -name "campusprint_backup_*.dump" -type f -mtime +${RETENTION_DAYS} -delete
echo "✓ Cleanup complete."

echo "Backup Task Finished Successfully."
