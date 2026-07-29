# CONTRIBUTING.md

# CampusPrint Contribution Guide

Welcome to CampusPrint.

Every contribution must maintain production quality.

---

## Branch Strategy

main

Production

develop

Integration

feature/*

New Features

fix/*

Bug Fixes

hotfix/*

Emergency Fixes

---

## Commit Convention

feat:

fix:

docs:

refactor:

style:

test:

perf:

build:

ci:

Example

feat(auth): implement JWT login

---

## Pull Request Checklist

- Code compiles
- Tests pass
- Documentation updated
- No lint errors
- No secrets
- Security reviewed

---

## Coding Standards

Always

- Small functions
- Reusable code
- Meaningful naming
- Input validation
- Error handling
- Logging

Never

- Hardcoded secrets
- Duplicate code
- Debug statements

---

## Documentation

Every feature update must update relevant docs.

Database changes

Update

06_Database_Design.md

API changes

Update

07_API_Specification.md

UI changes

Update

14_UI_UX_Guidelines.md

15_Design_System.md

---

## Testing

Every PR must include

Unit Tests

Integration Tests

API Tests

Regression Testing

---

## Security

Follow

26_Security_Checklist.md

Never expose

Secrets

Passwords

JWT Keys

Database credentials

---

## Review Requirements

At least one review before merge.

Major architectural changes require approval.

---

## AI Contributors

AI-generated code is welcome.

However

The AI must

Read AGENTS.md

Read relevant documentation

Follow coding standards

Run tests

Update documentation

No AI-generated code may bypass review.

---

## Definition of Done

A contribution is accepted only when

✓ Code builds

✓ Tests pass

✓ Documentation updated

✓ Security maintained

✓ Performance acceptable

✓ No lint issues