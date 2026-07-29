# 02_Business_Requirements.md

# CampusPrint -- Business Requirements Specification

## 1. Purpose

This document defines the business requirements for CampusPrint. It
describes what the platform must achieve from the perspective of
students, print shop operators, and university administration.

------------------------------------------------------------------------

# 2. Business Goals

-   Digitise the campus printing workflow.
-   Minimise queues and waiting time.
-   Eliminate manual order tracking.
-   Enable secure online payments.
-   Increase operational efficiency.
-   Provide complete visibility into every print order.
-   Support future expansion to multiple campuses.

------------------------------------------------------------------------

# 3. Stakeholders

## Primary

-   Students
-   Print Shop Administrators

## Secondary

-   University Administration
-   IT Support Team

------------------------------------------------------------------------

# 4. User Personas

## Student

Needs: - Upload files easily. - Configure print settings. - Know the
exact price. - Pay online. - Track order status.

Pain Points: - Waiting in queues. - Cash-only payments. - Uncertainty
about order readiness.

------------------------------------------------------------------------

## Print Shop Administrator

Needs: - Centralised dashboard. - Print queue management. - Pricing
management. - Revenue reports. - Easy access to uploaded files.

Pain Points: - WhatsApp orders. - Manual calculations. - Paper-based
tracking.

------------------------------------------------------------------------

# 5. Business Rules

## User Registration

-   University email should be preferred.
-   Email verification should be supported.
-   Passwords must be securely hashed.

## Orders

-   One order may contain one or more files.
-   Each file has independent print configuration.
-   Orders receive a unique order number.

## Payments

-   Payment is required before printing.
-   Failed payments do not create active print jobs.
-   Successful payments generate invoices.
-   Refunds may only be initiated by administrators.

## Printing

-   Orders enter the queue only after payment verification.
-   Administrators update order progress.
-   Completed orders remain available in history.

------------------------------------------------------------------------

# 6. Order Lifecycle

Draft

↓

Price Calculated

↓

Payment Pending

↓

Payment Successful

↓

Queued

↓

Printing

↓

Quality Check

↓

Ready for Collection

↓

Collected

OR

Cancelled

OR

Refunded

------------------------------------------------------------------------

# 7. Functional Expectations

Students shall be able to:

-   Register
-   Login
-   Upload documents
-   Preview uploaded files
-   Configure print options
-   View live pricing
-   Pay online
-   Track orders
-   Download invoices

Administrators shall be able to:

-   Login securely
-   Manage pricing
-   Manage users
-   Process print jobs
-   Generate reports
-   View analytics

------------------------------------------------------------------------

# 8. Pricing Rules

Pricing should support:

-   Black & White
-   Colour
-   Single Side
-   Double Side
-   Multiple paper sizes
-   Binding
-   Lamination
-   GST (configurable)

Pricing must be configurable from the admin dashboard without code
changes.

------------------------------------------------------------------------

# 9. Reporting Requirements

The system should provide:

-   Daily revenue
-   Weekly revenue
-   Monthly revenue
-   Order counts
-   Pending jobs
-   Completed jobs
-   Most popular print options

------------------------------------------------------------------------

# 10. Notifications

Students receive notifications when:

-   Payment succeeds
-   Printing starts
-   Order is ready
-   Order is cancelled
-   Refund is processed

Delivery channels:

-   In-app
-   Email
-   SMS (future)
-   WhatsApp (future)

------------------------------------------------------------------------

# 11. Success Metrics (KPIs)

-   Average order submission time
-   Average processing time
-   Number of daily orders
-   Revenue per day
-   Customer satisfaction
-   Failed payment rate
-   Average queue length

------------------------------------------------------------------------

# 12. Constraints

-   Internet connection required.
-   Payments depend on payment gateway availability.
-   Uploaded files must respect size limits.
-   Supported file formats only.

------------------------------------------------------------------------

# 13. Assumptions

-   Students possess valid university accounts.
-   Administrators have authority to process print jobs.
-   Payment gateway credentials are correctly configured.

------------------------------------------------------------------------

# 14. Acceptance Criteria

The MVP is considered complete when:

-   Student authentication works.
-   File uploads are reliable.
-   Dynamic pricing is accurate.
-   Online payment is successful.
-   Orders are tracked end-to-end.
-   Admin dashboard manages the complete workflow.
-   Reports and analytics are available.
-   Responsive UI works on desktop and mobile.

------------------------------------------------------------------------

# 15. Future Business Expansion

-   Multi-campus deployment
-   Department-specific pricing
-   Faculty printing
-   Library integration
-   Campus wallet
-   Subscription plans
-   Franchise print centres
-   API integrations with ERP systems

This document forms the business foundation for all functional and
technical specifications in the project.
