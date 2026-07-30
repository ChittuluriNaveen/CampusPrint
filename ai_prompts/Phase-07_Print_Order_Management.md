# Phase 07 — Print Order Management

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement the complete Print Order Management module for CampusPrint.

This phase establishes the order lifecycle using documents uploaded in Phase 06.

Students should be able to create, view, update and cancel their own print orders.

Administrators should manage order status according to the defined workflow.

This phase must NOT implement pricing calculations, shopping cart functionality or payment processing.

---

# Documentation

Before implementation read ONLY:

- reports/Previous-Phase-Report.md
- docs/10_Order_Management.md
- docs/12_Security.md
- docs/16_Project_Structure.md
- docs/29_Coding_Standards.md

---

# Scope

Implement ONLY:

✓ Create Print Order

✓ Update Print Order

✓ Cancel Print Order

✓ Order Details

✓ Order History

✓ Order Status Management

✓ Order Validation

✓ Order Number Generation

✓ Order Metadata

✓ Order Search

✓ Order Filtering

✓ Pagination

✓ Admin Order Management

✓ Audit Logging (if documented)

---

# Out of Scope

Do NOT implement:

❌ Pricing Calculation

❌ Shopping Cart

❌ Payments

❌ Invoice Generation

❌ Notifications

❌ Analytics

❌ Dashboard Statistics

❌ Business Intelligence

---

# Order Creation

Students should be able to create an order from previously uploaded documents.

Validate:

- Document ownership
- Document existence
- Required print options
- User permissions

Do not allow orders using deleted or inaccessible documents.

---

# Order Fields

Implement fields defined in the documentation.

Typical examples include:

- Order Number
- User
- Document
- Print Colour
- Print Side
- Paper Size
- Paper Type
- Orientation
- Number of Copies
- Page Range
- Binding Option
- Notes
- Current Status
- Created Date
- Updated Date

Follow the documentation exactly.

---

# Order Status

Implement the documented workflow.

Typical examples:

Pending

Submitted

Processing

Ready

Completed

Cancelled

Prevent invalid status transitions.

---

# APIs

Implement only documented endpoints.

Typical examples:

POST /orders

GET /orders

GET /orders/:id

PUT /orders/:id

PATCH /orders/:id/status

DELETE /orders/:id

---

# Validation

Validate:

Order ownership

Uploaded document

Print options

Copy count

Page ranges

Status transitions

Required fields

Return consistent validation errors.

---

# Security

Implement:

Ownership validation

Role-based access

Administrator permissions

Order access restrictions

Prevent:

Access to other users' orders

Status manipulation

Invalid requests

Privilege escalation

---

# Database

Reuse existing Prisma models.

Extend the schema only if required by the documentation.

Create migrations only when necessary.

---

# Services

Create reusable services for:

Order Creation

Order Updates

Order Status

Order Search

Order Validation

Order History

Avoid duplicated logic.

---

# Middleware

Reuse:

Authentication

Authorization

Validation

Error handling

Create new middleware only when required.

---

# Error Handling

Handle:

Order not found

Document not found

Permission denied

Invalid print options

Invalid status transition

Database errors

Return standard API responses.

---

# Logging

Log:

Order created

Order updated

Order cancelled

Status changed

Administrator actions

Do not log sensitive information.

---

# Coding Standards

Every implementation must:

- Follow SOLID principles
- Use TypeScript
- Be modular
- Be reusable
- Use async/await
- Be production ready

---

# Validation Checklist

Verify:

✓ Order creation works

✓ Order update works

✓ Order cancellation works

✓ Order history works

✓ Order search works

✓ Status transitions validated

✓ Ownership enforced

✓ Authorization enforced

✓ Build passes

✓ Lint passes

---

# Deliverables

Provide:

1. Order Management Architecture

2. Order Lifecycle

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

✓ Print order management works

✓ Order lifecycle implemented

✓ Order validation complete

✓ Security enforced

✓ Build passes

✓ Lint passes

✓ No pricing logic implemented

✓ No payment logic implemented

✓ No shopping cart implemented

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

reports/Phase-07-Report.md

4. Commit:

git add .

git commit -m "Phase 07: Print order management"

5. If a Git remote is configured:

git push origin main

Stop.

Wait for user approval before Phase 08.