# Phase 09 — Shopping Cart & Checkout

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement the complete Shopping Cart and Checkout module for CampusPrint.

This phase enables students to collect multiple print orders into a cart, review pricing, modify items, and proceed to checkout.

This phase prepares orders for payment but must NOT implement payment processing.

---

# Documentation

Before implementation read ONLY:

- reports/Previous-Phase-Report.md
- docs/10_Order_Management.md
- docs/11_Pricing_and_Cost_Calculation.md
- docs/12_Security.md
- docs/16_Project_Structure.md
- docs/29_Coding_Standards.md

---

# Scope

Implement ONLY:

✓ Shopping Cart

✓ Cart Items

✓ Add to Cart

✓ Remove from Cart

✓ Update Cart Item

✓ Quantity Management

✓ Cart Summary

✓ Price Summary

✓ Checkout Preparation

✓ Order Review

✓ Cart Validation

✓ Cart Persistence

✓ Checkout Validation

---

# Out of Scope

Do NOT implement:

❌ Payment Gateway

❌ Payment Processing

❌ Refunds

❌ Invoice Generation

❌ Notifications

❌ Analytics

❌ Delivery Tracking

❌ Printing Workflow

---

# Shopping Cart

Implement:

- Create cart
- Retrieve cart
- Add order to cart
- Remove order from cart
- Update cart
- Clear cart
- Calculate totals
- Validate cart before checkout

Each authenticated user should have only one active cart.

---

# Cart Items

Each cart item should reference:

- Print Order
- Quantity
- Unit Price
- Total Price
- Created Date
- Updated Date

Use the Pricing Engine from Phase 08.

Never duplicate pricing logic.

---

# Checkout

Implement checkout preparation only.

Generate:

- Checkout Summary
- Item Breakdown
- Pricing Summary
- Tax Summary (if documented)
- Discount Summary (if documented)
- Grand Total

Do not initiate payment.

---

# APIs

Implement only documented endpoints.

Typical examples:

POST /cart

GET /cart

POST /cart/items

PUT /cart/items/:id

DELETE /cart/items/:id

DELETE /cart

POST /checkout/preview

---

# Validation

Validate:

- Order ownership
- Existing orders
- Valid quantities
- Pricing consistency
- Duplicate cart entries
- Cart status

Reject invalid requests.

---

# Security

Implement:

Ownership validation

Authenticated access

Authorization

Checkout validation

Prevent:

Access to another user's cart

Duplicate checkout

Invalid pricing manipulation

Unauthorized modifications

---

# Database

Reuse existing models.

Extend schema only if required.

Generate migrations only when necessary.

---

# Services

Create reusable services for:

Cart

Cart Items

Checkout

Cart Validation

Price Summary

Checkout Summary

---

# Middleware

Reuse existing middleware.

Add cart-specific validation middleware only if required.

---

# Error Handling

Handle:

Cart not found

Order not found

Duplicate items

Invalid quantities

Pricing mismatch

Permission denied

Database failures

Return consistent API responses.

---

# Logging

Log:

Cart created

Cart updated

Item added

Item removed

Checkout preview generated

Do not log sensitive information.

---

# Coding Standards

Every implementation must:

- Follow SOLID principles
- Use TypeScript
- Be reusable
- Be modular
- Use async/await
- Be production ready

---

# Validation Checklist

Verify:

✓ Cart creation works

✓ Add/remove items works

✓ Cart updates work

✓ Price summary correct

✓ Checkout preview works

✓ Validation works

✓ Security enforced

✓ Build passes

✓ Lint passes

---

# Deliverables

Provide:

1. Shopping Cart Architecture

2. Checkout Flow

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

✓ Shopping cart works

✓ Checkout preview works

✓ Pricing integration complete

✓ Validation complete

✓ Build passes

✓ Lint passes

✓ No payment gateway implemented

✓ No invoice generation implemented

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

reports/Phase-09-Report.md

4. Commit:

git add .

git commit -m "Phase 09: Shopping cart and checkout"

5. If a Git remote is configured:

git push origin main

Stop.

Wait for user approval before Phase 10.