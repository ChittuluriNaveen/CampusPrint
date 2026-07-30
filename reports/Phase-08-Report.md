# Phase 08 Implementation Report — Pricing Engine

## 1. Phase Information

- **Phase Number:** 08
- **Phase Name:** Pricing Engine
- **Completion Date:** July 30, 2026
- **Status:** Complete & Pending Approval

---

## 2. Objective

Implement the complete Pricing Engine for CampusPrint. This phase establishes a centralized pricing service that calculates print order costs based on configurable paper sizes, print modes, duplex modes, page counts, copy counts, binding, lamination, cover pages, and GST tax rules.

---

## 3. Executive Summary

Phase 08 delivered a clean, modular, and extensible Pricing Engine. The engine calculates detailed cost breakdowns including base print charges, duplex sheet adjustments, binding fees, lamination fees, cover page surcharges, subtotal, GST tax (18%), and total amount in INR. Pricing values are database-driven with sensible fallback matrices. Public and authenticated endpoints allow students and frontend interfaces to estimate costs prior to ordering (`POST /api/v1/pricing/calculate`), inspect active pricing configurations (`GET /api/v1/pricing/config`), and enable administrators to update pricing rules dynamically (`PUT /api/v1/pricing/config`). Integration with `order.service.ts` ensures that all created and updated print orders automatically leverage the pricing engine to populate file unit costs, order subtotal, tax, and total. No shopping cart or payment processing logic was introduced, remaining strictly in scope.

---

## 4. Scope Covered

- **Pricing Engine Service (`backend/src/services/pricing.service.ts`)**: Modular cost calculation functions for single print items and multi-item orders with GST calculation.
- **Dynamic Configuration**: DB-backed pricing configurations with fallback matrix (`A4`, `A3`, `LETTER`, `LEGAL`, `BW`, `COLOUR`, `SINGLE`, `DOUBLE`).
- **Cost Estimation Endpoint (`POST /api/v1/pricing/calculate`)**: Calculates item and order cost breakdowns.
- **Config Retrieval Endpoint (`GET /api/v1/pricing/config`)**: Returns active matrix pricing rules.
- **Admin Config Management Endpoint (`PUT /api/v1/pricing/config`)**: Protected endpoint for `ADMIN` / `SUPER_ADMIN` roles to modify rates.
- **Order Service Integration (`backend/src/services/order.service.ts`)**: Automatic price calculation during order creation and updates.
- **Zod Validation Schemas (`backend/src/validators/pricing.validator.ts`)**: Validation for pricing calculation inputs and configuration updates.
- **Automated Unit Tests (`backend/src/__tests__/pricing.test.ts`)**: Comprehensive suite testing calculations, binding, duplex sheet conversion, and validation schemas.

---

## 5. Features Implemented

1. **Pricing Validation Schemas (`backend/src/validators/pricing.validator.ts`)**:
   - `pricingItemSchema`: Validates `pages`, `copies`, `paperSize`, `colourMode`, `duplexMode`, `binding`, `lamination`, `coverPage`.
   - `calculatePricingSchema`: Supports both array (`items`) and flat single-item payloads.
   - `updatePricingConfigSchema`: Validates admin matrix rate updates.

2. **Pricing Engine Service (`backend/src/services/pricing.service.ts`)**:
   - `calculateItemPricing`: Calculates unit print cost, sheet counts for double-sided prints, binding fees, lamination fees, and cover page charges.
   - `calculateOrderPricing`: Aggregates item subtotals, computes GST (18.0%), and returns formatted item breakdowns, subtotal, tax, total, and currency.
   - `getPricingConfigurations`: Retrieves active pricing matrix from database.
   - `updatePricingConfiguration`: Upserts matrix entries in database and logs audit activity.

3. **Pricing Controllers & Routes (`backend/src/controllers/pricing.controller.ts` & `backend/src/routes/pricing.routes.ts`)**:
   - Mounted REST endpoints at `/api/v1/pricing`.

---

## 6. Architecture Changes

