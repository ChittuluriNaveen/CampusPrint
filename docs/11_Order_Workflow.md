# 11_Order_Workflow.md

# CampusPrint -- Order Workflow Specification

## 1. Purpose

This document defines the complete lifecycle of a print order, including
business rules, state transitions, permissions, notifications, and
operational behaviour.

------------------------------------------------------------------------

# 2. Workflow Overview

``` text
Draft
  │
  ▼
Payment Pending
  │
  ▼
Paid
  │
  ▼
Queued
  │
  ▼
Printing
  │
  ▼
Quality Check
  │
  ▼
Ready for Collection
  │
  ▼
Collected
```

Alternative outcomes:

-   Cancelled
-   Refunded

------------------------------------------------------------------------

# 3. Order States

  State             Description
  ----------------- ---------------------------------
  DRAFT             Order created but not submitted
  PAYMENT_PENDING   Awaiting successful payment
  PAID              Payment verified
  QUEUED            Waiting for printing
  PRINTING          Print job in progress
  QUALITY_CHECK     Printed and under inspection
  READY             Ready for pickup
  COLLECTED         Handed to student
  CANCELLED         Cancelled before printing
  REFUNDED          Payment refunded

------------------------------------------------------------------------

# 4. State Transition Rules

-   DRAFT → PAYMENT_PENDING
-   PAYMENT_PENDING → PAID
-   PAID → QUEUED
-   QUEUED → PRINTING
-   PRINTING → QUALITY_CHECK
-   QUALITY_CHECK → READY
-   READY → COLLECTED

Exceptional transitions:

-   PAYMENT_PENDING → CANCELLED
-   PAID → REFUNDED (admin approval)
-   QUEUED → CANCELLED (if not started)

------------------------------------------------------------------------

# 5. Student Actions

Students may:

-   Create orders
-   Upload files
-   Configure print options
-   Complete payment
-   View order history
-   Track status
-   Download invoices
-   Cancel eligible orders

Students may not:

-   Change pricing
-   Modify completed orders
-   Access other users' orders

------------------------------------------------------------------------

# 6. Administrator Actions

Administrators may:

-   View all orders
-   Update status
-   Download print files
-   Manage queue
-   Issue refunds
-   Add remarks
-   Reprint when necessary

------------------------------------------------------------------------

# 7. Queue Management

Priority factors:

-   Payment verified
-   Submission time
-   Manual priority override
-   Urgent jobs (future)

Default policy:

-   First Paid, First Printed

------------------------------------------------------------------------

# 8. Notifications

Students receive notifications when:

-   Payment succeeds
-   Order enters queue
-   Printing starts
-   Ready for collection
-   Cancelled
-   Refunded

Delivery channels:

-   In-app
-   Email (future)

------------------------------------------------------------------------

# 9. Estimated Completion

Estimated completion considers:

-   Queue length
-   Number of pages
-   Copies
-   Printer availability
-   Business hours

Display estimated completion on the dashboard.

------------------------------------------------------------------------

# 10. Cancellation Policy

Allowed:

-   Before printing begins

Not allowed:

-   After PRINTING state

Administrator override available in exceptional cases.

------------------------------------------------------------------------

# 11. Refund Policy

Refunds require:

-   Administrator approval
-   Successful gateway refund
-   Audit log entry
-   Student notification

------------------------------------------------------------------------

# 12. Audit Trail

Record:

-   Status changes
-   Payment verification
-   Queue assignment
-   Print completion
-   Refunds
-   Administrative overrides

------------------------------------------------------------------------

# 13. Error Handling

Examples:

-   Printer unavailable
-   Corrupt document
-   Payment verification failed
-   Queue processing failure

The system must preserve order integrity and prevent duplicate
processing.

------------------------------------------------------------------------

# 14. Performance Targets

-   Status updates within seconds
-   Queue updates in near real time
-   Concurrent order handling
-   Reliable retry mechanisms

------------------------------------------------------------------------

# 15. Future Enhancements

-   Multiple print centres
-   Smart queue optimisation
-   AI completion prediction
-   SMS notifications
-   Self-service pickup lockers
-   Barcode/QR collection

------------------------------------------------------------------------

# 16. Acceptance Criteria

The workflow is complete when:

-   Every order follows valid state transitions.
-   Invalid transitions are rejected.
-   Payments control queue entry.
-   Students receive timely status updates.
-   Administrators can manage the workflow efficiently.
-   Every critical action is auditable.
