# CampusPrint Production Deployment & DevOps Runbook

## Overview

This guide details the complete production deployment procedures, infrastructure orchestration, environment configuration, monitoring setup, SSL certification, database migration, and backup/disaster recovery protocols for **CampusPrint**.

---

## 1. System Requirements

### Hardware Prerequisites
- **CPU:** Minimum 2 vCPUs (4 vCPUs recommended for production traffic).
- **RAM:** Minimum 4 GB RAM (8 GB recommended).
- **Disk:** 50 GB+ SSD storage (scaled per file upload retention policy).
- **OS:** Ubuntu 22.04 LTS or Debian 12 Linux server.

### Software Dependencies
- **Docker Engine:** v24.0+
- **Docker Compose:** v2.20+
- **Git:** v2.40+
- **PostgreSQL Client (Optional for host operations):** v16

---

## 2. Infrastructure Architecture

CampusPrint operates using a containerized micro-service stack managed via Docker Compose and an NGINX Reverse Proxy:

```
[ Internet Client ]
       │ (HTTPS / Port 443)
       ▼
┌─────────────────────────────────────────────────────────┐
│ NGINX Reverse Proxy (Container)                         │
│ - SSL / TLS Termination (Let's Encrypt / Certbot)       │
│ - Security Headers & Gzip Compression                   │
│ - Static Frontend Assets (Vite Bundle)                  │
└───────────┬─────────────────────────────────┬───────────┘
            │                                 │
   (Proxy /api/v1)                    (Static HTML/JS)
            │                                 │
            ▼                                 ▼
┌────────────────────────┐       ┌────────────────────────┐
│ Backend API Container  │       │ Frontend NGINX Server  │
│ (Node.js + Express)    │       │ (Port 80 Internal)     │
└───────────┬────────────┘       └────────────────────────┘
            │
      (PostgreSQL)
            │
            ▼
┌────────────────────────┐
│ PostgreSQL 16 Database │
│ (Persistent Volume)    │
└────────────────────────┘
```

---

## 3. Environment Configuration

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

### Critical Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime mode | `production` |
| `PORT` | Backend internal port | `5000` |
| `DATABASE_URL` | PostgreSQL connection URI | `postgresql://user:pass@postgres:5432/campusprint?schema=public` |
| `JWT_SECRET` | Secret key for JWT signing | *Cryptographically random 64-char string* |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `RAZORPAY_KEY_ID` | Production Razorpay key ID | `rzp_live_xxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Production Razorpay secret | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| `UPLOAD_DIR` | File upload storage directory | `/app/uploads` |
| `MAX_FILE_SIZE_MB` | Maximum allowed upload size | `50` |

---

## 4. Production Deployment Procedure

### Step 1: Clone Repository & Setup Environment
```bash
git clone https://github.com/ChittuluriNaveen/CampusPrint.git
cd CampusPrint
cp .env.example .env
# Edit .env with production credentials
nano .env
```

### Step 2: Build & Launch Docker Containers
```bash
docker-compose up -d --build
```

### Step 3: Automated Database Migration & Seeding
```bash
docker exec -it campusprint-backend npx prisma db push
docker exec -it campusprint-backend npx prisma db seed
```

### Step 4: Verify Health Status
```bash
curl http://localhost:5000/api/v1/health/readiness
```

Expected Output:
```json
{
  "status": "healthy",
  "timestamp": "2026-07-30T14:30:00.000Z",
  "checks": {
    "database": true,
    "storage": true
  }
}
```

---

## 5. SSL / TLS Certificate Setup (Let's Encrypt + Certbot)

To enable HTTPS encryption on production:

1. Install Certbot on the host:
```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
```

2. Generate Let's Encrypt certificates:
```bash
sudo certbot --nginx -d campusprint.edu -d www.campusprint.edu
```

3. Enable auto-renewal timer:
```bash
sudo systemctl status certbot.timer
```

---

## 6. Automated Backup & Disaster Recovery

### Database Backup
Run manual or automated cron backup:
```bash
./scripts/backup-db.sh
```
*Backups are saved to `./backups/campusprint_backup_YYYYMMDD_HHMMSS.dump` with a 30-day retention policy.*

### Crontab Automated Backup Schedule
Add to crontab (`crontab -e`) to run nightly at 2:00 AM:
```cron
0 2 * * * /home/ubuntu/CampusPrint/scripts/backup-db.sh >> /var/log/campusprint_backup.log 2>&1
```

### Database Restore Procedure
To restore from a dump file:
```bash
./scripts/restore-db.sh ./backups/campusprint_backup_20260730_020000.dump
```

---

## 7. Monitoring & Logging

- **Liveness Endpoint:** `GET /api/v1/health/liveness`
- **Readiness Endpoint:** `GET /api/v1/health/readiness`
- **Metrics Endpoint:** `GET /api/v1/health/metrics`
- **Container Logs:**
  ```bash
  docker-compose logs -f --tail=100 backend
  ```

---

## 8. Troubleshooting & Maintenance

- **Restart All Services:**
  ```bash
  docker-compose restart
  ```
- **Rebuild Single Service:**
  ```bash
  docker-compose build backend && docker-compose up -d backend
  ```
- **Check Disk Usage:**
  ```bash
  df -h
  docker system df
  ```
