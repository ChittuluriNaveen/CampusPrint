# Enhancement Proposal: Online Payment Management System

## Objective

Implement a complete Online Payment Management System for CampusPrint.

Students should be able to securely pay for their print requests through Razorpay after the order has been accepted and the final price has been confirmed.

The system must automatically record every payment transaction and provide administrators with a centralized payment management dashboard.

The implementation should integrate seamlessly with the existing Print Request Workflow.

---

# Existing Workflow

Current lifecycle:

Submitted

↓

Pending Review

↓

Accepted

↓

Payment Pending

↓

Queued

↓

Printing

↓

Quality Check

↓

Ready for Pickup

↓

Collected

↓

Completed

---

# Updated Workflow

Submitted

↓

Pending Review

↓

Accepted

↓

Payment Pending

↓

Student Pays Online

↓

Payment Verification

↓

Payment Successful

↓

Queued

↓

Printing

↓

Quality Check

↓

Ready for Pickup

↓

Collected

↓

Completed

If payment fails:

Payment Pending

↓

Retry Payment

or

Cancel Order

---

# Functional Requirements

## 1. Student Payment Flow

When an order reaches **PAYMENT_PENDING**:

Display:

- Order Summary
- Print Cost
- Additional Charges
- Taxes (if applicable)
- Total Amount

Provide:

**Pay Now**

button.

The student should only be able to pay the final approved amount.

No manual editing of payment amount should be possible.

---

## 2. Razorpay Integration

Integrate Razorpay using its official APIs.

Required flow:

Create Order

↓

Launch Razorpay Checkout

↓

Complete Payment

↓

Receive Payment Response

↓

Backend Verification

↓

Store Transaction

↓

Update Order Status

↓

Notify Student

The backend must verify payment signatures before marking payment as successful.

Never trust frontend payment responses alone.

---

## 3. Payment Verification

Implement secure verification.

Verify:

- Razorpay Order ID
- Razorpay Payment ID
- Razorpay Signature

Reject invalid signatures.

Only verified payments should update the order.

---

## 4. Database Changes

Introduce or extend a Payment entity.

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
- verificationStatus
- refundStatus
- createdAt
- updatedAt

Do not remove existing fields.

Maintain relationships with Orders and Users.

---

## 5. Order Integration

When payment succeeds:

Automatically:

- Mark payment as PAID
- Record transaction
- Update order status to QUEUED
- Trigger notification
- Record workflow history

If payment fails:

Keep order in PAYMENT_PENDING.

Allow retries.

---

## 6. Student Dashboard

Enhance the Orders page.

Display:

Order Summary

Payment Status

Transaction ID

Payment Date

Payment Method

Amount Paid

Download Receipt (future-ready placeholder)

Buttons:

Pay Now

Retry Payment

View Payment Details

---

## 7. Admin Payment Dashboard

Create a dedicated Payment Management page.

Display:

- Transaction ID
- Student
- Order Number
- Amount
- Payment Method
- Gateway
- Gateway Payment ID
- Payment Status
- Date & Time

Provide:

Search

Filters

Sort

Export (future-ready)

Summary cards:

Total Revenue

Today's Revenue

Pending Payments

Failed Payments

Successful Payments

---

## 8. Payment History

Students should have access to:

- Complete payment history
- Payment timestamps
- Transaction references
- Status

Administrators should be able to view payment history for every order.

---

## 9. Notifications

Automatically notify students when:

Payment Initiated

Payment Successful

Payment Failed

Payment Refunded (future)

Payment Cancelled

Reuse the existing notification service.

---

## 10. Security Requirements

Implement:

Backend payment verification

Signature validation

Amount validation

Replay attack prevention

Duplicate payment prevention

Authorization checks

Audit logging

Never expose secret keys to the frontend.

Store credentials using environment variables.

---

## 11. Audit Trail

Record:

Payment Created

Payment Initiated

Payment Verified

Payment Failed

Verification Result

Operator Actions (if any)

Integrate with the existing workflow history.

---

## 12. API Endpoints

Add endpoints similar to:

POST /payments/create-order

POST /payments/verify

GET /payments

GET /payments/:id

GET /orders/:id/payment

GET /students/payments

GET /admin/payments

Reuse existing authentication and RBAC middleware.

---

## 13. UI Enhancements

### Student

Order Details

---------------------------------

Status

Payment Pending

Amount

₹145.00

[ Pay Now ]

---------------------------------

After payment:

Payment Status

✔ Paid

Transaction ID

pay_xxxxxxxxx

Payment Method

Razorpay

Date

25 Jul 2026

---

### Admin

Payment Dashboard

---------------------------------

Order

Student

Amount

Gateway

Transaction ID

Status

Paid At

---------------------------------

Provide filtering and searching capabilities.

---

## 14. Future Compatibility

Design the payment layer so it can later support:

- Stripe
- Paytm
- PhonePe
- Cash Payments
- UPI
- Partial Payments
- Refunds
- Coupons
- Wallet Credits

without major architectural changes.

---

## Constraints

- Preserve the existing Print Request Workflow.
- Do not break current functionality.
- Follow Clean Architecture.
- Reuse existing RBAC.
- Reuse existing notification services.
- Maintain backward compatibility.
- Follow existing project coding standards.

---

## Deliverables

Implement:

1. Razorpay Integration
2. Backend Payment Verification
3. Payment Database Updates
4. Payment APIs
5. Student Payment Flow
6. Admin Payment Dashboard
7. Payment History
8. Notifications
9. Audit Logging
10. Tests

After implementation:

- Execute the complete backend and frontend test suites.
- Verify successful payment and failed payment scenarios.
- Confirm transaction records are correctly stored.
- Produce a completion report summarizing all implemented features and validation results.

One recommendation

Since CampusPrint is growing, I would introduce a dedicated Payment module rather than embedding payment logic inside the Order module. A clean structure like this keeps responsibilities separated:

backend/src/modules/
├── orders/
├── payments/
├── notifications/
├── documents/
├── users/
├── analytics/
└── ...

The Order module manages the print request lifecycle, while the Payment module owns payment creation, verification, transaction storage, and gateway integration. This separation makes it much easier to add refunds, multiple gateways, and financial reporting later without cluttering the order logic.