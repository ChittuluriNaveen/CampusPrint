# CampusPrint API Reference Specification (v1.0.0)

## Overview

The CampusPrint REST API follows standard HTTP status codes, JSON payload conventions, versioning under `/api/v1/`, and JWT Bearer authorization.

- **Base URL:** `http://localhost:5000/api/v1` (Production: `https://campusprint.edu/api/v1`)
- **Authentication Header:** `Authorization: Bearer <jwt_token>`
- **Content Type:** `application/json` (except `/documents/upload` which requires `multipart/form-data`)

---

## Endpoint Summary

### 1. Health & Infrastructure
- `GET /health/liveness` — Public process liveness check.
- `GET /health/readiness` — System readiness (Database & Storage write checks).
- `GET /health/metrics` — System memory, heap, and runtime metrics.

### 2. Authentication (`/auth`)
- `POST /auth/register` — Student account registration.
- `POST /auth/login` — Account login & JWT issuance.
- `GET /auth/me` — Retrieve current authenticated user profile.
- `POST /auth/refresh-token` — Refresh session JWT token.

### 3. User Management (`/users`)
- `GET /users/profile` — Get authenticated user details.
- `PUT /users/profile` — Update name, phone, department, year.
- `PUT /users/change-password` — Update user password.

### 4. Admin User Controls (`/admin/users`)
- `GET /admin/users` — List users with pagination and search filter.
- `GET /admin/users/:id` — Retrieve user details by ID.
- `PUT /admin/users/:id` — Admin update user role or status.
- `DELETE /admin/users/:id` — Soft-delete/deactivate user.

### 5. Document Management (`/documents`)
- `POST /documents/upload` — Upload print document (`multipart/form-data`).
- `GET /documents` — List uploaded documents for user.
- `GET /documents/:id` — Get document details.
- `PATCH /documents/:id/rename` — Rename stored document alias.
- `DELETE /documents/:id` — Delete document from vault.

### 6. Print Order Management (`/orders`)
- `POST /orders` — Create new print order.
- `GET /orders` — List user's print orders.
- `GET /orders/:id` — Retrieve order breakdown & job statuses.
- `POST /orders/:id/cancel` — Cancel pending unpaid order.

### 7. Admin Order Management (`/admin/orders`)
- `GET /admin/orders` — List all orders across campus.
- `PATCH /admin/orders/:id/status` — Update order status.

### 8. Pricing Engine (`/pricing`)
- `POST /pricing/calculate` — Calculate item and total order cost breakdown.
- `GET /pricing/config` — Get current paper size and print mode price table.
- `PUT /admin/pricing/config` — Admin update base pricing rates.

### 9. Shopping Cart & Checkout (`/cart`)
- `GET /cart` — Get user's active shopping cart items.
- `POST /cart/items` — Add document item to cart.
- `PUT /cart/items/:itemId` — Update cart item configuration.
- `DELETE /cart/items/:itemId` — Remove item from cart.
- `DELETE /cart` — Clear entire cart.
- `POST /checkout/preview` — Get instant checkout tax breakdown.

### 10. Payment Integration (`/payments`)
- `POST /payments/create-order` — Create Razorpay order payload.
- `POST /payments/verify` — Verify gateway HMAC-SHA256 signature.
- `POST /payments/retry` — Retry failed payment transaction.
- `GET /payments/history` — Get payment transaction history.

### 11. Print Operator Queue (`/print-jobs`)
- `GET /print-jobs/queue` — Get operator active print queue.
- `PATCH /print-jobs/:id/status` — Operator update job state (`QUEUED` -> `PRINTING` -> `READY` -> `COLLECTED`).

### 12. Notifications (`/notifications`)
- `GET /notifications` — List user notifications.
- `PATCH /notifications/:id/read` — Mark notification as read.
- `PATCH /notifications/read-all` — Mark all notifications as read.

### 13. Analytics & Business Intelligence (`/analytics`)
- `GET /analytics/dashboard` — Get operational KPI metrics.
- `GET /analytics/revenue` — Get revenue daily/weekly trend data.
- `GET /analytics/export` — Stream downloadable CSV business dataset.
