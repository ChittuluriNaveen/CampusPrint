# 13_Student_Dashboard.md

# CampusPrint -- Student Dashboard Specification

## 1. Purpose

The Student Dashboard is the primary workspace where students upload
documents, configure print settings, make payments, track orders, and
manage their profile.

------------------------------------------------------------------------

# 2. Design Goals

-   Simple and intuitive
-   Minimal steps to place an order
-   Real-time order visibility
-   Mobile responsive
-   Accessible and fast

------------------------------------------------------------------------

# 3. Navigation

``` text
Home
├── Dashboard
├── New Order
├── My Orders
├── Payments
├── Notifications
├── Profile
└── Help
```

------------------------------------------------------------------------

# 4. Dashboard Overview

Display summary cards:

-   Active Orders
-   Ready for Collection
-   Total Orders
-   Total Amount Spent

Quick actions:

-   New Print Order
-   Track Latest Order
-   Download Latest Invoice

------------------------------------------------------------------------

# 5. New Order Workflow

1.  Upload one or more files
2.  Validate files
3.  Configure print options
4.  Review pricing
5.  Complete payment
6.  Receive confirmation
7.  Track progress

------------------------------------------------------------------------

# 6. Print Configuration

Options:

-   Paper Size (A4, A3, Letter, Legal)
-   Black & White / Colour
-   Single / Double Sided
-   Copies
-   Orientation
-   Binding
-   Lamination
-   Page Range
-   Cover Page
-   Special Instructions

Display live price updates after every change.

------------------------------------------------------------------------

# 7. My Orders

Features:

-   Search by Order ID
-   Filter by status
-   Sort by date
-   View order details
-   Download invoice
-   Cancel eligible orders
-   View payment information

------------------------------------------------------------------------

# 8. Live Order Tracking

Timeline:

``` text
Payment Verified
   ↓
Queued
   ↓
Printing
   ↓
Quality Check
   ↓
Ready
   ↓
Collected
```

Show estimated completion time and latest status.

------------------------------------------------------------------------

# 9. Payments

Students can:

-   Pay online
-   View payment history
-   Download receipts
-   Check refund status

Supported methods:

-   UPI
-   Cards
-   Net Banking
-   Wallets

------------------------------------------------------------------------

# 10. Notifications

Receive alerts for:

-   Payment success/failure
-   Queue entry
-   Printing started
-   Ready for collection
-   Refund updates

Mark notifications as read.

------------------------------------------------------------------------

# 11. Profile

Manage:

-   Personal details
-   Password
-   Profile photo
-   Contact information

View:

-   Student ID
-   Department
-   Academic year

------------------------------------------------------------------------

# 12. Help & Support

Provide:

-   FAQs
-   Contact information
-   Report an issue
-   Order support

------------------------------------------------------------------------

# 13. Responsive Behaviour

Optimised for:

-   Desktop
-   Tablet
-   Mobile

Key actions remain accessible on smaller screens.

------------------------------------------------------------------------

# 14. Accessibility

-   Keyboard navigation
-   High colour contrast
-   Screen reader labels
-   Visible focus indicators
-   Error messages with guidance

------------------------------------------------------------------------

# 15. Future Enhancements

-   Saved print presets
-   Favourite configurations
-   QR code collection
-   Campus wallet
-   Dark mode
-   AI print recommendations

------------------------------------------------------------------------

# 16. Acceptance Criteria

The Student Dashboard is complete when students can:

-   Place new print orders
-   Configure print options
-   Complete secure payments
-   Track orders in real time
-   Download invoices
-   Manage their profile
-   Receive timely notifications
-   Use the interface effectively on desktop and mobile
