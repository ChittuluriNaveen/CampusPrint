# Enhancement Proposal: Pickup Verification System

## Objective

Extend the existing CampusPrint Print Request Workflow by introducing a secure Pickup Verification System for **online paid orders**.

The goal is to ensure that printed documents are handed over only to the intended student (or an authorized person with the verification code).

This enhancement must integrate with the existing workflow without breaking any current functionality.

---

# Current Workflow

Current lifecycle:

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

Quality Check

↓

Ready for Pickup

↓

Collected

↓

Completed

---

# Required Enhancement

When an order reaches the **READY_FOR_PICKUP** state, the system should automatically generate a secure Pickup Verification Code.

The code must be required before the print operator can mark the order as **COLLECTED**.

This feature applies primarily to **online payments**, but the design should allow enabling it for all payment methods in the future through configuration.

---

# Functional Requirements

## 1. Pickup Code Generation

Generate a unique verification code automatically when:

Order Status

READY_FOR_PICKUP

Requirements:

- Random and difficult to guess
- Unique across active orders
- Human-readable
- Approximately 6–8 characters
- Exclude ambiguous characters (0/O, 1/I)

Example:

```
CP-7X4KQ9
```

or

```
7X4KQ9
```

Only one active pickup code should exist per order.

---

## 2. Database Changes

Extend the Order entity with fields such as:

- pickupCode
- pickupCodeGeneratedAt
- pickupVerifiedAt
- pickupVerifiedBy
- pickupVerificationAttempts
- pickupVerificationMethod

Do not remove existing fields.

Create a migration if required.

---

## 3. Student Experience

When an order becomes READY_FOR_PICKUP:

- Generate the pickup code
- Store it
- Send a notification

Display on the Student Orders page:

Status

Ready for Pickup

Pickup Code

CP-7X4KQ9

Include helper text:

"Show this code to the print shop while collecting your documents."

The code should remain visible until collection.

---

## 4. Operator Workflow

When the operator opens a READY_FOR_PICKUP order:

Display:

- Student name
- Order details
- Pickup Code verification input

Operator actions:

Enter Pickup Code

↓

Verify

If valid:

READY_FOR_PICKUP

↓

COLLECTED

↓

COMPLETED

If invalid:

Display an error

Do not change the order status.

Increment verification attempt count.

---

## 5. API Endpoints

Add endpoints such as:

POST /orders/:id/generate-pickup-code

POST /orders/:id/verify-pickup

GET /orders/:id/pickup-code

Follow existing authentication and authorization rules.

Only authorized operators/admins may verify pickup.

Students may only view the code for their own orders.

---

## 6. Validation Rules

The system should verify:

- Order exists
- Order belongs to READY_FOR_PICKUP status
- Pickup code matches
- Order has not already been collected
- Operator has permission

Reject invalid requests with appropriate error responses.

---

## 7. Notifications

Automatically notify the student when:

- Pickup code is generated
- Order is ready for pickup
- Order has been successfully collected

Reuse the existing notification infrastructure.

---

## 8. Security Requirements

The implementation should:

- Never expose pickup codes of other users
- Prevent duplicate collections
- Log every verification attempt
- Record the verifying operator
- Prevent status manipulation
- Protect endpoints using existing RBAC middleware

---

## 9. UI Changes

### Student Portal

Order Details:

✔ Paid

✔ Printing

✔ Ready for Pickup

Pickup Code:

CP-7X4KQ9

---

### Operator Console

Ready for Pickup

Student:
John Doe

Order:
#CP1024

Enter Pickup Code

[____________]

[ Verify Pickup ]

Display success or failure messages.

---

## 10. Audit Trail

Record:

- Pickup code generation time
- Verification time
- Verified by
- Verification result
- Failed verification attempts

Integrate with the existing workflow history.

---

## 11. Future Compatibility

Design the solution so it can later support:

- QR Code pickup
- OTP verification
- Student ID verification
- Multiple pickup methods
- Self-service kiosk verification

without requiring major architectural changes.

---

## Constraints

- Do not modify the existing order lifecycle.
- Do not break current payment functionality.
- Follow existing project architecture.
- Reuse existing notification services.
- Reuse existing RBAC.
- Follow existing coding standards.
- Maintain backward compatibility.

---

## Deliverables

Implement:

1. Database schema updates
2. Migration
3. Backend services
4. API endpoints
5. Validation logic
6. Notification integration
7. Student UI updates
8. Operator UI updates
9. Audit logging
10. Tests

After implementation:

- Run the existing test suite.
- Verify that no existing functionality is broken.
- Produce a completion report summarizing all implemented changes.

One optional enhancement

- Instead of showing the raw code only, you could also generate a QR code from the same pickup code and display both in the student portal. The operator could either type the code or scan the QR code. Since the QR simply encodes the existing pickup code, you can add scanning later without changing the database or workflow.