# 14_UI_UX_Guidelines.md

# CampusPrint -- UI/UX Guidelines & Design System

## 1. Purpose

This document defines the visual language, interaction patterns,
accessibility standards, and reusable components for CampusPrint.

------------------------------------------------------------------------

# 2. Design Principles

-   Clean and modern
-   Minimal cognitive load
-   Consistent interactions
-   Mobile responsive
-   Accessible by default
-   Performance focused

------------------------------------------------------------------------

# 3. Brand Identity

Primary Colour: **#2563EB**

Secondary Colour: **#10B981**

Accent: **#F59E0B**

Danger: **#DC2626**

Background: **#F8FAFC**

Surface: **#FFFFFF**

Text Primary: **#111827**

Text Secondary: **#6B7280**

Border: **#E5E7EB**

------------------------------------------------------------------------

# 4. Typography

Font Family

-   Inter
-   Fallback: system-ui, sans-serif

Scale

  Element     Size
  --------- ------
  H1          40px
  H2          32px
  H3          24px
  H4          20px
  Body        16px
  Caption     14px
  Small       12px

------------------------------------------------------------------------

# 5. Spacing System

Use an 8px grid.

Spacing tokens:

-   4px
-   8px
-   16px
-   24px
-   32px
-   48px
-   64px

------------------------------------------------------------------------

# 6. Responsive Breakpoints

  Device                   Width
  --------------- --------------
  Mobile                 \<640px
  Tablet             640--1023px
  Desktop           1024--1439px
  Large Desktop          ≥1440px

------------------------------------------------------------------------

# 7. Layout

Student

-   Top navigation
-   Sidebar (desktop)
-   Bottom navigation (mobile)

Admin

-   Permanent collapsible sidebar
-   Sticky top bar
-   Content dashboard

------------------------------------------------------------------------

# 8. Components

Buttons

-   Primary
-   Secondary
-   Outline
-   Destructive
-   Icon-only

Inputs

-   Text
-   Password
-   Search
-   Select
-   File Upload
-   Date Picker

Cards

-   KPI Card
-   Order Card
-   Payment Card
-   Notification Card

------------------------------------------------------------------------

# 9. Tables

Features

-   Sorting
-   Filtering
-   Pagination
-   Sticky header
-   Row actions
-   Bulk selection

------------------------------------------------------------------------

# 10. Forms

Requirements

-   Inline validation
-   Required field indicators
-   Helpful error messages
-   Disabled/loading states
-   Keyboard accessible

------------------------------------------------------------------------

# 11. Feedback States

Loading

-   Skeletons
-   Progress bars
-   Upload progress

Success

-   Toast notification
-   Success banner

Errors

-   Inline errors
-   Retry action

Empty

-   Friendly illustrations
-   Clear call-to-action

------------------------------------------------------------------------

# 12. Icons

Recommended

-   Lucide Icons

Use consistent icon sizing and spacing.

------------------------------------------------------------------------

# 13. Motion

-   150--250ms transitions
-   Smooth hover states
-   Subtle page transitions
-   Avoid distracting animations

------------------------------------------------------------------------

# 14. Accessibility

-   WCAG AA contrast
-   Full keyboard navigation
-   Screen reader labels
-   Focus indicators
-   Accessible form controls
-   Semantic HTML

------------------------------------------------------------------------

# 15. Dashboard Guidelines

Student

-   Quick actions first
-   Order timeline
-   Payment summary

Admin

-   KPI cards
-   Queue overview
-   Recent activity
-   Alerts panel

------------------------------------------------------------------------

# 16. Dark Mode

Future support:

-   Theme tokens
-   Persist user preference
-   Automatic system theme detection

------------------------------------------------------------------------

# 17. Design Tokens

Border Radius

-   Small: 6px
-   Medium: 10px
-   Large: 16px

Shadows

-   Small
-   Medium
-   Large

------------------------------------------------------------------------

# 18. Acceptance Criteria

The UI is complete when:

-   Components are visually consistent.
-   Responsive layouts work across devices.
-   Accessibility requirements are met.
-   Navigation is intuitive.
-   Student and Admin interfaces share the same design language.
