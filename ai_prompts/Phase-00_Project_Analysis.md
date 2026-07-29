# Phase 00 — Project Analysis & Architecture Review

Version: 1.0

Status: Ready for Implementation

---

# Purpose

This is the first phase of the CampusPrint implementation.

The purpose of this phase is NOT to write code.

The purpose is to fully understand the project before implementation begins.

You are expected to act as a Senior Software Architect and Technical Lead.

Do not rush into implementation.

A correct understanding of the project is more important than writing code quickly.

---

# Your Role

You are responsible for implementing CampusPrint.

Before implementing anything, you must understand:

- Business Requirements
- Functional Requirements
- Non-Functional Requirements
- Architecture
- Technology Stack
- Folder Structure
- API Design
- Database Design
- Coding Standards
- UI Standards
- Security Requirements
- Testing Strategy

Do NOT assume anything.

Whenever documentation exists,
documentation is always the source of truth.

---

# Documents to Read

Read these files completely.

## Root Documents

README.md

AGENTS.md

TASKS.md

IMPLEMENTATION_PLAN.md

CONTRIBUTING.md

---

## Documentation Folder

Read every document inside

/docs

including but not limited to

01_Project_Vision.md

02_Business_Requirements.md

03_Functional_Requirements.md

04_Non_Functional_Requirements.md

05_System_Architecture.md

06_Database_Design.md

07_API_Specification.md

08_Authentication.md

09_Payment_System.md

10_File_Management.md

11_Order_Workflow.md

12_Admin_Dashboard.md

13_Student_Dashboard.md

14_UI_UX_Guidelines.md

15_Design_System.md

16_Project_Structure.md

17_Development_Guide.md

18_Testing_Strategy.md

19_Deployment_Guide.md

...

until

45_Project_Handover_Guide.md

Read every document before making conclusions.

---

# Implementation Rules

Do NOT

❌ Write any code

❌ Generate any API

❌ Generate UI

❌ Generate database

❌ Generate folders

❌ Generate configuration

This phase is ONLY analysis.

---

# What You Must Understand

The following should be understood in detail.

---

## Business

Understand

- Who will use the application
- Why the application exists
- Business workflow
- Pain points
- Goals
- Future scalability

---

## Users

Identify

Student

Admin

Super Admin (if applicable)

Guest (if applicable)

Understand responsibilities of every user.

---

## Functional Modules

Identify every module.

For example

Authentication

Dashboard

Orders

Payments

Notifications

Pricing

Uploads

Reports

Analytics

Administration

Settings

Security

Logging

Monitoring

etc.

Do not miss any module.

---

## Technology

Understand

Frontend

Backend

Database

Authentication

Payment

Deployment

CI/CD

Monitoring

Logging

Caching

Storage

---

## Architecture

Understand

System Architecture

Folder Structure

Layered Architecture

Request Flow

Authentication Flow

Database Flow

Error Handling

Dependency Flow

---

## Database

Identify

Collections

Relationships

Indexes

Constraints

Validation Rules

Future Scalability

---

## API

Understand

REST Standards

Routes

Naming Convention

Versioning

Status Codes

Validation

Response Format

Error Format

---

## UI

Understand

Layout

Navigation

Typography

Colour System

Spacing

Cards

Forms

Tables

Responsiveness

Accessibility

---

## Security

Understand

JWT

RBAC

Validation

Password Security

Rate Limiting

Input Sanitisation

Threat Model

OWASP

---

## Testing

Understand

Unit Tests

Integration Tests

Playwright

Accessibility Tests

Performance Tests

---

# Dependency Analysis

Produce a dependency graph.

Example

Repository

↓

Configuration

↓

Database

↓

Authentication

↓

Uploads

↓

Pricing

↓

Orders

↓

Payments

↓

Notifications

↓

Student Dashboard

↓

Admin Dashboard

↓

Analytics

↓

Deployment

This graph should reflect the actual documentation.

---

# Identify Risks

Find

Potential architectural problems

Conflicting requirements

Missing documentation

Security concerns

Scalability issues

Circular dependencies

Anything unclear

Do NOT fix them.

Only report them.

---

# Coding Standards Review

Read

Coding Standards

Development Guide

Contributing Guide

Summarise

Naming

Folder Structure

Formatting

Imports

Error Handling

Testing

Git Practices

---

# Expected Deliverables

Produce the following report.

---

## 1. Executive Summary

Describe CampusPrint in approximately 300 words.

---

## 2. Technology Stack

Explain why each technology has been chosen.

---

## 3. Module Breakdown

List every module.

Describe its responsibility.

---

## 4. Architecture Summary

Explain architecture in detail.

---

## 5. Database Summary

Collections

Relationships

Indexes

Validation

---

## 6. API Summary

Describe

API Style

Authentication

Validation

Error Responses

Versioning

---

## 7. UI Summary

Describe

Design Language

Navigation

Components

Responsiveness

Accessibility

---

## 8. Security Summary

Explain

Authentication

Authorisation

Validation

Threat Protection

---

## 9. Dependency Graph

Provide implementation order.

---

## 10. Risks

List every identified risk.

---

## 11. Questions

If documentation is unclear,

list questions before implementation.

---

## 12. Recommendations

Suggest improvements before coding.

---

# Success Criteria

This phase is successful only if

✓ Every document has been reviewed

✓ Every module has been identified

✓ Architecture is fully understood

✓ Dependencies are understood

✓ Risks are identified

✓ No code has been written

---

# Final Instruction

Do not proceed to Phase 01.

Wait for explicit approval.

Do not assume undocumented behaviour.

Documentation is the single source of truth.