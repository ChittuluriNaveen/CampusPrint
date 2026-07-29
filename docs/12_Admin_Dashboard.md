# 12_Admin_Dashboard.md

# CampusPrint -- Admin Dashboard Specification

## 1. Purpose

The Admin Dashboard is the operational control centre for CampusPrint.
It enables administrators to manage print operations, monitor business
performance, configure pricing, and oversee users.

------------------------------------------------------------------------

# 2. Design Goals

-   Fast access to critical information
-   Minimal clicks for common tasks
-   Responsive desktop-first interface
-   Role-based permissions
-   Real-time operational visibility

------------------------------------------------------------------------

# 3. Navigation

``` text
Dashboard
├── Orders
├── Queue
├── Users
├── Pricing
├── Payments
├── Reports
├── Notifications
├── Settings
└── Profile
```

------------------------------------------------------------------------

# 4. Dashboard Overview

Display KPI cards for:

-   Total Orders
-   Orders in Queue
-   Printing Now
-   Ready for Collection
-   Today's Revenue
-   Monthly Revenue
-   Active Students
-   Failed Payments

Include quick links to frequently used actions.

------------------------------------------------------------------------

# 5. Order Management

Features

-   Search by Order ID
-   Filter by Status
-   Filter by Date
-   View order details
-   Download uploaded files
-   Update order status
-   Add internal remarks
-   Print order summary

Bulk actions

-   Assign queue
-   Mark ready
-   Export selected orders

------------------------------------------------------------------------

# 6. Queue Management

Display

-   Queue position
-   Estimated completion
-   Assigned printer
-   Priority

Actions

-   Reorder queue
-   Pause job
-   Resume job
-   Cancel job
-   Retry failed job

------------------------------------------------------------------------

# 7. User Management

Administrators can:

-   View users
-   Search students
-   Edit profiles
-   Activate/deactivate accounts
-   Reset passwords (future)
-   Soft delete accounts

------------------------------------------------------------------------

# 8. Pricing Management

Manage configurable pricing for:

-   Paper size
-   Colour/BW
-   Duplex
-   Binding
-   Lamination
-   GST
-   Service charges

Changes should take effect immediately for new orders.

------------------------------------------------------------------------

# 9. Payments

Display

-   Successful payments
-   Failed payments
-   Refunds
-   Payment methods
-   Revenue trends

Actions

-   View payment details
-   Initiate refunds
-   Download invoices

------------------------------------------------------------------------

# 10. Reports

Generate reports by:

-   Day
-   Week
-   Month
-   Academic year

Export formats

-   CSV
-   PDF (future)
-   Excel (future)

------------------------------------------------------------------------

# 11. Notifications

Administrators receive alerts for:

-   Failed payments
-   Upload failures
-   Queue issues
-   Printer issues (future)
-   Refund requests

------------------------------------------------------------------------

# 12. Settings

Configure:

-   Upload size limit
-   Supported file types
-   Business hours
-   Retention period
-   Institute details
-   Contact information

------------------------------------------------------------------------

# 13. Security & Permissions

Only ADMIN and SUPER_ADMIN roles may access the dashboard.

Sensitive actions require:

-   JWT authentication
-   Role validation
-   Audit logging

------------------------------------------------------------------------

# 14. Responsive Behaviour

Optimised for:

-   Desktop (primary)
-   Tablet
-   Mobile (limited operational support)

------------------------------------------------------------------------

# 15. Future Enhancements

-   Live printer monitoring
-   AI demand forecasting
-   Inventory management
-   Multi-campus administration
-   Advanced analytics
-   Dark mode

------------------------------------------------------------------------

# 16. Acceptance Criteria

The Admin Dashboard is complete when administrators can:

-   Manage every order lifecycle stage
-   Configure pricing
-   Monitor payments
-   Generate reports
-   Manage users
-   Control the print queue
-   Perform all actions securely with appropriate permissions
