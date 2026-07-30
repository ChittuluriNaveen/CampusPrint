# Phase 03 — Database Foundation & Prisma

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement the complete database foundation for CampusPrint.

This phase establishes the PostgreSQL database, Prisma ORM, schema design,
migrations, seed infrastructure, and database utilities.

This phase must NOT implement authentication, business logic, APIs, or UI.

The objective is to provide a stable production-ready data layer that every
future phase will build upon.

---

# Documentation

Read ONLY the following documents before implementation:

- docs/03_Database_Design.md
- docs/04_Data_Model.md
- docs/05_ER_Diagram.md
- docs/16_Project_Structure.md
- docs/29_Coding_Standards.md

Do NOT reread previous implementation phases.

---

# Scope

Implement ONLY:

✓ Prisma setup

✓ PostgreSQL configuration

✓ Environment configuration

✓ Prisma Client

✓ Database schema

✓ Initial migration

✓ Seed infrastructure

✓ Database utilities

✓ Connection management

✓ Database validation

---

# Out of Scope

Do NOT implement:

❌ Authentication

❌ Login

❌ Registration

❌ JWT

❌ APIs

❌ Controllers

❌ Services

❌ File Upload

❌ Orders

❌ Payments

❌ Dashboards

❌ Notifications

❌ Email

❌ Business Logic

---

# Technology

Use:

- PostgreSQL
- Prisma ORM
- Prisma Client
- TypeScript

---

# Folder Structure

Create or verify:

backend/

prisma/
    schema.prisma
    seed.ts
    migrations/

src/

config/
    database.ts

lib/
    prisma.ts

types/

utils/

---

# Environment

Verify:

DATABASE_URL

SHADOW_DATABASE_URL (if used)

NODE_ENV

Do not hardcode credentials.

Use environment variables only.

---

# Prisma Configuration

Configure:

Datasource

Generator

Client output (default)

Migration support

Naming conventions

---

# Database Connection

Implement:

Reusable Prisma Client

Singleton pattern

Development hot-reload support

Production-safe connection

Graceful shutdown

Connection validation

---

# Schema Design

Implement models exactly as defined in the documentation.

Typical entities may include:

User

Student

Admin

Document

PrintOrder

OrderItem

Pricing

Payment

Notification

AuditLog

SystemSetting

Use the documentation as the source of truth.

Do not invent additional entities.

---

# Model Standards

Every model should include where appropriate:

Primary Key

Created At

Updated At

Soft Delete (if defined)

Indexes

Unique Constraints

Relations

Enums

Defaults

---

# Enums

Implement all documented enums.

Examples:

UserRole

OrderStatus

PaymentStatus

PrintColor

PrintSide

PaperSize

NotificationType

Only create enums defined in documentation.

---

# Relations

Implement:

One-to-One

One-to-Many

Many-to-One

Cascade rules

Restrict rules

Foreign Keys

Relation names

Follow documentation exactly.

---

# Indexes

Create indexes where documented.

Examples:

Email

Student ID

Order Number

Payment Reference

Status

Created Date

Avoid unnecessary indexes.

---

# Constraints

Implement:

Unique constraints

Required fields

Optional fields

Default values

Length constraints

Relation integrity

---

# Migrations

Generate:

Initial migration

Verify migration success

Migration should execute without errors.

---

# Seed Infrastructure

Create:

seed.ts

Seed runner

Example admin user (only if documentation specifies)

Example lookup tables (if documented)

Avoid production sample data.

---

# Database Utilities

Create:

Prisma client helper

Connection helper

Transaction helper

Health check helper

---

# Error Handling

Handle:

Connection failure

Migration failure

Invalid configuration

Graceful shutdown

Prisma errors

---

# Coding Standards

Every file should:

Be typed

Use async/await

Avoid duplicated logic

Avoid hardcoded values

Be production-ready

Follow project conventions

---

# Validation

Verify:

✓ Prisma schema validates

✓ Prisma Client generates

✓ Migration succeeds

✓ Database connects

✓ Seed executes successfully

✓ npm run build passes

✓ npm run lint passes

No warnings.

---

# Deliverables

Provide:

1. Database architecture summary

2. Models created

3. Enums created

4. Relations summary

5. Migration summary

6. Seed summary

7. Prisma configuration summary

8. Build status

9. Lint status

10. Remaining work

---

# Success Criteria

This phase is complete only if:

✓ PostgreSQL configured

✓ Prisma configured

✓ Schema complete

✓ Relations implemented

✓ Migration successful

✓ Prisma Client generated

✓ Seed infrastructure ready

✓ Build passes

✓ Lint passes

✓ No business logic exists

✓ No APIs exist

---

# Final Instruction

Stop after Phase 03.

Do NOT implement authentication.

Do NOT create APIs.

Do NOT create controllers.

Wait for approval before Phase 04.