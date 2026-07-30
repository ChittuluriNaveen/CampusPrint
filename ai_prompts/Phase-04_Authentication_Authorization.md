# Phase 04 — Authentication & Authorization

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement the complete authentication and authorization foundation for CampusPrint.

This phase establishes secure user authentication, role-based authorization,
session management, password security, and protected routes.

The implementation must be production-ready and follow security best practices.

---

# Documentation

Read ONLY the following:

- reports/Phase-03-Report.md
- docs/06_Authentication.md
- docs/07_Role_Based_Access_Control.md
- docs/12_Security.md
- docs/16_Project_Structure.md
- docs/29_Coding_Standards.md

Do NOT reread previous implementation prompts.

---

# Scope

Implement ONLY:

✓ Authentication infrastructure

✓ Authorization

✓ User registration

✓ User login

✓ User logout

✓ Password hashing

✓ JWT authentication

✓ Refresh token support

✓ Role-based access control

✓ Authentication middleware

✓ Protected routes

✓ Session management

✓ Input validation

✓ Authentication error handling

---

# Out of Scope

Do NOT implement:

❌ Student Dashboard

❌ Admin Dashboard

❌ File Upload

❌ Orders

❌ Payments

❌ Pricing

❌ Notifications

❌ Reports

❌ Analytics

❌ Business Logic

---

# Technology

Use the project stack.

Examples:

- JWT
- bcrypt
- Express
- Prisma
- TypeScript

Use the project's existing architecture.

---

# Folder Structure

Verify or create:

backend/src/

auth/

controllers/

services/

middleware/

validators/

routes/

types/

utils/

Do not duplicate existing utilities.

---

# Authentication

Implement:

- Register
- Login
- Logout
- Refresh Token
- Current User endpoint

Passwords must NEVER be stored in plain text.

Always hash passwords.

---

# Password Security

Implement:

- bcrypt hashing
- Secure comparison
- Password validation rules

Follow project documentation.

---

# JWT

Implement:

- Access Token
- Refresh Token
- Token verification
- Token expiration
- Secret from environment variables

Never hardcode secrets.

---

# Authorization

Implement Role-Based Access Control.

Supported roles should follow the documentation.

Typical examples:

- Student
- Admin

Create reusable authorization middleware.

---

# Middleware

Implement:

Authentication middleware

Authorization middleware

Request validation middleware

Centralized authentication error handling

---

# Validation

Validate:

- Email
- Password
- Required fields

Return consistent validation errors.

---

# Security

Implement:

Password hashing

JWT verification

Protected routes

Role validation

Secure HTTP-only cookies if the project documentation specifies cookie-based authentication.

Prevent:

- Unauthorized access
- Invalid tokens
- Expired tokens
- Privilege escalation

---

# API Endpoints

Implement only the documented authentication endpoints.

Typical endpoints:

POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh

GET /auth/me

Do not implement unrelated APIs.

---

# Error Handling

Handle:

Invalid credentials

Duplicate users

Missing tokens

Expired tokens

Invalid tokens

Permission denied

Validation errors

Return consistent API responses.

---

# Environment Variables

Verify required variables such as:

JWT_SECRET

JWT_REFRESH_SECRET

ACCESS_TOKEN_EXPIRY

REFRESH_TOKEN_EXPIRY

Do not expose secret values.

---

# Logging

Log authentication events where appropriate.

Do not log passwords or tokens.

---

# Coding Standards

All code must:

- Use TypeScript
- Be reusable
- Follow SOLID principles
- Avoid duplicated logic
- Use async/await
- Be production-ready

---

# Validation Checklist

Verify:

✓ User registration works

✓ Login works

✓ Logout works

✓ JWT generation works

✓ Refresh token works

✓ Protected routes reject unauthorized users

✓ Role checks work

✓ Passwords are hashed

✓ Build passes

✓ Lint passes

---

# Deliverables

Provide:

1. Authentication architecture

2. Authorization architecture

3. Routes created

4. Middleware created

5. Services created

6. Validation strategy

7. Security summary

8. Environment variables required

9. Build status

10. Lint status

---

# Success Criteria

This phase is complete only if:

✓ Secure authentication implemented

✓ Authorization implemented

✓ Password hashing implemented

✓ JWT implemented

✓ Protected routes implemented

✓ Build passes

✓ Lint passes

✓ No dashboard functionality added

✓ No business modules implemented

---

# Final Instruction

When implementation is complete:

1. Run build

2. Run lint

3. Run tests (if applicable)

4. Read:

ai-prompts/shared/PHASE_COMPLETION_REPORT.md

5. Generate and save:

reports/Phase-04-Report.md

6. Commit:

git add .
git commit -m "Phase 04: Authentication and authorization"

7. If a Git remote is configured:

git push origin main

Stop after generating the report.

Wait for approval before Phase 05.