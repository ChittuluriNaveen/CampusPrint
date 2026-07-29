# 19_Deployment_Guide.md

# CampusPrint -- Deployment Guide

## 1. Purpose

This guide describes how to deploy CampusPrint securely and reliably
from development to production.

------------------------------------------------------------------------

# 2. Production Architecture

``` text
Users
   │
   ▼
Frontend (Vercel/Netlify)
   │
HTTPS
   ▼
Backend API (Render/Railway/Docker/VPS)
   │
   ├── MongoDB Atlas
   ├── File Storage
   └── Razorpay
```

------------------------------------------------------------------------

# 3. Deployment Targets

Frontend

-   Vercel (recommended)
-   Netlify

Backend

-   Render
-   Railway
-   Docker on VPS

Database

-   MongoDB Atlas

Storage (future)

-   AWS S3
-   Azure Blob Storage

------------------------------------------------------------------------

# 4. Environment Variables

Frontend

``` text
VITE_API_URL
VITE_RAZORPAY_KEY
```

Backend

``` text
NODE_ENV=production
PORT
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
SMTP_HOST
SMTP_USER
SMTP_PASSWORD
UPLOAD_PATH
```

Never commit secrets to source control.

------------------------------------------------------------------------

# 5. Database Configuration

-   Create MongoDB Atlas cluster
-   Restrict network access
-   Create application user
-   Enable backups
-   Monitor indexes

------------------------------------------------------------------------

# 6. Frontend Deployment

Steps

1.  Install dependencies
2.  Build production bundle
3.  Configure environment variables
4.  Deploy
5.  Verify API connectivity

------------------------------------------------------------------------

# 7. Backend Deployment

Steps

1.  Install dependencies
2.  Configure secrets
3.  Start production server
4.  Verify health endpoint
5.  Enable HTTPS

------------------------------------------------------------------------

# 8. Domain & SSL

-   Configure custom domain
-   Force HTTPS
-   Redirect HTTP to HTTPS
-   Renew certificates automatically

------------------------------------------------------------------------

# 9. CI/CD Pipeline

``` text
Push
  ↓
Install
  ↓
Lint
  ↓
Tests
  ↓
Build
  ↓
Deploy
  ↓
Health Check
```

------------------------------------------------------------------------

# 10. Monitoring

Monitor

-   API availability
-   Response times
-   Error rates
-   Payment failures
-   Upload failures
-   Database performance

Recommended

-   UptimeRobot
-   Grafana
-   Prometheus (future)

------------------------------------------------------------------------

# 11. Logging

Capture

-   Authentication
-   Payments
-   Uploads
-   Exceptions
-   Queue events

Rotate logs regularly.

------------------------------------------------------------------------

# 12. Backup & Recovery

-   Automated MongoDB backups
-   Periodic file backups
-   Recovery verification
-   Documented restore procedure

------------------------------------------------------------------------

# 13. Scaling Strategy

-   Horizontal API scaling
-   CDN for static assets
-   Database indexing
-   Redis cache (future)
-   Background workers

------------------------------------------------------------------------

# 14. Security Hardening

-   HTTPS only
-   Secure headers
-   Rate limiting
-   CORS restrictions
-   Secret rotation
-   Dependency updates
-   Principle of least privilege

------------------------------------------------------------------------

# 15. Rollback Plan

If deployment fails:

1.  Stop rollout
2.  Restore previous release
3.  Verify database integrity
4.  Run smoke tests
5.  Notify stakeholders

------------------------------------------------------------------------

# 16. Post-Deployment Checklist

-   Health endpoint responds
-   Login works
-   File upload works
-   Payments verified
-   Order creation succeeds
-   Notifications delivered
-   Dashboard loads

------------------------------------------------------------------------

# 17. Future Improvements

-   Blue/Green deployments
-   Canary releases
-   Kubernetes
-   Multi-region deployment
-   Automated disaster recovery

------------------------------------------------------------------------

# 18. Acceptance Criteria

Deployment is complete when:

-   Frontend and backend are publicly accessible.
-   HTTPS is enforced.
-   Environment variables are configured securely.
-   Monitoring and backups are active.
-   Critical workflows operate successfully in production.
