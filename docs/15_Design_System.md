# 15_Design_System.md

# CampusPrint -- Design System

## 1. Purpose

This document defines the reusable visual and interaction system used
across CampusPrint to ensure consistency, scalability, and
maintainability.

------------------------------------------------------------------------

# 2. Design Tokens

## Colours

  Token            Value
  ---------------- ---------
  Primary          #2563EB
  Secondary        #10B981
  Accent           #F59E0B
  Success          #16A34A
  Warning          #D97706
  Danger           #DC2626
  Background       #F8FAFC
  Surface          #FFFFFF
  Border           #E5E7EB
  Text Primary     #111827
  Text Secondary   #6B7280

------------------------------------------------------------------------

## Typography

Font: Inter

Weights

-   400 Regular
-   500 Medium
-   600 Semibold
-   700 Bold

Line Heights

-   Heading: 120%
-   Body: 150%
-   Caption: 140%

------------------------------------------------------------------------

## Spacing Tokens

-   xs = 4px
-   sm = 8px
-   md = 16px
-   lg = 24px
-   xl = 32px
-   2xl = 48px
-   3xl = 64px

------------------------------------------------------------------------

## Radius

-   sm = 6px
-   md = 10px
-   lg = 16px
-   xl = 24px
-   full = 9999px

------------------------------------------------------------------------

## Elevation

-   Level 1 -- Cards
-   Level 2 -- Dropdowns
-   Level 3 -- Modals

------------------------------------------------------------------------

# 3. Grid System

-   12-column desktop grid
-   8-column tablet grid
-   4-column mobile grid
-   Maximum content width: 1440px

------------------------------------------------------------------------

# 4. Component Library

Buttons

-   Primary
-   Secondary
-   Outline
-   Ghost
-   Danger
-   Icon

States

-   Default
-   Hover
-   Focus
-   Active
-   Disabled
-   Loading

Inputs

-   Text
-   Password
-   Email
-   Number
-   Search
-   Select
-   File Upload
-   Text Area

Cards

-   KPI
-   Order
-   Payment
-   Notification
-   Statistics

------------------------------------------------------------------------

# 5. Data Display

Tables

-   Sticky header
-   Pagination
-   Sorting
-   Filtering
-   Bulk selection

Badges

-   Success
-   Warning
-   Error
-   Info
-   Neutral

------------------------------------------------------------------------

# 6. Navigation

Student

-   Top Navigation
-   Sidebar (desktop)
-   Bottom Navigation (mobile)

Admin

-   Collapsible Sidebar
-   Breadcrumbs
-   Sticky Header

------------------------------------------------------------------------

# 7. Overlay Components

-   Modal
-   Drawer
-   Confirmation Dialog
-   Dropdown Menu
-   Context Menu
-   Tooltip

------------------------------------------------------------------------

# 8. Feedback Components

-   Toast
-   Alert Banner
-   Skeleton Loader
-   Progress Indicator
-   Empty State
-   Error State

------------------------------------------------------------------------

# 9. Dashboard Widgets

-   KPI Cards
-   Revenue Chart
-   Order Status Chart
-   Queue Summary
-   Recent Orders
-   Notifications Panel

------------------------------------------------------------------------

# 10. Charts

Recommended library:

-   Recharts

Guidelines

-   Accessible colours
-   Legends
-   Tooltips
-   Responsive resizing

------------------------------------------------------------------------

# 11. Naming Conventions

Components

``` text
Button.tsx
OrderCard.tsx
PricingTable.tsx
NotificationPanel.tsx
```

CSS/Tailwind

-   Semantic utility composition
-   Avoid duplicated styles

------------------------------------------------------------------------

# 12. Tailwind Token Mapping

Example

``` text
Primary → bg-blue-600
Surface → bg-white
Border → border-gray-200
Text → text-gray-900
```

------------------------------------------------------------------------

# 13. Accessibility

-   WCAG AA
-   Visible focus
-   Semantic HTML
-   Keyboard support
-   Screen reader compatibility

------------------------------------------------------------------------

# 14. Future Evolution

-   Theme editor
-   Dark mode
-   White-label branding
-   Design token export
-   Figma sync

------------------------------------------------------------------------

# 15. Acceptance Criteria

The design system is complete when:

-   Every screen uses shared tokens.
-   Components are reusable.
-   Variants are documented.
-   Accessibility standards are met.
-   New pages can be built without introducing inconsistent UI patterns.
