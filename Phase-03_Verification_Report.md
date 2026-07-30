# CampusPrint — Phase 03 Database Foundation Verification Report

**Version:** 1.0  
**Phase:** Phase 03 (Database Foundation & Prisma ORM)  
**Date:** July 30, 2026  
**Status:** Verification Complete & Approved  

---

## 1. Executive Summary

Phase 03 establishes the complete database foundation for **CampusPrint** using **PostgreSQL** and **Prisma ORM (v5.22.0)**. The database schema strictly reflects the project specifications documented in `docs/06_Database_Design.md` and `docs/23_Database_ERD.md`. 

All 8 core data models, 8 custom enumerations, relations, foreign key constraints, indexes, connection management singletons, database health checkers, and idempotent seed infrastructure have been built and verified.

Zero business logic, authentication controllers, or REST API endpoints were implemented in this phase, adhering strictly to the phase boundary.

---

## 2. Technology Setup & Versioning

| Component | Technology | Version | Status |
| :--- | :--- | :--- | :--- |
| **Database Engine** | PostgreSQL | 14+ | Configured |
| **ORM** | Prisma ORM | `5.22.0` (pinned) | Active |
| **Client** | Prisma Client (`@prisma/client`) | `5.22.0` | Generated |
| **Language** | TypeScript | `5.4.5` | Compiled |
| **Seeder** | `ts-node` | `10.9.2` | Configured |

---

## 3. Database Schema Specification

### 3.1 Models Created (8 Entities)

1. **`User` (`users`)**:
   - Primary Key: `id` (`UUID`)
   - Fields: `name`, `email` (Unique), `password`, `studentId` (Unique), `role`, `department`, `year`, `phone`, `avatar`, `isVerified`, `status`, `createdAt`, `updatedAt`, `deletedAt`
   - Role Enum: `STUDENT`, `ADMIN`, `SUPER_ADMIN`
   - Status Enum: `ACTIVE`, `INACTIVE`, `BLOCKED`
   - Indexes: `email`, `studentId`, `[role, status]`

2. **`Order` (`orders`)**:
   - Primary Key: `id` (`UUID`)
   - Fields: `orderNumber` (Unique), `userId` (FK), `status`, `subtotal`, `tax`, `total`, `estimatedCompletion`, `remarks`, `createdAt`, `updatedAt`, `deletedAt`
   - Status Enum: `DRAFT`, `PAYMENT_PENDING`, `PAID`, `QUEUED`, `PRINTING`, `QUALITY_CHECK`, `READY`, `COLLECTED`, `CANCELLED`, `REFUNDED`
   - Indexes: `orderNumber`, `userId`, `status`, `createdAt`

3. **`OrderFile` (`order_files`)**:
   - Primary Key: `id` (`UUID`)
   - Fields: `orderId` (FK), `originalFileName`, `storedFileName`, `mimeType`, `size`, `pageCount`, `copies`, `paperSize`, `colourMode`, `duplexMode`, `orientation`, `binding`, `lamination`, `coverPage`, `pageRange`, `specialInstructions`, `calculatedPrice`, `createdAt`, `updatedAt`
   - Paper Size: `A4`, `A3`, `LETTER`, `LEGAL`
   - Colour Mode: `BW`, `COLOUR`
   - Duplex: `SINGLE`, `DOUBLE`
   - Indexes: `orderId`

4. **`Payment` (`payments`)**:
   - Primary Key: `id` (`UUID`)
   - Fields: `orderId` (FK, Unique), `razorpayOrderId`, `razorpayPaymentId` (Unique), `razorpaySignature`, `amount`, `currency`, `paymentMethod`, `paymentStatus`, `paidAt`, `createdAt`, `updatedAt`
   - Payment Status Enum: `CREATED`, `SUCCESS`, `FAILED`, `REFUNDED`
   - Indexes: `orderId`, `razorpayPaymentId`, `paymentStatus`

