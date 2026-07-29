# Phase 02 — UI Foundation & Design System

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement the complete UI foundation for CampusPrint.

This phase establishes the reusable design system, layout architecture, routing foundation, and shared UI components.

This is NOT the phase to implement business features.

The goal is to ensure every future page uses a consistent design language.

---

# Documentation

Read ONLY the following documents before implementation:

- docs/14_UI_UX_Guidelines.md
- docs/15_Design_System.md
- docs/16_Project_Structure.md
- docs/29_Coding_Standards.md

Do NOT reread previous implementation phases.

---

# Scope

Implement only the UI foundation.

Do NOT implement:

❌ Login page

❌ Registration page

❌ Student Dashboard

❌ Admin Dashboard

❌ Orders

❌ Upload

❌ Payments

❌ Reports

❌ Analytics

❌ Business APIs

❌ Authentication

❌ Database

---

# UI Goals

The application should have a modern, professional appearance.

Characteristics:

- Clean
- Minimal
- Professional
- Responsive
- Accessible
- Consistent
- Fast

The UI should resemble enterprise applications such as:

- Stripe Dashboard
- Linear
- Notion
- GitHub
- Vercel

Avoid unnecessary animations.

---

# Folder Structure

Create or verify the following structure:

frontend/src/

components/

ui/

layout/

navigation/

forms/

feedback/

data-display/

pages/

layouts/

hooks/

contexts/

services/

routes/

styles/

assets/

constants/

types/

utils/

---

# Routing Foundation

Configure routing.

Create route placeholders only.

Example:

/

/login

/register

/student

/admin

/profile

/orders

/settings

Each route should render a placeholder component.

Do NOT implement page functionality.

---

# Global Layout

Implement:

Application shell

Responsive layout

Page container

Content wrapper

Responsive spacing

Sticky header support

Sidebar container

Main content container

Footer container

---

# Theme

Implement:

Light Theme

Dark Theme (if defined in docs)

Theme provider

Theme switching infrastructure

Persist selected theme

Do not hardcode colours.

Use design tokens.

---

# Typography

Configure:

Font family

Heading hierarchy

Paragraph styles

Caption styles

Code styles

Line heights

Font weights

Letter spacing

Use a consistent scale.

---

# Colour System

Implement design tokens.

Primary

Secondary

Success

Warning

Danger

Info

Surface

Background

Border

Text

Muted

Disabled

Hover

Focus

Do not hardcode hex values inside components.

---

# Spacing System

Create a spacing scale.

Example

4

8

12

16

20

24

32

40

48

64

Use consistently.

---

# Border Radius

Define reusable radius tokens.

Small

Medium

Large

Extra Large

---

# Shadows

Define elevation tokens.

Small

Medium

Large

Overlay

---

# Icons

Configure icon library.

Create Icon wrapper component.

Icons must have consistent sizing.

---

# Components

Build reusable components.

Buttons

Variants:

Primary

Secondary

Ghost

Danger

Outline

Sizes:

Small

Medium

Large

Loading state

Disabled state

---

Input

Text

Password

Search

Email

Number

Textarea

Validation state

Disabled state

---

Select

Single Select

Multi Select (if required)

---

Checkbox

Reusable

Accessible

---

Radio

Reusable

Accessible

---

Switch

Reusable

Accessible

---

Card

Header

Content

Footer

Actions

---

Modal

Open

Close

Header

Body

Footer

Escape support

Overlay

---

Toast

Success

Warning

Info

Error

Queue support

---

Badge

Success

Warning

Error

Neutral

---

Table

Responsive

Empty state

Loading state

Pagination placeholder

---

Loader

Spinner

Skeleton

Progress indicator

---

Empty State

Illustration placeholder

Title

Description

Action button

---

Breadcrumb

Reusable

---

Pagination

UI only

---

Avatar

Image

Fallback initials

Sizes

---

Dropdown

Reusable

Keyboard accessible

---

Tooltip

Reusable

---

Navigation

Navbar

Sidebar

Mobile menu

Footer

---

# Accessibility

Follow WCAG basics.

Keyboard navigation

Visible focus states

ARIA labels where required

Semantic HTML

Contrast

Responsive text

---

# Responsiveness

Support:

Mobile

Tablet

Desktop

Large screens

Avoid fixed widths.

Use fluid layouts.

---

# Performance

Lazy load routes.

Code split where appropriate.

Avoid unnecessary renders.

---

# Coding Standards

Every component must:

- Be reusable
- Be typed (if TypeScript)
- Have clear props
- Avoid duplicated logic
- Avoid inline styles
- Avoid hardcoded colours

---

# Validation

Verify:

✓ npm run build

✓ npm run lint

✓ No console errors

✓ No TypeScript errors

✓ Responsive layout

✓ Theme switching works

---

# Deliverables

Provide:

1. Updated folder structure

2. Components created

3. Theme architecture

4. Routing architecture

5. Design token summary

6. Accessibility summary

7. Build status

8. Lint status

9. Remaining work

---

# Success Criteria

This phase is complete only if:

✓ UI foundation exists

✓ Components are reusable

✓ No business logic exists

✓ No API calls exist

✓ Build passes

✓ Lint passes

✓ Responsive design verified

✓ Theme infrastructure complete

---

# Final Instruction

Stop after Phase 02.

Do NOT begin backend development.

Wait for approval before Phase 03.