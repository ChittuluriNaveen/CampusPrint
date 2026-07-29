# 29_Coding_Standards.md

# CampusPrint -- Coding Standards

## 1. Purpose

This document defines the coding standards for CampusPrint to ensure
consistency, readability, maintainability, and long-term scalability.

------------------------------------------------------------------------

# 2. General Principles

-   Write clean, self-documenting code.
-   Prefer readability over cleverness.
-   Keep functions small and focused.
-   Avoid duplicated logic.
-   Follow SOLID principles where applicable.

------------------------------------------------------------------------

# 3. Language Standards

Frontend

-   TypeScript (strict mode)
-   React Functional Components
-   Hooks over class components

Backend

-   Node.js
-   Express
-   TypeScript
-   Async/Await (avoid nested callbacks)

------------------------------------------------------------------------

# 4. Naming Conventions

Variables

-   `camelCase`

Functions

-   `camelCase`

Components

-   `PascalCase`

Interfaces

-   Prefix with `I` only if project-wide convention requires it;
    otherwise use descriptive PascalCase.

Constants

-   `UPPER_SNAKE_CASE`

Files

-   Components: `UserCard.tsx`
-   Utilities: `dateUtils.ts`
-   Services: `paymentService.ts`

------------------------------------------------------------------------

# 5. Folder Structure

-   components/
-   pages/
-   hooks/
-   services/
-   repositories/
-   middleware/
-   validators/
-   utils/
-   types/

------------------------------------------------------------------------

# 6. React Guidelines

-   Keep components focused.
-   Extract reusable logic into hooks.
-   Use controlled forms.
-   Lazy-load large routes.
-   Memoise only when justified.

------------------------------------------------------------------------

# 7. Express Guidelines

-   Thin controllers
-   Business logic in services
-   Repository layer for database access
-   Centralised error handling
-   Validate every request

------------------------------------------------------------------------

# 8. Error Handling

-   Throw meaningful errors.
-   Use custom error classes where appropriate.
-   Never expose stack traces in production.

------------------------------------------------------------------------

# 9. Formatting

-   ESLint enforced
-   Prettier enforced
-   Two-space indentation
-   Consistent import ordering
-   Remove unused imports

------------------------------------------------------------------------

# 10. Git Standards

Branch Naming

-   feature/\*
-   bugfix/\*
-   hotfix/\*
-   release/\*

Commit Messages

Examples

-   feat: add order timeline
-   fix: resolve payment verification issue
-   docs: update API specification
-   refactor: simplify pricing service

------------------------------------------------------------------------

# 11. Code Reviews

Checklist

-   Functionality verified
-   Tests included
-   Documentation updated
-   Security reviewed
-   Performance considered

------------------------------------------------------------------------

# 12. Testing Expectations

-   Unit tests for business logic
-   Integration tests for APIs
-   End-to-end tests for critical flows

------------------------------------------------------------------------

# 13. Documentation

Every major module should include:

-   Purpose
-   Public interfaces
-   Assumptions
-   Limitations

------------------------------------------------------------------------

# 14. Definition of Quality

Code should be:

-   Readable
-   Testable
-   Secure
-   Performant
-   Reusable
-   Maintainable

------------------------------------------------------------------------

# 15. Acceptance Criteria

The coding standards are complete when all contributors can produce
consistent, production-ready code that aligns with the CampusPrint
architecture and development practices.
