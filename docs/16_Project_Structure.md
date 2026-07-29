# 16_Project_Structure.md

# CampusPrint -- Project Structure & Development Standards

## 1. Purpose

This document defines the recommended repository structure, coding
conventions, environment configuration, and development workflow for
CampusPrint.

------------------------------------------------------------------------

# 2. Recommended Architecture

CampusPrint follows a **monorepo** structure with separate frontend and
backend applications while allowing shared assets and types.

``` text
CampusPrint/
├── client/
├── server/
├── shared/
├── docs/
├── scripts/
├── .github/
├── docker/
├── package.json
├── README.md
└── .env.example
```

------------------------------------------------------------------------

# 3. Frontend Structure

``` text
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   └── layout/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   │   ├── auth/
│   │   ├── student/
│   │   ├── admin/
│   │   └── shared/
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

------------------------------------------------------------------------

# 4. Backend Structure

``` text
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── jobs/
│   ├── sockets/
│   ├── app.ts
│   └── server.ts
├── uploads/
├── tests/
└── package.json
```

------------------------------------------------------------------------

# 5. Shared Module

``` text
shared/
├── constants/
├── dto/
├── enums/
├── interfaces/
├── types/
└── validators/
```

Used for common types and validation shared between frontend and
backend.

------------------------------------------------------------------------

# 6. Documentation

``` text
docs/
├── architecture/
├── api/
├── deployment/
├── decisions/
└── user-guides/
```

------------------------------------------------------------------------

# 7. Environment Variables

Frontend

``` text
VITE_API_URL=
VITE_RAZORPAY_KEY=
```

Backend

``` text
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
UPLOAD_PATH=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
```

Never commit `.env` files.

------------------------------------------------------------------------

# 8. Naming Conventions

Files

-   PascalCase for React components
-   camelCase for utilities
-   kebab-case for folders where appropriate

Variables

-   camelCase

Constants

-   UPPER_SNAKE_CASE

Enums

-   PascalCase

------------------------------------------------------------------------

# 9. Coding Standards

-   TypeScript preferred
-   ESLint
-   Prettier
-   Husky pre-commit hooks
-   Conventional commits
-   No unused code
-   Small reusable functions

------------------------------------------------------------------------

# 10. Git Workflow

Main branches

-   main
-   develop

Feature branches

``` text
feature/order-tracking
feature/payment-module
feature/admin-dashboard
```

Bug fixes

``` text
fix/payment-verification
```

------------------------------------------------------------------------

# 11. Testing Structure

``` text
tests/
├── unit/
├── integration/
├── e2e/
└── fixtures/
```

Recommended tools

-   Vitest / Jest
-   React Testing Library
-   Supertest
-   Playwright

------------------------------------------------------------------------

# 12. Build & Deployment

Frontend

-   Vite build
-   Static hosting (Vercel/Netlify)

Backend

-   Node.js
-   Docker (optional)
-   Render / Railway / VPS

Database

-   MongoDB Atlas

------------------------------------------------------------------------

# 13. Asset Management

Store:

-   Logos
-   Icons
-   Illustrations
-   Static images
-   Fonts

Optimise assets before deployment.

------------------------------------------------------------------------

# 14. Logging

Application logs

-   Errors
-   Warnings
-   Authentication
-   Payments
-   Uploads

Future

-   Centralised logging
-   Monitoring dashboards

------------------------------------------------------------------------

# 15. Future Repository Enhancements

-   Turborepo
-   Nx
-   CI/CD pipelines
-   Docker Compose
-   Kubernetes manifests
-   Shared UI package

------------------------------------------------------------------------

# 16. Acceptance Criteria

The project structure is complete when:

-   The repository is organised and modular.
-   Frontend and backend concerns are separated.
-   Shared code is reusable.
-   Coding standards are enforced.
-   New contributors can understand the project quickly.
