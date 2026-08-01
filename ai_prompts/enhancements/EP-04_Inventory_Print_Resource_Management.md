# Enhancement Proposal: Inventory & Print Resource Management

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement a complete Inventory & Print Resource Management module for CampusPrint.

The system should allow administrators to monitor, manage, and automatically update the inventory of consumables used in printing operations.

Inventory should be deducted automatically when print jobs are completed and administrators should receive alerts when stock levels become low.

The implementation should be modular and extensible for future support of multiple print shops and warehouses.

---

# Scope

Implement ONLY:

✓ Inventory Management

✓ Inventory Categories

✓ Inventory Transactions

✓ Automatic Stock Deduction

✓ Manual Stock Adjustment

✓ Purchase Entries

✓ Low Stock Alerts

✓ Inventory Dashboard

✓ Inventory Reports

✓ Supplier Management (Basic)

✓ Audit Logging

---

# Inventory Categories

Support inventory items such as:

Paper

- A4
- A3
- Legal
- Letter

Ink

- Black
- Cyan
- Magenta
- Yellow

Toner

Binding Materials

Lamination Sheets

Photo Paper

Spiral Rings

Files

Folders

Other Consumables

---

# Inventory Item

Each inventory item should include:

Item Name

Category

Unit

Current Quantity

Minimum Quantity

Maximum Quantity

Purchase Price

Selling Cost (optional)

Supplier

Status

Location

Created Date

Updated Date

---

# Stock Transactions

Maintain transaction history.

Examples:

Stock Added

Stock Removed

Automatic Deduction

Manual Adjustment

Correction

Damaged Items

Each transaction should include:

Transaction ID

Inventory Item

Quantity

Previous Stock

New Stock

Reason

Performed By

Timestamp

---

# Automatic Stock Deduction

When an order reaches:

COMPLETED

Automatically deduct inventory.

Example:

20 pages

↓

10 A4 Sheets

↓

Inventory

500

↓

490

Support:

Single Side

Double Side

Color

Black & White

Binding

Lamination

Use configurable deduction rules.

---

# Low Stock Alerts

Generate alerts when:

Current Stock

<=

Minimum Stock

Display alerts in:

Admin Dashboard

Inventory Page

Future notification integration.

---

# Purchase Management

Allow administrators to:

Add Stock

Update Stock

Adjust Stock

Record Purchases

View Purchase History

Track Supplier

---

# Supplier

Basic supplier information:

Name

Contact

Phone

Email

Address

Status

Future versions may support purchase orders.

---

# Inventory Dashboard

Display:

Current Stock

Low Stock

Out of Stock

Recent Transactions

Monthly Consumption

Inventory Value

Top Consumed Items

Charts

Statistics

---

# APIs

Implement endpoints similar to:

GET /inventory

POST /inventory

PUT /inventory/:id

DELETE /inventory/:id

POST /inventory/adjust

POST /inventory/purchase

GET /inventory/history

GET /inventory/dashboard

GET /suppliers

POST /suppliers

---

# Security

Implement:

Role-based permissions

Inventory validation

Stock validation

Audit logging

Prevent:

Negative inventory

Unauthorized changes

Duplicate adjustments

---

# UI

Administrator should have:

Inventory Dashboard

Inventory Table

Stock Adjustment Dialog

Purchase Entry

Supplier Management

Low Stock Alerts

Transaction History

Search

Filters

Pagination

---

# Reports

Generate:

Current Inventory

Consumption Report

Purchase Report

Low Stock Report

Inventory Value Report

Export support (future-ready)

---

# Database

Create or extend models for:

InventoryItem

InventoryCategory

InventoryTransaction

Supplier

StockAdjustment

Maintain proper relationships.

---

# Validation

Verify:

Stock updates

Automatic deduction

Manual adjustment

Low stock detection

Supplier management

Inventory reports

Build passes

Lint passes

---

# Deliverables

Implement:

1. Inventory Module
2. Database Models
3. APIs
4. Dashboard
5. Automatic Stock Deduction
6. Supplier Management
7. Reports
8. Audit Logs
9. Tests
10. Documentation

---

# Constraints

- Preserve existing Print Request workflow.
- Do not break current modules.
- Follow SOLID principles.
- Follow Clean Architecture.
- Maintain backward compatibility.

---

# Final Validation

Verify:

✓ Inventory updates automatically

✓ Low stock alerts work

✓ Reports generated

✓ Dashboard operational

✓ Tests pass

✓ Build passes

✓ Lint passes

Generate an implementation report upon completion.