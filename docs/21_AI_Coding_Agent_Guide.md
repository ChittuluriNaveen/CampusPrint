# 21_AI_Coding_Agent_Guide.md

# CampusPrint -- AI Coding Agent Guide

## 1. Purpose

This document provides implementation rules and constraints for AI
coding agents building CampusPrint. It is intended to minimise ambiguity
and ensure a consistent, production-quality codebase.

------------------------------------------------------------------------

# 2. Primary Objectives

-   Build a production-ready application.
-   Prefer maintainability over shortcuts.
-   Follow the documented architecture.
-   Avoid introducing unnecessary dependencies.
-   Write self-explanatory, reusable code.

------------------------------------------------------------------------

# 3. Technology Stack

Frontend

-   React
-   Vite
-   TypeScript
-   React Router
-   TanStack Query
-   Tailwind CSS
-   React Hook Form
-   Zod

Backend

-   Node.js
-   Express
-   TypeScript
-   Mongoose
-   JWT
-   bcrypt
-   Multer

Database

-   MongoDB Atlas

Payments

-   Razorpay

------------------------------------------------------------------------

# 4. Non-Negotiable Rules

-   Do not hardcode secrets.
-   Never bypass authentication.
-   Validate all external input.
-   Keep controllers thin.
-   Place business logic in services.
-   Reuse existing components before creating new ones.
-   Write modular, testable code.

------------------------------------------------------------------------

# 5. Folder Ownership

-   `components/` -- reusable UI only
-   `pages/` -- page composition
-   `services/` -- business logic and API calls
-   `controllers/` -- HTTP request handling
-   `repositories/` -- database access
-   `validators/` -- request validation

------------------------------------------------------------------------

# 6. API Standards

-   RESTful endpoints
-   JSON responses
-   Consistent error format
-   Proper HTTP status codes
-   Versioned APIs (`/api/v1`)

------------------------------------------------------------------------

# 7. UI Standards

-   Responsive layouts
-   Accessible components
-   Consistent spacing and typography
-   Shared design tokens
-   No inline styles unless unavoidable

------------------------------------------------------------------------

# 8. Error Handling

Every API should:

-   Validate input
-   Catch unexpected errors
-   Return structured responses
-   Log server-side failures

Never expose stack traces in production.

------------------------------------------------------------------------

# 9. Code Quality

-   TypeScript strict mode
-   ESLint
-   Prettier
-   No dead code
-   No duplicated logic
-   Prefer composition over inheritance

------------------------------------------------------------------------

# 10. Security Checklist

-   JWT validation
-   RBAC checks
-   Password hashing
-   Secure file uploads
-   HTTPS in production
-   Environment variables for secrets

------------------------------------------------------------------------

# 11. Testing Expectations

Every new feature should include:

-   Unit tests where applicable
-   Integration tests for APIs
-   End-to-end coverage for critical workflows

------------------------------------------------------------------------

# 12. Performance Guidelines

-   Lazy-load routes
-   Optimise database queries
-   Paginate large datasets
-   Compress assets
-   Avoid unnecessary re-renders

------------------------------------------------------------------------

# 13. Definition of Done

A feature is complete when:

-   Functionality works as specified.
-   Code passes linting.
-   Tests pass.
-   Documentation is updated.
-   Accessibility is preserved.
-   No critical security issues remain.

------------------------------------------------------------------------

# 14. Implementation Priority

1.  Authentication
2.  Database
3.  Orders
4.  File Upload
5.  Payments
6.  Dashboards
7.  Reporting
8.  Optimisation

------------------------------------------------------------------------

# 15. Acceptance Criteria

An AI implementation is considered successful when it adheres to the
documented architecture, produces maintainable code, satisfies
acceptance criteria, and introduces no unnecessary technical debt.
