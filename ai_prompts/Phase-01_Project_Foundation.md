# Phase 01 — Project Foundation

Version: 1.0

Status: Ready

---

# Objective

Build the entire project foundation for CampusPrint.

This phase establishes the development environment, repository structure, coding standards, tooling, and infrastructure.

No business logic should be implemented.

---

# Prerequisites

Before starting:

- Read AGENTS.md
- Read TASKS.md
- Read IMPLEMENTATION_PLAN.md
- Read README.md
- Read:
  - docs/16_Project_Structure.md
  - docs/17_Development_Guide.md
  - docs/29_Coding_Standards.md
  - docs/19_Deployment_Guide.md

---

# Scope

Implement only the project foundation.

Do NOT implement:

- Authentication
- Database models
- APIs
- Uploads
- Orders
- Payments
- Dashboards
- Analytics
- Notifications

---

# Repository Structure

Create a scalable repository structure.

Example:

CampusPrint/
├── frontend/
├── backend/
├── docs/
├── infrastructure/
├── scripts/
├── .github/
├── docker/
├── AGENTS.md
├── TASKS.md
├── IMPLEMENTATION_PLAN.md
├── CONTRIBUTING.md
├── README.md

Backend should include:

- controllers
- services
- routes
- middlewares
- models
- config
- utils
- validators
- tests

Frontend should include:

- components
- pages
- layouts
- hooks
- services
- utils
- assets
- routes
- contexts

---

# Frontend

Create:

- React + Vite project
- Routing
- Layout system
- Global styles
- Theme setup
- Environment handling
- API client placeholder

No pages.

No business components.

---

# Backend

Create:

- Express server
- Health endpoint
- Versioned API routing
- Error middleware
- Logging middleware
- Config loader
- Environment validation

No feature routes.

---

# Development Tools

Configure:

- ESLint
- Prettier
- Husky
- lint-staged
- EditorConfig

Ensure formatting rules match Coding Standards.

---

# Docker

Create:

- Dockerfile (frontend)
- Dockerfile (backend)
- docker-compose.yml

Application should start successfully.

---

# GitHub

Create:

.github/

Include:

- CI workflow
- Lint workflow
- Build workflow

---

# Environment

Create:

frontend/.env.example

backend/.env.example

Document all required variables.

---

# Logging

Implement a reusable logger.

Support:

- Info
- Warn
- Error
- Debug

No business logging yet.

---

# Error Handling

Implement global error middleware.

Return consistent JSON responses.

---

# Health Check

Create:

GET /health

Response:

{
  "status":"ok",
  "version":"1.0.0"
}

---

# Coding Standards

Follow:

- Small functions
- Reusable code
- Clean imports
- Proper naming
- No duplicate logic

---

# Validation

Run:

npm install

npm run build

npm run lint

Docker build

Docker compose up

Everything should succeed.

---

# Deliverables

Provide:

1. Folder tree

2. Files created

3. Packages installed

4. Docker status

5. CI status

6. Build status

7. Lint status

8. Remaining work

---

# Success Criteria

✓ Project builds

✓ Docker works

✓ CI passes

✓ Folder structure complete

✓ No feature implementation

✓ Ready for Phase 02

---

# Final Instruction

Stop after completion.

Wait for approval.

Do not begin Phase 02.