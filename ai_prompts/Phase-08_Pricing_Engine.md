# Phase 08 — Pricing Engine

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement the complete Pricing Engine for CampusPrint.

This phase establishes a centralized pricing service that calculates the cost of print orders based on configurable business rules.

The pricing engine must be reusable, configurable, extensible, and independent of payments.

Do NOT implement shopping cart or payment processing.

---

# Documentation

Before implementation read ONLY:

- reports/Previous-Phase-Report.md
- docs/11_Pricing_and_Cost_Calculation.md
- docs/12_Security.md
- docs/16_Project_Structure.md
- docs/29_Coding_Standards.md

---

# Scope

Implement ONLY:

✓ Pricing Engine

✓ Pricing Rules

✓ Price Calculator

✓ Cost Breakdown

✓ Paper Pricing

✓ Colour Pricing

✓ Duplex Pricing

✓ Binding Pricing

✓ Additional Service Charges

✓ Discount Framework (if documented)

✓ Tax Framework (if documented)

✓ Pricing Configuration

✓ Price Validation

✓ Order Cost Estimation

---

# Out of Scope

Do NOT implement:

❌ Shopping Cart

❌ Checkout

❌ Payments

❌ Invoice Generation

❌ Wallet

❌ Refunds

❌ Analytics

❌ Notifications

---

# Pricing Principles

The pricing engine must:

- Be reusable
- Be configurable
- Be independent of UI
- Be independent of payment systems
- Support future pricing changes

---

# Pricing Inputs

Support pricing based on documented options.

Typical examples:

- Paper Size
- Paper Type
- Print Colour
- Single / Double Side
- Number of Pages
- Number of Copies
- Binding Type
- Lamination
- Additional Services

Do not invent pricing rules.

---

# Pricing Outputs

Generate:

- Base Price
- Individual Charges
- Discounts (if applicable)
- Taxes (if applicable)
- Total Amount
- Detailed Cost Breakdown

---

# Configuration

Pricing values should NOT be hardcoded.

Use:

- Database configuration
- Configuration files
- Environment variables

Follow the documentation.

---

# APIs

Implement only documented APIs.

Typical examples:

POST /pricing/calculate

GET /pricing/config

PUT /pricing/config (Admin)

---

# Validation

Validate:

- Page count
- Copy count
- Print options
- Supported paper sizes
- Supported paper types
- Supported binding options

Return consistent validation errors.

---

# Security

Implement:

Admin-only pricing configuration

Input validation

Ownership validation where required

Prevent:

Invalid pricing requests

Negative values

Pricing manipulation

Unauthorized configuration updates

---

# Database

Reuse existing schema.

Extend only if pricing configuration requires new models.

Generate migrations only when necessary.

---

# Services

Create reusable services for:

Pricing Calculation

Pricing Rules

Configuration

Discounts

Taxes

Cost Breakdown

Future estimation support

---

# Middleware

Reuse existing middleware.

Add pricing validation middleware only if required.

---

# Error Handling

Handle:

Invalid pricing requests

Unsupported options

Missing configuration

Calculation failures

Database failures

Return standard API responses.

---

# Logging

Log:

Price calculations

Pricing configuration updates

Pricing rule changes

Do not log sensitive information.

---

# Coding Standards

Every implementation must:

- Follow SOLID principles
- Use TypeScript
- Be reusable
- Be modular
- Be production ready

---

# Validation Checklist

Verify:

✓ Pricing calculation works

✓ Cost breakdown generated

✓ Configuration works

✓ Validation works

✓ Admin configuration protected

✓ Build passes

✓ Lint passes

---

# Deliverables

Provide:

1. Pricing Architecture

2. Pricing Flow

3. APIs Created

4. Services Created

5. Configuration Strategy

6. Validation Strategy

7. Security Summary

8. Build Status

9. Lint Status

10. Remaining Work

---

# Success Criteria

This phase is complete only if:

✓ Pricing engine implemented

✓ Cost calculation works

✓ Configuration reusable

✓ Build passes

✓ Lint passes

✓ No payment implementation exists

✓ No shopping cart exists

---

# Final Instruction

When implementation is complete:

1. Run:

- npm run build
- npm run lint
- tests (if applicable)

2. Read:

ai-prompts/shared/PHASE_COMPLETION_REPORT.md

3. Generate:

reports/Phase-08-Report.md

4. Commit:

git add .

git commit -m "Phase 08: Pricing engine"

5. If a Git remote is configured:

git push origin main

Stop.

Wait for user approval before Phase 09.
