# Enhancement Proposal: Shopping Cart & Razorpay Payment Integration

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement a complete Shopping Cart and Razorpay Payment Integration for CampusPrint.

Students should be able to:

- Add one or more print requests to their shopping cart.
- Review the cart.
- See live pricing.
- Apply print configurations.
- Proceed to checkout.
- Pay securely using Razorpay.
- Automatically update order status after successful payment.

Administrators should be able to:

- View every payment.
- View payment history.
- View transaction details.
- Verify payment status.
- Track payment failures.

This enhancement must integrate with the existing Print Request workflow without breaking existing functionality.

---

# Existing Workflow

Student

↓

Upload Documents

↓

Configure Print Settings

↓

Submit Print Request

↓

Accepted

↓

Payment Pending

↓

Printing

↓

Ready for Pickup

Currently the Shopping Cart and Razorpay payment flow are not integrated.

---

# Required Workflow

Student

↓

Document Library

↓

Select Documents

↓

Configure Print

↓

Add to Cart

↓

Shopping Cart

↓

Review Cart

↓

Checkout

↓

Razorpay Payment

↓

Backend Verification

↓

Transaction Stored

↓

Order Status Updated

↓

Queued

↓

Printing

↓

Ready for Pickup

↓

Pickup Verification

↓

Completed

---

# Scope

Implement ONLY:

✓ Shopping Cart

✓ Cart Management

✓ Checkout

✓ Razorpay Integration

✓ Payment Verification

✓ Transaction Storage

✓ Payment History

✓ Payment Dashboard

✓ Cart Summary

✓ Order Summary

✓ Payment Notifications

✓ Audit Logging

---

# Shopping Cart

Implement:

- Create Cart
- Add Item
- Remove Item
- Update Item
- Clear Cart
- Save Cart
- Cart Persistence

Each student should have one active cart.

---

# Cart Items

Each item should contain:

- Print Request
- Document
- Print Configuration
- Quantity
- Unit Price
- Total Price

The cart should support multiple print requests.

---

# Pricing

Display:

Subtotal

Additional Charges

Binding Charges

Lamination Charges

Taxes (if applicable)

Discounts (future)

Grand Total

Update pricing live whenever the cart changes.

---

# Checkout

Create a Checkout page displaying:

Order Summary

Cart Items

Price Breakdown

Payment Method

Terms & Conditions

Proceed to Payment

---

# Razorpay Integration

Integrate Razorpay using its official Checkout API.

Workflow:

Create Razorpay Order

↓

Open Razorpay Checkout

↓

Student Pays

↓

Receive Response

↓

Backend Verification

↓

Store Transaction

↓

Update Order

↓

Notify Student

---

# Backend Verification

Verify:

- Razorpay Order ID
- Razorpay Payment ID
- Razorpay Signature

Never trust the frontend response.

Reject invalid signatures.

---

# Database

Extend existing schema where required.

Create or update Payment model.

Suggested fields:

- paymentId
- orderId
- userId
- gateway
- gatewayOrderId
- gatewayPaymentId
- transactionReference
- paymentMethod
- amount
- currency
- status
- paidAt
- verifiedAt
- createdAt
- updatedAt

Maintain relationships with Orders and Users.

---

# Order Status

Successful Payment

↓

PAID

↓

QUEUED

↓

PRINTING

↓

READY_FOR_PICKUP

Failed Payment

↓

PAYMENT_PENDING

↓

Retry Payment

Cancelled Payment

↓

PAYMENT_PENDING

---

# Student Dashboard

Display:

Cart

↓

Checkout

↓

Payment Status

↓

Transaction Details

↓

Order Tracking

Student should see:

- Payment ID
- Amount Paid
- Payment Date
- Payment Method
- Transaction Status

---

# Admin Dashboard

Create Payment Management section.

Display:

Transaction ID

Student

Order

Amount

Gateway

Payment Status

Date

Gateway Payment ID

Search

Filter

Export (future)

Summary Cards:

Total Revenue

Today's Revenue

Pending Payments

Successful Payments

Failed Payments

---

# Notifications

Automatically notify students when:

- Payment Started
- Payment Successful
- Payment Failed
- Payment Cancelled

Reuse the existing notification system.

---

# Security

Implement:

- Backend Signature Verification
- JWT Authentication
- RBAC Authorization
- Duplicate Payment Prevention
- Replay Attack Prevention
- Amount Validation
- Secure Environment Variables

Never expose Razorpay Secret Keys.

---

# APIs

Implement endpoints similar to:

POST /cart

GET /cart

PUT /cart/items

DELETE /cart/items

POST /checkout

POST /payments/create-order

POST /payments/verify

GET /payments

GET /payments/:id

GET /students/payments

GET /admin/payments

Reuse existing authentication and RBAC middleware.

---

# Audit Logging

Record:

- Cart Created
- Cart Updated
- Checkout Started
- Payment Initiated
- Payment Verified
- Payment Failed
- Order Updated

Integrate with Workflow History.

---

# UI Requirements

Student:

- Shopping Cart Page
- Checkout Page
- Razorpay Integration
- Payment Success Page
- Payment Failure Page

Admin:

- Payment Dashboard
- Transaction Details
- Payment Search
- Revenue Summary

---

# Validation

Verify:

✓ Cart works correctly

✓ Multiple items supported

✓ Checkout works

✓ Razorpay payment succeeds

✓ Failed payments handled

✓ Transactions stored

✓ Order status updated

✓ Notifications sent

✓ Admin dashboard updated

✓ Build passes

✓ Lint passes

---

# Constraints

- Preserve existing Print Request workflow.
- Do not break current modules.
- Follow SOLID principles.
- Follow Clean Architecture.
- Reuse existing services wherever possible.
- Maintain backward compatibility.

---

# Deliverables

Implement:

1. Shopping Cart
2. Checkout
3. Razorpay Integration
4. Payment Verification
5. Transaction Storage
6. Student Payment History
7. Admin Payment Dashboard
8. Notifications
9. Audit Logging
10. Tests

- After implementation:

- Run backend and frontend test suites.
- Verify successful and failed payment flows.
- Verify transaction persistence.
- Confirm no existing functionality is broken.
- Generate an implementation report.

-From everything we've discussed, I would not use a traditional e-commerce cart for CampusPrint.

A better approach is:

Student
     │
Upload Documents
     │
Select Multiple Documents
     │
Configure Print Options
     │
Create ONE Print Request
     │
Review Summary
     │
Checkout
     │
Razorpay

Instead of:

Document
→ Cart
→ Cart
→ Cart
→ Checkout

A Print Request already groups multiple documents and their print settings, so introducing a separate shopping cart can duplicate responsibilities. If your existing cart simply acts as a review and checkout screen for a single print request, that's perfectly fine. If it behaves like a full e-commerce cart, consider simplifying it later to keep the architecture cleaner.