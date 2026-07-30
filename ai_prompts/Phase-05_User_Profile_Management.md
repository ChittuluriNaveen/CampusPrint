# Phase 05 — User Profile & User Management

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement complete User Profile & Admin User Management capabilities for CampusPrint.

This phase enables authenticated users to view/update their profile information and change passwords securely, while empowering administrators to list, filter, view, update role/status, and soft-delete user accounts.

---

# Documentation

Read ONLY the following:

- reports/Phase-04-Report.md
- docs/06_Database_Design.md
- docs/07_API_Specification.md
- docs/08_Authentication.md
- docs/29_Coding_Standards.md

---

# Scope

Implement ONLY:

✓ User profile retrieval (`GET /users/profile` & `GET /users/me`)

✓ User profile update (`PATCH /users/profile`)

✓ User password change (`PATCH /users/password`)

✓ Admin list users (`GET /admin/users` with pagination, search, role & status filters)

✓ Admin get user by ID (`GET /admin/users/:id`)

✓ Admin update user status/role (`PATCH /admin/users/:id`)

✓ Admin soft delete user (`DELETE /admin/users/:id`)

✓ Request validation schemas (Zod)

✓ Audit logging for profile updates & user status changes

---

# Out of Scope

Do NOT implement:

❌ File Upload

❌ Order Creation / Management

❌ Payment Integration

❌ Pricing Calculation

❌ Notifications System

❌ Reporting System

---

# Validation & Security Requirements

- Profile updates must disallow updating sensitive fields (`id`, `password`, `role`, `status`, `isVerified`).
- Password changes require verifying current password via bcrypt before updating to new hashed password.
- Password change must enforce password strength rules (min 8 chars, uppercase, lowercase, number).
- Admin user operations require `authenticate` and `authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN)` middlewares.
- Admin user deletion must execute soft-delete (`deletedAt = new Date()`), preserving relational integrity.
- All endpoints must return standard API response envelopes (`sendSuccess`, `sendError`).

---

# API Endpoints

User Endpoints:
- `GET /api/v1/users/profile` (Protected - Student/Admin)
- `PATCH /api/v1/users/profile` (Protected - Student/Admin)
- `PATCH /api/v1/users/password` (Protected - Student/Admin)

Admin User Management Endpoints:
- `GET /api/v1/admin/users` (Protected - Admin/Super Admin)
- `GET /api/v1/admin/users/:id` (Protected - Admin/Super Admin)
- `PATCH /api/v1/admin/users/:id` (Protected - Admin/Super Admin)
- `DELETE /api/v1/admin/users/:id` (Protected - Admin/Super Admin)
