# 23_Database_ERD.md

# CampusPrint -- Database Entity Relationship Design

## 1. Purpose

This document describes the logical relationships between MongoDB
collections used by CampusPrint and serves as the reference for data
modelling and backend implementation.

------------------------------------------------------------------------

# 2. High-Level ER Diagram

``` text
                     +------------------+
                     |      Users       |
                     +------------------+
                     | _id              |
                     | name             |
                     | email            |
                     | role             |
                     +------------------+
                              |
                         1    |    N
                              |
                              ▼
                     +------------------+
                     |      Orders      |
                     +------------------+
                     | _id              |
                     | userId           |
                     | paymentId        |
                     | status           |
                     | total            |
                     +------------------+
                       |           |
                 1     |           |     1
                       |           |
                       ▼           ▼
             +----------------+  +----------------+
             |   OrderFiles   |  |    Payments    |
             +----------------+  +----------------+
             | orderId        |  | orderId        |
             | storedFile     |  | amount         |
             | pageCount      |  | status         |
             +----------------+  +----------------+

Users
  │
  ├───────────────< Notifications
  │
  └───────────────< ActivityLogs
```

------------------------------------------------------------------------

# 3. Collection Relationships

  Parent   Child           Cardinality
  -------- --------------- -------------
  Users    Orders          1 : N
  Orders   OrderFiles      1 : N
  Orders   Payments        1 : 1
  Users    Notifications   1 : N
  Users    ActivityLogs    1 : N

------------------------------------------------------------------------

# 4. Collection Details

## Users

Primary Key

-   `_id`

Referenced By

-   Orders.userId
-   Notifications.userId
-   ActivityLogs.actorId

------------------------------------------------------------------------

## Orders

Primary Key

-   `_id`

Foreign References

-   userId → Users
-   paymentId → Payments

Contains

-   Pricing summary
-   Status
-   Estimated completion
-   Remarks

------------------------------------------------------------------------

## OrderFiles

Linked To

-   Orders

Contains

-   File metadata
-   Print options
-   Calculated price
-   Upload information

------------------------------------------------------------------------

## Payments

Linked To

-   Orders

Contains

-   Razorpay identifiers
-   Payment status
-   Amount
-   Currency
-   Timestamp

------------------------------------------------------------------------

## Notifications

Linked To

-   Users

Stores

-   Title
-   Message
-   Read state
-   Notification type

------------------------------------------------------------------------

## Activity Logs

Linked To

-   Users

Captures

-   Login events
-   Order updates
-   Administrative actions
-   Payment events

------------------------------------------------------------------------

## Settings

Singleton collection.

Stores

-   Pricing defaults
-   Upload limits
-   Institute information
-   Business configuration

------------------------------------------------------------------------

# 5. Relationship Principles

-   Use MongoDB ObjectId references.
-   Embed only immutable or very small structures.
-   Avoid unnecessary duplication.
-   Index frequently queried references.

------------------------------------------------------------------------

# 6. Index Recommendations

Users

-   email
-   studentId

Orders

-   userId
-   orderNumber
-   status
-   createdAt

Payments

-   orderId
-   razorpayPaymentId

Notifications

-   userId
-   isRead

------------------------------------------------------------------------

# 7. Data Integrity Rules

-   Every order belongs to exactly one user.
-   Every payment belongs to exactly one order.
-   Orders may contain multiple uploaded files.
-   Payment verification is required before queue assignment.
-   Soft deletion should preserve historical integrity.

------------------------------------------------------------------------

# 8. Future ER Extensions

Future entities may include:

-   Campuses
-   Print Centres
-   Printers
-   Coupons
-   Wallets
-   Inventory
-   Suppliers
-   Audit Policies
-   AI Recommendations

------------------------------------------------------------------------

# 9. Acceptance Criteria

The ER model is complete when:

-   Relationships are clearly defined.
-   Cardinalities are documented.
-   Referential integrity rules are established.
-   Future entities can be introduced without major schema redesign.
