# Phase 05 — User & Profile Management

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement the complete User & Profile Management module for CampusPrint.

This phase focuses on user profile management after authentication has been completed.

Users should be able to securely manage their own account information.

Administrators should be able to manage users according to the project's RBAC rules.

This phase must NOT implement any print-order functionality or business workflows.

---

# Documentation

Before implementation, read ONLY:

- reports/Phase-04-Report.md
- docs/08_User_Management.md
- docs/12_Security.md
- docs/16_Project_Structure.md
- docs/29_Coding_Standards.md

Do NOT reread previous implementation prompts.

---

# Scope

Implement ONLY:

✓ Current User Profile

✓ Profile Update

✓ Change Password

✓ Profile Photo Support (if defined in documentation)

✓ User Preferences

✓ Account Status

✓ User Management APIs

✓ Admin User Management

✓ User Search

✓ User Filtering

✓ Pagination

✓ Validation

✓ Audit Logging (if documented)

---

# Out of Scope

Do NOT implement:

❌ Print Orders

❌ File Upload

❌ Pricing

❌ Payments

❌ Notifications

❌ Analytics

❌ Dashboards

❌ Printing Workflow

❌ Business Logic

---

# Technology

Use the existing project stack.

Use the existing authentication system implemented in Phase 04.

Do NOT replace authentication.

---

# User Features

Authenticated users should be able to:

- View profile
- Edit profile
- Change password
- View account information
- Manage personal preferences
- View assigned role

Only allow modification of permitted fields.

---

# Admin Features

If defined in the documentation, administrators can:

- View users
- Search users
- Filter users
- Update user status
- Enable/Disable users
- Assign roles
- Reset passwords (if documented)

Never allow privilege escalation.

---

# API Endpoints

Implement only documented endpoints.

Typical examples:

GET /users/me

PUT /users/me

PUT /users/me/password

GET /users

GET /users/:id

PUT /users/:id

PATCH /users/:id/status

DELETE /users/:id (only if documentation specifies)

---

# Validation

Validate:

- Name
- Email
- Phone
- Password
- Required fields
- Role updates

Return consistent validation responses.

---

# Security

Implement:

Ownership checks

Role validation

Password verification

Password hashing

Protected routes

Admin-only endpoints

Input validation

Prevent:

Unauthorized updates

Role escalation

Password disclosure

Mass assignment

---

# Database

Reuse the existing Prisma models.

Modify schema ONLY if documentation requires it.

Generate migrations only when necessary.

---

# Middleware

Reuse authentication middleware.

Reuse authorization middleware.

Add only profile-specific middleware if required.

---

# Services

Create reusable services for:

Profile

User Management

Password Management

Search

Pagination

Avoid duplicated logic.

---

# Error Handling

Handle:

User not found

Invalid password

Duplicate email

Permission denied

Validation failures

Database errors

Return consistent API responses.

---

# Logging

Log important events:

Profile updated

Password changed

Account status changed

Role changed

Do NOT log passwords or sensitive information.

---

# Coding Standards

Every implementation must:

- Follow SOLID principles
- Use TypeScript
- Use async/await
- Be reusable
- Avoid duplicated logic
- Be production-ready

---

# Validation Checklist

Verify:

✓ View profile works

✓ Update profile works

✓ Change password works

✓ Password hashing preserved

✓ Admin user management works

✓ Search works

✓ Pagination works

✓ Authorization works

✓ Build passes

✓ Lint passes

---

# Deliverables

Provide:

1. User Management Architecture

2. Profile Management Architecture

3. APIs Created

4. Services Created

5. Middleware Added

6. Validation Strategy

7. Security Summary

8. Build Status

9. Lint Status

10. Remaining Work

---

# Success Criteria

This phase is complete only if:

✓ Profile management is complete

✓ User management is complete

✓ Password management works

✓ Role restrictions enforced

✓ Build passes

✓ Lint passes

✓ No print-order functionality exists

✓ No payment module exists

✓ No dashboard implementation exists

---

# Final Instruction

When implementation is complete:

1. Run:

- npm run build
- npm run lint
- tests (if applicable)

2. Read:

ai-prompts/shared/PHASE_COMPLETION_REPORT.md

3. Generate:

reports/Phase-05-Report.md

4. Commit:

git add .
git commit -m "Phase 05: User and profile management"

5. If a Git remote is configured:

git push origin main

Stop.

Wait for approval before Phase 06.