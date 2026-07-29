# 25_Component_Library.md

# CampusPrint -- Component Library

## 1. Purpose

This document defines the reusable UI components used throughout
CampusPrint to ensure consistency, accessibility, maintainability, and
efficient development.

------------------------------------------------------------------------

# 2. Design Principles

-   Reusable
-   Accessible (WCAG 2.1 AA)
-   Responsive
-   Theme-aware
-   Consistent spacing and typography
-   Keyboard friendly

------------------------------------------------------------------------

# 3. Button

Variants

-   Primary
-   Secondary
-   Outline
-   Ghost
-   Destructive

States

-   Default
-   Hover
-   Focus
-   Disabled
-   Loading

Props

-   variant
-   size
-   icon
-   disabled
-   loading
-   onClick

------------------------------------------------------------------------

# 4. Text Input

Features

-   Label
-   Placeholder
-   Helper text
-   Validation message
-   Prefix/Suffix icons

States

-   Empty
-   Focused
-   Error
-   Disabled

------------------------------------------------------------------------

# 5. Select & Dropdown

Supports

-   Single select
-   Multi-select
-   Search
-   Async loading
-   Keyboard navigation

------------------------------------------------------------------------

# 6. Card

Used for

-   KPI metrics
-   Order summaries
-   Profile information
-   Dashboard widgets

Sections

-   Header
-   Content
-   Footer

------------------------------------------------------------------------

# 7. Data Table

Features

-   Sorting
-   Filtering
-   Pagination
-   Row selection
-   Bulk actions
-   Responsive layout

------------------------------------------------------------------------

# 8. Modal

Use Cases

-   Confirm actions
-   Delete confirmation
-   Edit forms
-   Image/file preview

Accessibility

-   Focus trap
-   Escape key support
-   ARIA labels

------------------------------------------------------------------------

# 9. Toast Notifications

Types

-   Success
-   Info
-   Warning
-   Error

Position

-   Top-right (desktop)
-   Bottom (mobile)

------------------------------------------------------------------------

# 10. Alert

Variants

-   Success
-   Warning
-   Error
-   Information

------------------------------------------------------------------------

# 11. Navigation

Components

-   Top navigation bar
-   Sidebar
-   Breadcrumbs
-   Pagination
-   Tabs

------------------------------------------------------------------------

# 12. File Upload

Features

-   Drag and drop
-   Browse button
-   Upload progress
-   File validation
-   Preview
-   Remove file

Supported formats

-   PDF
-   DOCX
-   PPTX
-   Images (future)

------------------------------------------------------------------------

# 13. Order Status Timeline

Stages

-   Draft
-   Payment Pending
-   Paid
-   Queued
-   Printing
-   Quality Check
-   Ready
-   Collected

------------------------------------------------------------------------

# 14. Pricing Summary

Displays

-   Pages
-   Copies
-   Print type
-   Additional services
-   Taxes
-   Grand total

------------------------------------------------------------------------

# 15. Dashboard KPI Card

Elements

-   Title
-   Metric
-   Trend
-   Icon
-   Optional chart

------------------------------------------------------------------------

# 16. Charts

Supported

-   Line
-   Bar
-   Doughnut
-   Area

Features

-   Tooltips
-   Legends
-   Export

------------------------------------------------------------------------

# 17. Loading Components

-   Spinner
-   Skeleton cards
-   Skeleton tables
-   Progress bars

------------------------------------------------------------------------

# 18. Empty States

Include

-   Illustration
-   Message
-   Suggested action

Examples

-   No orders
-   No notifications
-   No reports

------------------------------------------------------------------------

# 19. Accessibility Requirements

-   Keyboard operable
-   Visible focus indicators
-   Screen-reader labels
-   Sufficient colour contrast
-   Semantic HTML

------------------------------------------------------------------------

# 20. Naming Conventions

Examples

-   Button.tsx
-   DataTable.tsx
-   OrderTimeline.tsx
-   PricingCard.tsx
-   FileUploader.tsx

------------------------------------------------------------------------

# 21. Acceptance Criteria

The component library is complete when every shared UI element has a
defined purpose, API, supported states, accessibility expectations, and
reuse guidelines.
