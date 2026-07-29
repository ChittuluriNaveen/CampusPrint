# 03_Functional_Requirements.md

# CampusPrint -- Functional Requirements Specification (FRS)

## 1. Purpose

This document defines the functional behaviour of CampusPrint. Every
feature described here must be implemented to satisfy the business
requirements.

------------------------------------------------------------------------

# 2. User Roles

## Student

Permissions:

-   Register
-   Login
-   Upload files
-   Configure print settings
-   Place orders
-   Make payments
-   Track orders
-   Download invoices
-   Edit profile

## Administrator

Permissions:

-   Login
-   View all orders
-   Download submitted files
-   Manage pricing
-   Update order status
-   View analytics
-   Manage users
-   Send notifications
-   Export reports

## Super Administrator (Future)

-   Manage campuses
-   Manage administrators
-   Global settings

------------------------------------------------------------------------

# 3. Authentication Module

### FR-001 User Registration

The system shall allow students to register using:

-   Name
-   University Email
-   Student ID
-   Department
-   Year
-   Password

Validation:

-   Email must be unique.
-   Password must meet security policy.
-   Student ID cannot be duplicated.

Acceptance Criteria

-   Registration succeeds with valid data.
-   Duplicate accounts are rejected.
-   Passwords are hashed.

------------------------------------------------------------------------

### FR-002 Login

The system shall authenticate users using JWT.

Acceptance Criteria

-   Valid credentials return access token.
-   Invalid credentials return an appropriate error.
-   Role is included in the token payload.

------------------------------------------------------------------------

# 4. Student Dashboard

The dashboard shall display:

-   Recent orders
-   Pending orders
-   Ready for collection
-   Total amount spent
-   Notifications
-   Quick upload button

------------------------------------------------------------------------

# 5. Document Upload

Supported formats:

-   PDF
-   DOCX
-   PPTX
-   JPG
-   PNG

Requirements:

-   Drag-and-drop upload
-   Progress indicator
-   Maximum size configurable
-   File validation
-   Secure storage
-   Unique filenames

Acceptance Criteria

-   Invalid file types are rejected.
-   Upload progress is visible.
-   Uploaded files are linked to the student.

------------------------------------------------------------------------

# 6. Print Configuration

Each uploaded file shall support:

-   Copies
-   Page range
-   Single / Double sided
-   Colour / Black & White
-   Portrait / Landscape
-   Paper size
-   Paper quality
-   Binding
-   Lamination
-   Cover page
-   Special instructions

Changing any option shall immediately update the estimated price.

------------------------------------------------------------------------

# 7. Pricing Engine

The system shall calculate the total cost dynamically.

Factors include:

-   Paper size
-   Number of pages
-   Copies
-   Colour mode
-   Duplex printing
-   Binding
-   Lamination
-   Tax

The pricing model must be configurable by administrators.

------------------------------------------------------------------------

# 8. Shopping Cart

The system shall allow multiple documents in one order.

Each document retains independent print settings while sharing a single
payment.

------------------------------------------------------------------------

# 9. Payment Module

Payment Provider

-   Razorpay

Workflow

1.  Create order
2.  Redirect to checkout
3.  Complete payment
4.  Verify signature
5.  Store payment details
6.  Create print order
7.  Generate invoice

Failed payments shall not enter the print queue.

------------------------------------------------------------------------

# 10. Order Management

Each order shall contain:

-   Unique order number
-   Student
-   Files
-   Print options
-   Payment status
-   Order status
-   Estimated completion time

Students may search and filter previous orders.

------------------------------------------------------------------------

# 11. Queue Management

Administrators shall manage queues:

-   Payment Pending
-   Queued
-   Printing
-   Quality Check
-   Ready
-   Collected
-   Cancelled

Orders shall move only through valid transitions.

------------------------------------------------------------------------

# 12. Notifications

Students shall receive notifications when:

-   Payment succeeds
-   Printing begins
-   Order is ready
-   Order is cancelled
-   Refund completes

Delivery channels:

-   In-app
-   Email

------------------------------------------------------------------------

# 13. Invoice Generation

The system shall generate a PDF invoice containing:

-   Order ID
-   Payment ID
-   Student details
-   Print configuration
-   Cost breakdown
-   Date and time

Invoices shall remain downloadable.

------------------------------------------------------------------------

# 14. Admin Dashboard

Dashboard shall include:

-   Revenue summary
-   Order statistics
-   Queue overview
-   Recent activity
-   Popular print services
-   Daily charts
-   Monthly charts

------------------------------------------------------------------------

# 15. Reports

Administrators shall generate:

-   Daily reports
-   Weekly reports
-   Monthly reports
-   Revenue reports
-   Customer reports
-   Order reports

Reports should support CSV export.

------------------------------------------------------------------------

# 16. Search and Filtering

Students:

-   Search by order ID
-   Filter by status
-   Filter by date

Administrators:

-   Search by student
-   Search by payment ID
-   Filter by queue
-   Filter by payment status

------------------------------------------------------------------------

# 17. Profile Management

Students may:

-   Update profile
-   Change password
-   View activity
-   Manage notification preferences

------------------------------------------------------------------------

# 18. Validation

The system shall validate:

-   Email format
-   Password strength
-   File type
-   File size
-   Required fields
-   Payment verification

Validation shall occur on both client and server.

------------------------------------------------------------------------

# 19. Error Handling

The application shall provide clear messages for:

-   Upload failures
-   Payment failures
-   Network errors
-   Authentication failures
-   Validation errors

Internal errors shall be logged without exposing sensitive details.

------------------------------------------------------------------------

# 20. Accessibility

The interface shall:

-   Support keyboard navigation
-   Provide sufficient colour contrast
-   Include descriptive labels
-   Remain usable on desktop, tablet and mobile devices

------------------------------------------------------------------------

# 21. Functional Acceptance

The system is functionally complete when:

-   Authentication works correctly.
-   Files upload successfully.
-   Dynamic pricing is accurate.
-   Payments are verified.
-   Orders move through the queue.
-   Notifications are delivered.
-   Invoices are generated.
-   Reports are available.
-   Students and administrators can complete their respective workflows
    without manual intervention.
