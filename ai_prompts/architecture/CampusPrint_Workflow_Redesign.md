# CampusPrint Business Workflow Specification

## Overview

CampusPrint is centered around a **Print Request** workflow rather than a traditional shopping cart model. A student selects documents, configures print options, reviews the estimated cost, and submits a request. The print shop processes the request through a defined lifecycle until the printed documents are collected.

---

# Student Workflow

1. Register or log in.
2. Upload one or more documents.
3. View uploaded documents in the document library.
4. Select the documents to print.
5. Configure print options for each document, such as:
   - Number of copies
   - Page range
   - Paper size
   - Color or Black & White
   - Single or Double-sided
   - Orientation
   - Binding
   - Lamination (if available)
6. Review the calculated price.
7. Submit the print request.
8. Track the request status from the dashboard.
9. Complete payment (online or at the print shop, depending on the configured workflow).
10. Receive notification when the order is ready.
11. Collect the printed documents.

---

# Print Operator Workflow

1. View newly submitted print requests.
2. Verify request details.
3. Accept or reject the request if necessary.
4. Process payment according to the configured policy.
5. Add accepted requests to the print queue.
6. Print the documents.
7. Update the request status during processing.
8. Mark the request as ready for pickup.
9. Confirm document collection.

---

# Administrator Workflow

Administrators oversee the system rather than individual print jobs.

Responsibilities include:

- Managing users
- Managing pricing rules
- Monitoring print requests
- Reviewing payments
- Viewing analytics
- Managing system settings
- Monitoring operational performance

---

# Print Request Lifecycle

The recommended lifecycle is:

Draft
↓
Submitted
↓
Pending Review
↓
Accepted
↓
Payment Pending
↓
Paid
↓
Queued
↓
Printing
↓
Ready for Pickup
↓
Collected
↓
Completed

Alternative states:
- Rejected
- Cancelled

---

# Pricing Workflow

1. Student selects print options.
2. The system calculates an estimated price.
3. The estimate is displayed before submission.
4. If the administrator modifies the price, the student should be informed before payment.
5. The final amount is recorded with the print request.

---

# Payment Workflow

CampusPrint supports multiple payment methods.

Possible methods include:
- Online payment
- Counter payment

The payment process should record:
- Payment status
- Transaction reference (if applicable)
- Payment method
- Payment timestamp

---

# Notification Workflow

Students should receive notifications for key events, including:
- Print request submitted
- Request accepted
- Request rejected
- Price updated
- Payment confirmed
- Printing started
- Ready for pickup
- Request completed

---

# Core Business Entity

The central business entity is the **Print Request**.

A Print Request may contain one or more documents, each with its own print configuration.

Each Print Request is associated with:
- A student
- One or more documents
- Pricing information
- Payment details
- Workflow history
- Notifications

---

# Design Principles

The workflow should:
- Be easy for students to understand.
- Minimize manual intervention.
- Support future scalability.
- Maintain a clear status lifecycle.
- Provide transparency in pricing and progress.
- Be adaptable for future enhancements such as multi-campus support and QR-based pickups.
