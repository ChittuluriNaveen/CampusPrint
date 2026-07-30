# Changelog

All notable changes to the **CampusPrint** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] - 2026-07-30

### 🚀 Initial Production Release

CampusPrint Version 1.0.0 is the complete, production-grade release of the Campus Printing Management System.

#### ✨ Features & Modules Added

- **Phase 01 — Project Foundation**: Monorepo structure, TypeScript configuration, ESLint/Prettier rules, and environment setup.
- **Phase 02 — UI Foundation & Design System**: Responsive CSS design tokens, modern typography, component layout hierarchy, accessible UI themes.
- **Phase 03 — Database Foundation**: PostgreSQL 16 database schema defined via Prisma ORM, relational indexes, data seeding scripts.
- **Phase 04 — Authentication & Authorization**: JWT authentication, Bcrypt password hashing (cost factor 10), RBAC middleware (`STUDENT`, `OPERATOR`, `ADMIN`, `SUPER_ADMIN`).
- **Phase 05 — User & Profile Management**: Profile updating, password changing, student ID verification, and administrative user controls.
- **Phase 06 — Document Upload & Storage**: Multer file upload handling, MIME/extension whitelisting (`.pdf`, `.docx`, `.doc`, `.png`, `.jpg`), unique filename generator (`CP_YYYYMMDD_hash.pdf`), and document metadata management.
- **Phase 07 — Print Order Management**: Multi-file print order configuration, order number generator (`ORD-YYYYMMDD-XXXX`), status progression state machine.
- **Phase 08 — Dynamic Pricing Engine**: Configurable pricing rules for B&W vs Colour print modes, duplex/single-sided, paper sizes (A4, A3, Letter, Legal), binding, lamination, and GST calculation.
- **Phase 09 — Shopping Cart & Checkout**: Multi-item cart management, subtotal/tax summary calculation, instant checkout preview.
- **Phase 10 — Payment System Integration**: Razorpay payment gateway integration, HMAC-SHA256 signature verification, transaction logging, payment retry mechanism.
- **Phase 11 — Print Processing Workflow**: Operator print queue dashboard, job status state machine (`QUEUED`, `PRINTING`, `QUALITY_CHECK`, `READY`, `COLLECTED`), print operator job actions.
- **Phase 12 — Student Dashboard Portal**: Responsive student portal featuring order tracking, document vault, invoice download, and active status indicators.
- **Phase 13 — Admin Dashboard Operations**: Comprehensive admin control center for user administration, pricing rule management, system configuration, and print job queue override.
- **Phase 14 — Notification & Communication System**: In-app notifications for order status changes, email notification dispatch service, operator alerts.
- **Phase 15 — Analytics, Reports & Business Intelligence**: Operational analytics engine, revenue trend visualizers, KPI cards (AOV, fulfillment speed, user growth), streaming CSV report exporter.
- **Phase 16 — Testing, QA, Security & Performance**: 16 automated backend test suites covering all modules, Bcrypt/JWT security audits, latency benchmarking, and E2E user lifecycle validation.
- **Phase 17 — Deployment, Infrastructure & DevOps**: Multi-stage Dockerfiles, production NGINX reverse proxy with rate-limiting and security headers, Docker Compose stack (Postgres + Backend + Frontend), `/api/v1/health` liveness/readiness endpoints, GitHub Actions CI/CD workflow, and automated database backup/restore scripts (`scripts/backup-db.sh`, `scripts/restore-db.sh`).
- **Phase 18 — Production Release & Handover**: Complete API documentation (`docs/API_DOCUMENTATION.md`), User Guide (`docs/USER_GUIDE.md`), Developer Guide (`docs/DEVELOPER_GUIDE.md`), production deployment runbook (`docs/DEPLOYMENT_GUIDE.md`), and v1.0.0 release tagging.
