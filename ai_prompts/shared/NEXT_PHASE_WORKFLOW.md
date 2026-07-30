# Standard Next Phase Workflow

Version: 1.0

Status: Reusable Workflow

---

# Purpose

This document defines the standard workflow that must be followed after a phase has been approved.

It is reusable for every implementation phase of the CampusPrint project.

This workflow ensures:

- Continuity between phases
- Consistent implementation
- Professional documentation
- Quality assurance
- Build verification
- Clean Git history

This workflow must be followed before EVERY new phase.

---

# Step 1 — Read Previous Phase Report

Read the report of the previously approved phase.

The report file will be provided by the user.

Carefully review:

- Phase Overview
- Executive Summary
- Features Implemented
- Architecture Changes
- File Changes
- Configuration Changes
- Database Changes
- API Changes
- UI Changes
- Testing Results
- Security Considerations
- Performance Improvements
- Known Issues
- Remaining Work
- Risks
- Lessons Learned
- Handover Notes

Do not skip this step.

The previous phase report is the primary source of implementation context.

---

# Step 2 — Verify Existing Implementation

Before writing any code:

Verify that the implementation matches the report.

Review:

- Folder structure
- Components
- APIs
- Database
- Configuration
- Dependencies

If inconsistencies are found:

- Document them.
- Do not silently modify previous work.

---

# Step 3 — Read Current Phase Prompt

Read the phase prompt provided by the user.

Treat it as the implementation specification.

Implement ONLY the scope defined in that document.

Do not implement future phases.

---

# Step 4 — Review Existing Code

Before creating new files:

Search the project for existing:

- Components
- Services
- Utilities
- Middleware
- Hooks
- Helpers
- Types

Reuse existing implementations whenever possible.

Avoid duplication.

Do not create alternative implementations if a reusable solution already exists.

---

# Step 5 — Implementation Rules

Implement ONLY the current phase.

Never implement future phases.

Never partially implement future modules.

Keep the implementation:

- Modular
- Reusable
- Maintainable
- Production-ready

Follow:

- SOLID
- DRY
- KISS
- Clean Architecture

---

# Step 6 — Code Quality

Every new file must:

- Follow project conventions
- Use TypeScript
- Be strongly typed
- Handle errors correctly
- Use async/await where appropriate
- Avoid duplicated logic
- Include meaningful comments where required

Never hardcode:

- Secrets
- Credentials
- URLs
- IDs
- Configuration values
- Magic numbers

---

# Step 7 — Validation

When implementation is complete:

Run:

- Build
- Lint
- Tests (if available)

Resolve all errors before continuing.

Warnings should be explained in the report.

---

# Step 8 — Generate Phase Report

Read:

ai-prompts/shared/PHASE_COMPLETION_REPORT.md

Generate a report for the completed phase.

The report filename will be provided by the user.

Save the report in the `reports/` directory.

The report must accurately reflect the implementation.

Do not invent completed work.

---

# Step 9 — Git

After the report has been generated:

Stage all changes.

Create a meaningful commit using the phase name.

If a Git remote is configured:

Push the commit.

Never force push unless explicitly instructed.

---

# Step 10 — Completion

After:

- Build succeeds
- Lint succeeds
- Tests succeed
- Report is generated
- Commit is created
- Push completes (if applicable)

Stop.

Wait for user approval.

Never begin another phase automatically.

---

# General Rules

Always:

✓ Read the previous phase report

✓ Read the current phase prompt

✓ Review existing implementation

✓ Reuse existing code

✓ Follow project architecture

✓ Generate a report

✓ Wait for approval

Never:

✗ Skip reports

✗ Modify unrelated modules

✗ Implement future phases

✗ Ignore build failures

✗ Ignore lint failures

✗ Continue automatically

---

# Definition of Done

A phase is complete only when:

✓ All scoped features are implemented

✓ Build passes

✓ Lint passes

✓ Tests pass (if applicable)

✓ Report generated

✓ Commit created

✓ Push completed (if applicable)

✓ Waiting for user approval

Stop here.

Do not continue until explicit approval is received.