# AGENTS.md

# CampusPrint — AI Coding Agent Guide

> **Purpose**
>
> This file is the master operating manual for any AI coding agent (Antigravity, Claude Code, Cursor, Windsurf, Amp, etc.) working on the CampusPrint repository.
>
> This document defines **how the agent must think, plan, implement, test, and modify the project**.
>
> The documentation inside `/docs` is the **single source of truth**.
>
> Never invent functionality that contradicts the documentation.

---

# 1. Project Overview

Project Name:

CampusPrint

Description:

A production-grade Campus Printing Management System that enables students to upload documents, configure print settings, pay online, and track print orders while providing administrators with a complete print management dashboard.

---

# 2. Technology Stack

Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

Backend

- Node.js
- Express.js

Database

- MongoDB

Authentication

- JWT
- bcrypt

Payments

- Razorpay

Uploads

- Multer

Documentation

/docs

---

# 3. Project Philosophy

The project must always follow these principles:

- Clean Architecture
- Modular Design
- SOLID Principles
- Production-ready code
- Reusable components
- Type-safe design where possible
- Security first
- Performance first
- Accessibility aware

Never produce quick hacks.

Never produce demo-quality code.

Always write maintainable production code.

---

# 4. Source of Truth

The documentation folder is authoritative.

```
docs/
```

Every implementation MUST follow those documents.

If documentation and code conflict,

Documentation wins.

---

# 5. Documentation Reference Map

## Vision

Read

```
01_Project_Vision.md
```

---

## Business Rules

Read

```
02_Business_Requirements.md
```

---

## Functional Requirements

Read

```
03_Functional_Requirements.md
```

---

## Architecture

Read

```
05_System_Architecture.md
```

---

## Database

Read

```
06_Database_Design.md
23_Database_ERD.md
```

---

## APIs

Read

```
07_API_Specification.md
22_OpenAPI_Spec.yaml
37_API_Versioning_Strategy.md
```

---

## Authentication

Read

```
08_Authentication.md
26_Security_Checklist.md
39_Threat_Model.md
```

---

## Payments

Read

```
09_Payment_System.md
```

---

## Uploads

Read

```
10_File_Management.md
```

---

## Orders

Read

```
11_Order_Workflow.md
```

---

## Student Dashboard

Read

```
13_Student_Dashboard.md
```

---

## Admin Dashboard

Read

```
12_Admin_Dashboard.md
```

---

## UI

Read

```
14_UI_UX_Guidelines.md
15_Design_System.md
25_Component_Library.md
42_Accessibility_Guide.md
```

---

## Development

Read

```
17_Development_Guide.md
29_Coding_Standards.md
```

---

## Testing

Read

```
18_Testing_Strategy.md
```

---

## Deployment

Read

```
19_Deployment_Guide.md
31_Monitoring_and_Observability.md
34_Release_Management.md
35_DevOps_Runbook.md
36_Infrastructure_as_Code.md
44_Maintenance_Guide.md
45_Project_Handover_Guide.md
```

---

## Security

Read

```
26_Security_Checklist.md
38_Data_Retention_Privacy.md
39_Threat_Model.md
40_Risk_Management.md
```

---

# 6. Coding Standards

Always

✔ Small reusable functions

✔ Meaningful names

✔ No duplicated logic

✔ Input validation

✔ Error handling

✔ Logging

✔ Comments only when necessary

✔ Environment variables

✔ Consistent formatting

Never

✘ Hardcode secrets

✘ Hardcode URLs

✘ Hardcode API keys

✘ Ignore exceptions

✘ Leave TODOs in production

✘ Commit debug code

---

# 7. UI Rules

Always

- Responsive
- Accessible
- Mobile-first
- Consistent spacing
- Design System compliant

Never

- Inline styles unless necessary
- Random colours
- Random fonts
- Inconsistent spacing

---

# 8. Backend Rules

Every endpoint must include

- Validation
- Error handling
- Authentication
- Authorisation (where required)
- Logging

---

# 9. Database Rules

Never

- Query without indexes when avoidable
- Duplicate data unnecessarily
- Remove fields without migration

Always

- Validate schema changes
- Keep migrations documented
- Preserve compatibility

---

# 10. Security Rules

Always

- Hash passwords
- Validate JWT
- Validate file uploads
- Sanitize inputs
- Escape outputs where appropriate
- Protect admin routes

Never expose

- Secrets
- Tokens
- Internal errors
- Stack traces

---

# 11. Testing Rules

Every feature must include

- Unit tests
- Integration tests
- API tests
- Error-path testing

No feature is complete without testing.

---

# 12. Before Coding

The AI MUST

1. Read relevant documentation.

2. Explain the implementation plan.

3. Identify dependencies.

4. Identify affected modules.

5. Wait for approval if the task changes architecture.

---

# 13. During Coding

Implement only one logical feature at a time.

Keep commits small.

Do not refactor unrelated modules.

Do not introduce breaking changes.

---

# 14. After Coding

Verify

- Build succeeds
- Tests pass
- Lint passes
- No TypeScript errors (if applicable)
- Documentation updated
- No warnings
- No console errors

---

# 15. Definition of Done

A task is complete only when

✓ Code compiles

✓ Tests pass

✓ Security maintained

✓ Documentation updated

✓ UI verified

✓ APIs verified

✓ Database verified

✓ Code reviewed

---

# 16. AI Behaviour Rules

If documentation is unclear

STOP

Explain the ambiguity.

Do not guess.

If architecture changes

STOP

Request approval.

If database changes

Update

```
06_Database_Design.md
```

If API changes

Update

```
07_API_Specification.md

22_OpenAPI_Spec.yaml
```

If UI changes

Update

```
14_UI_UX_Guidelines.md

15_Design_System.md
```

---

# 17. Final Rule

The `/docs` directory is the contract.

The implementation must always conform to the documentation.

Never prioritise speed over correctness.

When in doubt:

Read the documentation again before writing code.