# 09_Payment_System.md

# CampusPrint -- Payment System Specification

## 1. Purpose

This document specifies the payment architecture for CampusPrint. The
initial implementation uses Razorpay to support secure online payments
before an order enters the print queue.

------------------------------------------------------------------------

# 2. Objectives

-   Accept secure online payments
-   Prevent unpaid orders from printing
-   Verify payment authenticity
-   Generate invoices
-   Maintain a complete payment audit trail

------------------------------------------------------------------------

# 3. Payment Provider

Primary Gateway

-   Razorpay

Supported Methods

-   UPI
-   Credit Card
-   Debit Card
-   Net Banking
-   Wallets

Future Providers

-   Stripe
-   PayPal
-   Cash (admin initiated)
-   Campus Wallet

------------------------------------------------------------------------

# 4. Payment Lifecycle

``` text
Student
   │
   ▼
Configure Print Options
   │
   ▼
Dynamic Price Calculation
   │
   ▼
Create Razorpay Order
   │
   ▼
Checkout
   │
   ▼
Payment Success
   │
   ▼
Signature Verification
   │
   ▼
Create Print Order
   │
   ▼
Queue Assignment
```

------------------------------------------------------------------------

# 5. Business Rules

-   Payment is mandatory before printing.
-   Prices are calculated on the server.
-   The client must never be trusted for pricing.
-   Orders are created only after successful verification.
-   Every payment must be linked to exactly one order.

------------------------------------------------------------------------

# 6. Order Creation

Backend Endpoint

`POST /api/v1/payments/create-order`

Responsibilities

-   Validate user
-   Recalculate price
-   Create Razorpay order
-   Store temporary payment record
-   Return order details

------------------------------------------------------------------------

# 7. Checkout Flow

Frontend

1.  Receive Razorpay Order ID
2.  Launch Razorpay Checkout
3.  User completes payment
4.  Capture payment identifiers
5.  Send verification request

------------------------------------------------------------------------

# 8. Payment Verification

Endpoint

`POST /api/v1/payments/verify`

Verify

-   razorpay_order_id
-   razorpay_payment_id
-   razorpay_signature

Only after verification:

-   Mark payment successful
-   Create print order
-   Generate invoice
-   Notify student

------------------------------------------------------------------------

# 9. Database Flow

payments

↓

SUCCESS

↓

orders

↓

notifications

↓

activityLogs

------------------------------------------------------------------------

# 10. Payment States

-   CREATED
-   PENDING
-   SUCCESS
-   FAILED
-   CANCELLED
-   REFUNDED

------------------------------------------------------------------------

# 11. Failure Handling

Possible failures

-   Payment cancelled
-   Network interruption
-   Signature mismatch
-   Timeout
-   Gateway error

Behaviour

-   Do not create print order.
-   Preserve payment attempt.
-   Allow retry.

------------------------------------------------------------------------

# 12. Idempotency

Verification endpoint must be idempotent.

Repeated verification requests shall not create duplicate orders or
duplicate invoices.

------------------------------------------------------------------------

# 13. Refunds

Only administrators may initiate refunds.

Refund Workflow

``` text
Admin
  │
  ▼
Approve Refund
  │
  ▼
Razorpay Refund API
  │
  ▼
Update Payment Status
  │
  ▼
Notify Student
```

Refund Status

-   REQUESTED
-   PROCESSING
-   COMPLETED
-   FAILED

------------------------------------------------------------------------

# 14. Invoice Generation

Generate PDF after successful payment.

Invoice includes

-   Invoice Number
-   Order Number
-   Payment ID
-   Student Details
-   File Summary
-   Cost Breakdown
-   GST
-   Total Amount
-   Payment Date

Invoices remain downloadable.

------------------------------------------------------------------------

# 15. Notifications

Student receives notifications for

-   Payment successful
-   Payment failed
-   Refund completed

Delivery

-   In-app
-   Email

------------------------------------------------------------------------

# 16. Security

-   HTTPS only
-   Verify Razorpay signature
-   Never trust client-side amount
-   Store gateway identifiers
-   Keep API keys in environment variables
-   Log payment events without exposing secrets

------------------------------------------------------------------------

# 17. Reporting

Admin dashboard shall display

-   Total revenue
-   Today's revenue
-   Failed payments
-   Refunds
-   Average order value
-   Payment method distribution

------------------------------------------------------------------------

# 18. Future Enhancements

-   Subscription plans
-   Campus wallet
-   Coupon engine
-   Promotional codes
-   Split payments
-   Multiple payment gateways

------------------------------------------------------------------------

# 19. Acceptance Criteria

The payment module is complete when:

-   Orders cannot bypass payment.
-   Successful payments are verified.
-   Duplicate verification is prevented.
-   Invoices are generated.
-   Failed payments do not create print jobs.
-   Refunds update payment history correctly.
