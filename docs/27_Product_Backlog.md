# 27_Product_Backlog.md

# CampusPrint -- Product Backlog

## 1. Purpose

This backlog organises the work required to deliver CampusPrint using
agile principles. It prioritises features, defines user stories, and
supports sprint planning.

------------------------------------------------------------------------

# 2. Product Vision

Deliver a reliable, secure, and user-friendly campus printing platform
that streamlines document printing for students and provides
administrators with efficient operational tools.

------------------------------------------------------------------------

# 3. Epics

  Epic   Description
  ------ ----------------------------------
  E1     Authentication & User Management
  E2     Student Experience
  E3     Order Management
  E4     Payments
  E5     Administration
  E6     Reporting & Analytics
  E7     Platform & Security

------------------------------------------------------------------------

# 4. MVP Backlog

  ID      User Story                                        Priority     Story Points
  ------- ------------------------------------------------- ---------- --------------
  US-01   As a student, I can register an account.          Must                    3
  US-02   As a student, I can log in securely.              Must                    3
  US-03   As a student, I can upload print files.           Must                    8
  US-04   As a student, I can configure print settings.     Must                    5
  US-05   As a student, I can pay online.                   Must                    8
  US-06   As a student, I can track my order.               Must                    5
  US-07   As an administrator, I can manage print queues.   Must                    8
  US-08   As an administrator, I can update pricing.        Should                  5
  US-09   As an administrator, I can view reports.          Should                  8

------------------------------------------------------------------------

# 5. Future Backlog

-   QR code collection
-   Campus wallet
-   Coupons
-   OCR enhancements
-   AI print recommendations
-   Mobile application
-   Multi-campus support
-   Cloud object storage
-   Real-time printer monitoring
-   Multi-language support

------------------------------------------------------------------------

# 6. Acceptance Criteria

Each user story should:

-   Have clear business value.
-   Be independently testable.
-   Include measurable acceptance criteria.
-   Be reviewed before development.

------------------------------------------------------------------------

# 7. Sprint Allocation

## Sprint 1

-   Authentication
-   Project setup
-   Database

## Sprint 2

-   File upload
-   Pricing
-   Order creation

## Sprint 3

-   Payments
-   Notifications
-   Order tracking

## Sprint 4

-   Admin dashboard
-   Queue management
-   Reports

## Sprint 5

-   Testing
-   Optimisation
-   Deployment
-   Documentation

------------------------------------------------------------------------

# 8. Dependencies

-   Authentication before orders.
-   Orders before payments.
-   Payments before queue assignment.
-   Reporting depends on operational data.

------------------------------------------------------------------------

# 9. Prioritisation (MoSCoW)

Must Have

-   Authentication
-   Orders
-   Payments
-   Admin dashboard

Should Have

-   Reports
-   Notifications
-   Pricing management

Could Have

-   OCR
-   Coupons
-   Wallet

Won't Have (Initial Release)

-   Mobile app
-   Multi-campus deployment

------------------------------------------------------------------------

# 10. Definition of Ready (DoR)

A backlog item is ready when:

-   Business value is understood.
-   Acceptance criteria exist.
-   Dependencies are identified.
-   Estimated story points are assigned.

------------------------------------------------------------------------

# 11. Definition of Done (DoD)

A backlog item is complete when:

-   Code is merged.
-   Tests pass.
-   Documentation is updated.
-   Security requirements are met.
-   Product Owner acceptance is received.

------------------------------------------------------------------------

# 12. Risk Register

  Risk                     Mitigation
  ------------------------ --------------------------
  Payment failures         Retry and reconciliation
  Large uploads            Validation and limits
  Infrastructure outages   Monitoring and backups
  Scope creep              Backlog refinement

------------------------------------------------------------------------

# 13. Release Checklist

-   MVP stories complete
-   Critical defects resolved
-   Security checklist passed
-   Performance verified
-   Deployment successful
-   Documentation approved

------------------------------------------------------------------------

# 14. Acceptance Criteria

The product backlog is complete when epics, user stories, priorities,
dependencies, release planning, and agile readiness are documented and
aligned with the CampusPrint roadmap.
