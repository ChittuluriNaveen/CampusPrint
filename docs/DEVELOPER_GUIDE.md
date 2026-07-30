# CampusPrint Developer Architecture & Extension Guide

## Overview

This guide provides technical developers with codebase architecture details, design patterns, database schema relations, coding standards, testing instructions, and extension guidelines for **CampusPrint**.

---

## 1. Project Architecture & Monorepo Layout

```
CampusPrint/
├── backend/                  # Node.js + Express.js API Server
│   ├── prisma/               # Database Schema & Seeders
│   ├── src/
│   │   ├── __tests__/        # 16 Comprehensive Automated Test Suites
│   │   ├── config/           # App, Database, & Env Validation Config
│   │   ├── controllers/      # Express Route Request Controllers
│   │   ├── middleware/       # JWT Auth, Zod Validation, Multer, Error Handlers
│   │   ├── routes/           # Versioned REST API Route Definitions (/v1)
│   │   ├── services/         # Business Logic Service Layer
│   │   ├── types/            # TypeScript Interface Definitions
│   │   └── utils/            # Hashing, Token, Formatting Utilities
├── frontend/                 # React 18 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/       # Reusable UI Design System Components
│   │   ├── pages/            # Student & Admin Page Views
│   │   ├── services/         # Axios API Client Requests
│   │   └── context/          # React Auth & Theme Context Providers
├── docker/                   # NGINX Reverse Proxy & Container Dockerfiles
├── docs/                     # Comprehensive System Documentation
├── scripts/                  # Database Backup & Restore Automation Scripts
└── reports/                  # Phase Completion Audit Reports
```

---

## 2. Technology Stack Specifications

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Axios, React Router v6.
- **Backend:** Node.js 20, Express 4, Prisma ORM 5, PostgreSQL 16.
- **Security:** Bcrypt (10 salt rounds), JWT Bearer authentication, Zod input sanitization, Multer MIME/extension whitelisting.
- **Payment Gateway:** Razorpay SDK with HMAC-SHA256 signature verification.
- **DevOps:** Docker, Docker Compose, NGINX Reverse Proxy, GitHub Actions CI/CD.

---

## 3. Database Schema Overview (Prisma ORM)

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String
  fullName      String
  role          Role           @default(STUDENT)
  documents     Document[]
  orders        Order[]
  notifications Notification[]
  createdAt     DateTime       @default(now())
}

model Document {
  id             String      @id @default(uuid())
  userId         String
  originalName   String
  storedFilename String
  mimeType       String
  fileSize       Int
  pageCount      Int
  user           User        @relation(fields: [userId], references: [id])
  orderItems     OrderItem[]
  createdAt      DateTime    @default(now())
}

model Order {
  id            String       @id @default(uuid())
  orderNumber   String       @unique
  userId        String
  totalAmount   Float
  status        OrderStatus  @default(PENDING)
  paymentStatus PaymentState @default(PENDING)
  user          User         @relation(fields: [userId], references: [id])
  items         OrderItem[]
  printJobs     PrintJob[]
  payments      Payment[]
  createdAt     DateTime     @default(now())
}
```

---

## 4. Development Workflow & Commands

### Running Locally
```bash
# Start PostgreSQL Database in Docker
docker-compose -f docker-compose.dev.yml up -d

# Start Backend API Server
cd backend
npm run dev

# Start Frontend Dev Server
cd frontend
npm run dev
```

### Running Test Suite & Linting
```bash
# Run all 16 Backend Test Suites
npm run test

# Run Monorepo ESLint Verification
npm run lint

# Build Production Bundles
npm run build
```

---

## 5. Adding New Modules

When introducing a new feature module (e.g., `Discounts`):
1. **Schema:** Add model definition to `backend/prisma/schema.prisma` and run `npx prisma db push`.
2. **Service Layer:** Implement pure business logic in `backend/src/services/discount.service.ts`.
3. **Controller:** Implement request handling and Zod schema validation in `backend/src/controllers/discount.controller.ts`.
4. **Routes:** Register versioned routes in `backend/src/routes/discount.routes.ts` and mount in `backend/src/routes/index.ts`.
5. **Testing:** Create automated unit test suite in `backend/src/__tests__/discount.test.ts` and append to `package.json`.