- **Modules Established:** Pricing Service, Pricing Controller, Pricing Routes, Pricing Validator, Pricing Test Suite.
- **Routes Mounted:** Mounted `/pricing` in `backend/src/routes/index.ts`.
- **Order Integration:** Refactored `order.service.ts` to call `calculateOrderPricing` for calculating order file prices and totals.

---

## 7. File Changes

### New Files
- `backend/src/validators/pricing.validator.ts`
- `backend/src/services/pricing.service.ts`
- `backend/src/controllers/pricing.controller.ts`
- `backend/src/routes/pricing.routes.ts`
- `backend/src/__tests__/pricing.test.ts`
- `reports/Phase-08-Report.md`

### Modified Files
- `backend/src/services/order.service.ts`: Integrated pricing engine for price calculation on order creation and updates.
- `backend/src/routes/index.ts`: Mounted `/pricing` router.
- `backend/src/lib/prisma.ts`: Updated module import paths for CJS/ts-node compatibility.
- `backend/src/utils/logger.ts`: Updated module import paths.
- `backend/src/server.ts`: Updated module import paths.
- `backend/src/app.ts`: Updated module import paths.
- `backend/src/middleware/error.middleware.ts`: Updated module import paths.
- `backend/src/middleware/logger.middleware.ts`: Updated module import paths.
- `backend/src/config/database.ts`: Updated module import paths.
- `backend/src/utils/db.ts`: Updated module import paths.
- `backend/package.json`: Added `pricing.test.ts` to unit test runner script.
- `reports/README.md`: Updated phase status table.

---

## 8. Dependencies

No new external npm packages installed. Reused `@prisma/client`, `zod`, and existing project dependencies.

---

## 9. Configuration Changes

None.

---

## 10. Database Changes

No schema migrations required. Reused existing `Pricing` and `Setting` models in `prisma/schema.prisma`.

---

## 11. API Changes

- `POST /api/v1/pricing/calculate`: Public / Authenticated. Calculates print job cost breakdown.
- `GET /api/v1/pricing/config`: Public / Authenticated. Lists pricing rules.
- `PUT /api/v1/pricing/config`: Protected (Admin/Super Admin). Updates pricing rates.

---

## 12. UI Changes

No UI changes in this phase.

---

## 13. Testing

- **Unit Tests:** PASSED (`npm run test` ran `auth.test.ts`, `user.test.ts`, `document.test.ts`, `order.test.ts`, and `pricing.test.ts`).
- **Monorepo Lint:** PASSED (`npm run lint` — 0 errors across backend and frontend).
- **Monorepo Build:** PASSED (`npm run build` — 0 errors across backend and frontend).

---

## 14. Security

- Administrative configuration updates guarded by `authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN)` middleware.
- Input validation ensures negative prices, page counts, or copy counts are rejected.
- Audit trail logging for `PRICING_CONFIG_UPDATED`.

---

## 15. Performance

- Pure in-memory math calculation with fast database lookups.
- Fallback pricing matrix allows sub-millisecond calculation even if database queries are delayed.

---

## 16. Known Issues

- None.

---

## 17. Remaining Work

- Phase 09+: Shopping Cart, Razorpay Payment Gateway, Dashboards, Notifications.

---

## 18. Risks

- None identified.

---

## 19. Git Summary

- **Branch:** `main`
- **Files Changed:** 17 files added/modified.

---

## 20. Metrics

- **Files Added:** 6
- **Files Modified:** 11
- **Lines Added:** ~640
- **APIs:** 3 endpoints

---

## 21. Lessons Learned

- Converting double-sided print pages into physical sheet counts (`Math.ceil(pages / 2)`) prior to multiplying by base price accurately reflects physical print paper consumption costs.

---

## 22. Handover Notes

- Pricing calculation endpoint is at `POST /api/v1/pricing/calculate`.
- Pricing configuration endpoint is at `GET /api/v1/pricing/config`.

---

# Final Checklist

✓ Build passes  
✓ Lint passes  
✓ Tests pass  
✓ Documentation updated  
✓ Report saved  
✓ Ready for approval  