5. **`Pricing` (`pricing`)**:
   - Primary Key: `id` (`UUID`)
   - Fields: `paperSize`, `colourMode`, `duplexMode`, `basePrice`, `bindingPrice`, `laminationPrice`, `gstPercentage`, `active`, `createdAt`, `updatedAt`
   - Constraints: `[paperSize, colourMode, duplexMode]` Unique Composite Index
   - Indexes: `active`

6. **`Notification` (`notifications`)**:
   - Primary Key: `id` (`UUID`)
   - Fields: `userId` (FK), `title`, `message`, `type`, `isRead`, `createdAt`, `updatedAt`
   - Type Enum: `INFO`, `SUCCESS`, `WARNING`, `ERROR`
   - Indexes: `userId`, `isRead`, `createdAt`

7. **`ActivityLog` (`activity_logs`)**:
   - Primary Key: `id` (`UUID`)
   - Fields: `actorId` (FK, Optional), `action`, `entity`, `entityId`, `ipAddress`, `userAgent`, `createdAt`
   - Indexes: `actorId`, `action`, `entity`, `createdAt`

8. **`Setting` (`settings`)**:
   - Primary Key: `id` (`UUID`)
   - Fields: `key` (Unique), `value`, `description`, `createdAt`, `updatedAt`
   - Indexes: `key`

---

## 4. Entity Relationships

```text
User (1)  <------------------->  (N) Order
User (1)  <------------------->  (N) Notification
User (1)  <------------------->  (N) ActivityLog (actorId, ON DELETE SET NULL)
Order (1) <------------------->  (N) OrderFile (ON DELETE CASCADE)
Order (1) <------------------->  (1) Payment (ON DELETE CASCADE)
```

---

## 5. Migration & Seed Status

- **Migration File:** `backend/prisma/migrations/20260730000000_init_database_foundation/migration.sql`
- **Migration Status:** Generated and verified cleanly.
- **Seed Infrastructure:** `backend/prisma/seed.ts`
  - Populates 6 system settings (`INSTITUTE_NAME`, `MAX_UPLOAD_SIZE_MB`, `ALLOWED_FILE_TYPES`, `SUPPORT_EMAIL`, `PRINTER_DESK_LOCATION`, `TAX_GST_PERCENTAGE`).
  - Populates 16 pricing matrix rules (A4/A3/Letter/Legal x B&W/Colour x Single/Double).
  - Populates 1 Super Admin account placeholder (`admin@campusprint.edu`).

---

## 6. Command Validation Summary

| Command | Status | Output Details |
| :--- | :--- | :--- |
| `npx prisma validate` | **PASS** | `The schema at prisma/schema.prisma is valid 🚀` |
| `npx prisma generate` | **PASS** | `Generated Prisma Client (v5.22.0) in 136ms` |
| `npx prisma migrate status` | **PASS** | `1 migration found in prisma/migrations` |
| `npm run lint` | **PASS (0 Errors)** | Monorepo backend & frontend static analysis passed |
| `npm run build` | **PASS (0 Errors)** | TypeScript backend compiler & Vite frontend build passed |

---

## 7. File Manifest

### Created Files
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/prisma/migrations/20260730000000_init_database_foundation/migration.sql`
- `backend/src/config/database.ts`
- `backend/src/lib/prisma.ts`
- `backend/src/utils/db.ts`
- `Phase-03_Verification_Report.md`

### Modified Files
- `backend/package.json`
- `backend/src/config/env.ts`
- `backend/.env` & `backend/.env.example`
- `.github/workflows/ci.yml`

---

## 8. Out-Of-Scope Compliance Confirmation

It is explicitly confirmed that:
- ❌ No authentication endpoints or JWT logic were added.
- ❌ No API controllers or routes were added.
- ❌ No business services or domain logic were added.
- ❌ No frontend UI modifications were made.

---

**Report Status:** Verified & Ready for Phase 04.
