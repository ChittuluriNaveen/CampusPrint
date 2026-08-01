# 06_Database_Design.md

# CampusPrint -- Database Design Specification

## Purpose

This document defines the logical data model, MongoDB collections,
relationships, validation rules, indexes and design decisions for
CampusPrint.

------------------------------------------------------------------------

# Database Technology

-   MongoDB
-   Mongoose ODM

Database Name

``` text
campusprint
```

------------------------------------------------------------------------

# Design Principles

-   Normalise where appropriate
-   Embed small immutable objects
-   Reference large or shared entities
-   Use ObjectId relationships
-   Add audit timestamps to every collection
-   Soft delete where appropriate

------------------------------------------------------------------------

# Collections

1.  users
2.  orders
3.  orderFiles
4.  payments
5.  pricing
6.  notifications
7.  activityLogs
8.  settings

------------------------------------------------------------------------

# users

Purpose

Stores authentication and profile information.

## Fields

  Field        Type       Required
  ------------ ---------- --------------
  \_id         ObjectId   Yes
  name         String     Yes
  email        String     Yes (Unique)
  password     String     Yes
  studentId    String     Student Only
  role         Enum       Yes
  department   String     Optional
  year         Number     Optional
  phone        String     Optional
  avatar       String     Optional
  mustChangePassword Boolean Optional
  isVerified   Boolean    Yes
  status       Enum       Yes
  createdAt    Date       Yes
  updatedAt    Date       Yes

Role Enum

-   STUDENT
-   OPERATOR
-   ADMIN
-   SUPER_ADMIN

Status Enum

-   ACTIVE
-   INACTIVE
-   BLOCKED

Indexes

-   email (unique)
-   studentId

------------------------------------------------------------------------

# orders

Purpose

Represents a complete print order.

## Fields

  Field                 Type
  --------------------- ----------
  \_id                  ObjectId
  orderNumber           String
  userId                ObjectId
  paymentId             ObjectId
  status                Enum
  subtotal              Number
  tax                   Number
  total                 Number
  estimatedCompletion   Date
  remarks               String
  pickupCode                 String
  pickupCodeGeneratedAt      Date
  pickupVerifiedAt           Date
  pickupVerifiedBy           String
  pickupVerificationAttempts Number
  pickupVerificationMethod   String
  createdAt             Date
  updatedAt             Date

Status

-   DRAFT
-   SUBMITTED
-   PENDING_REVIEW
-   ACCEPTED
-   PAYMENT_PENDING
-   PAID
-   QUEUED
-   PRINTING
-   QUALITY_CHECK
-   READY_FOR_PICKUP
-   COLLECTED
-   COMPLETED
-   REJECTED
-   CANCELLED
-   REFUNDED

Indexes

-   orderNumber (unique)
-   userId
-   status
-   pickupCode

------------------------------------------------------------------------

# orderFiles

Each order may contain multiple files.

Fields

-   orderId
-   originalFileName
-   storedFileName
-   mimeType
-   size
-   pageCount
-   copies
-   paperSize
-   colourMode
-   duplexMode
-   orientation
-   binding
-   lamination
-   coverPage
-   pageRange
-   specialInstructions
-   calculatedPrice

Paper Size

-   A4
-   A3
-   Letter
-   Legal

Colour Mode

-   BW
-   COLOUR

Duplex

-   SINGLE
-   DOUBLE

Indexes

-   orderId

------------------------------------------------------------------------

# payments

Fields

-   orderId (unique)
-   userId (optional foreign key)
-   gateway (default: "RAZORPAY")
-   razorpayOrderId
-   razorpayPaymentId (unique)
-   razorpaySignature
-   transactionReference (unique)
-   amount
-   currency
-   paymentMethod
-   paymentStatus
-   verifiedAt
-   verificationStatus (default: "PENDING")
-   refundStatus (default: "NONE")
-   paidAt
-   createdAt
-   updatedAt

Payment Status

-   CREATED
-   SUCCESS
-   FAILED
-   REFUNDED

Indexes

-   orderId (unique)
-   userId
-   razorpayPaymentId (unique)
-   transactionReference (unique)
-   paymentStatus
-   createdAt

------------------------------------------------------------------------

# pricing

Purpose

Stores configurable pricing.

Fields

-   paperSize
-   colourMode
-   duplexMode
-   basePrice
-   bindingPrice
-   laminationPrice
-   gstPercentage
-   active

Only administrators may modify pricing.

------------------------------------------------------------------------

# notifications

Fields

-   userId
-   title
-   message
-   type
-   isRead
-   createdAt

Types

-   INFO
-   SUCCESS
-   WARNING
-   ERROR

------------------------------------------------------------------------

# activityLogs

Stores audit information.

Fields

-   actorId
-   action
-   entity
-   entityId
-   ipAddress
-   userAgent
-   timestamp

------------------------------------------------------------------------

# settings

Stores application configuration.

Examples

-   Upload Size Limit
-   Allowed File Types
-   Institute Name
-   Contact Information
-   Support Email

------------------------------------------------------------------------

# Relationships

``` text
User
 │
 └───< Orders
          │
          ├───< OrderFiles
          │
          └──── Payment

User
 │
 └───< Notifications

User
 │
 └───< ActivityLogs
```

------------------------------------------------------------------------

# Validation Rules

Email

-   Required
-   Unique
-   Valid format

Password

-   Minimum 8 characters
-   Hashed before storage

Files

-   Maximum upload size configurable
-   Supported MIME types only

Payments

-   Signature verification mandatory

------------------------------------------------------------------------

# Audit Fields

Every collection should include:

-   createdAt
-   updatedAt

Optional

-   deletedAt
-   createdBy
-   updatedBy

------------------------------------------------------------------------

# Soft Delete Strategy

Avoid permanent deletion.

Instead:

-   status = INACTIVE
-   deletedAt timestamp

------------------------------------------------------------------------

# Example Order Document

``` json
{
  "orderNumber":"CP-2026-000145",
  "userId":"ObjectId",
  "status":"PAID",
  "subtotal":95,
  "tax":5,
  "total":100
}
```

------------------------------------------------------------------------

# Performance Recommendations

Indexes

-   email
-   orderNumber
-   paymentId
-   userId
-   status

Use pagination for:

-   Orders
-   Notifications
-   Activity Logs

Avoid loading large file metadata unnecessarily.

------------------------------------------------------------------------

# Future Extensions

-   Multi-campus support
-   Multiple print shops
-   Printer inventory
-   Coupon collection
-   Loyalty points
-   Campus wallet
-   ERP integration

------------------------------------------------------------------------

# Database Success Criteria

The schema should:

-   minimise duplication
-   support efficient querying
-   remain extensible
-   enforce data integrity
-   support future scaling
