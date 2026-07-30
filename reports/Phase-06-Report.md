# Phase 06 Implementation Report — Document Upload & Storage

## 1. Phase Information

- **Phase Number:** 06
- **Phase Name:** Document Upload & Storage
- **Completion Date:** July 30, 2026
- **Status:** Complete & Pending Approval

---

## 2. Objective

Implement the complete Document Upload & Storage module for CampusPrint. This phase establishes the core document management foundation required for future print orders, enabling students to securely upload, list, rename, preview, download, and delete their own document files, while allowing administrators proper document oversight according to system RBAC rules.

---

## 3. Executive Summary

Phase 06 delivered a production-ready Document Upload & Storage engine built with Express, Multer, Zod, and Prisma. Document files are validated on upload for MIME type and file size (up to 100 MB max), saved to structured storage paths (`uploads/YYYY/MM/`), and given collision-free stored filenames (`CP_YYYYMMDD_<randomHex>.<ext>`). Document metadata is persisted in PostgreSQL via a new `Document` model. Authenticated students can upload files, list their documents with search and pagination, view details, rename documents, stream inline previews, download original files, and soft-delete/remove documents. All operations generate structured audit trail records in `activity_logs`.

---

## 4. Scope Covered

- Document upload endpoint (`POST /api/v1/documents/upload`) with Multer disk storage strategy.
- Strict client/server upload validation enforcing allowed extensions (`.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.jpg`, `.jpeg`, `.png`) and allowed MIME types.
- Configurable maximum file size enforcement (100 MB max limit).
- Structured disk storage layout (`uploads/YYYY/MM/`) with safe filename convention (`CP_YYYYMMDD_<randomHex>.<ext>`).
- Database metadata persistence (`userId`, `originalFileName`, `storedFileName`, `mimeType`, `size`, `path`, `pageCount`, `status`).
- User document listing endpoint (`GET /api/v1/documents`) with pagination (`page`, `limit`) and search on `originalFileName`.
- Document details endpoint (`GET /api/v1/documents/:id`) with ownership checks.
- Document renaming endpoint (`PATCH /api/v1/documents/:id`) with extension preservation.
- Document deletion endpoint (`DELETE /api/v1/documents/:id`) with soft-deletion in DB and physical file removal from storage disk.
- Document download endpoint (`GET /api/v1/documents/:id/download`) with `Content-Disposition: attachment`.
- Document preview endpoint (`GET /api/v1/documents/:id/preview`) with inline content streaming.
- Audit trail logging for `DOCUMENT_UPLOADED`, `DOCUMENT_RENAMED`, `DOCUMENT_DELETED`, `DOCUMENT_DOWNLOADED`, and `DOCUMENT_PREVIEWED` actions.
- Zod validation schemas (`renameDocumentSchema`, `documentQuerySchema`).
- Automated unit test suite (`backend/src/__tests__/document.test.ts`).

---

## 5. Features Implemented

1. **Storage Utility (`backend/src/utils/storage.ts`)**:
   - **Purpose:** Handles path resolutions, directory auto-creation (`uploads/YYYY/MM/`), filename generation (`CP_YYYYMMDD_<randomHex>.<ext>`), file existence checks, and disk file unlinking.

2. **Multer Upload Middleware (`backend/src/middleware/upload.middleware.ts`)**:
   - **Purpose:** Intercepts `multipart/form-data` uploads under key `"document"`, validates MIME type and file size (100 MB limit), and handles Multer errors cleanly.

3. **Document Service (`backend/src/services/document.service.ts`)**:
   - **Purpose:** Encapsulates business logic for uploading, listing, fetching, renaming, soft-deleting, downloading, and previewing documents. Enforces ownership and RBAC rules.

4. **Document Controller (`backend/src/controllers/document.controller.ts`)**:
   - **Purpose:** Express route controllers mapping HTTP requests to document service calls and returning standard API envelopes (`sendSuccess`, `sendError`).

5. **Document Routes (`backend/src/routes/document.routes.ts`)**:
   - **Purpose:** Exposes document endpoints under `/api/v1/documents` protected by `authenticate` middleware.

---

## 6. Architecture Changes

- **New Database Model:** Introduced `Document` model in `backend/prisma/schema.prisma` with relation to `User`.
- **New Middleware:** Added `uploadSingleDocument` Multer middleware.
- **Routes Mounted:** Mounted `/documents` in `backend/src/routes/index.ts`.

---

## 7. File Changes

### New Files
- `backend/src/utils/storage.ts`
- `backend/src/middleware/upload.middleware.ts`
- `backend/src/validators/document.validator.ts`
- `backend/src/services/document.service.ts`
- `backend/src/controllers/document.controller.ts`
- `backend/src/routes/document.routes.ts`
- `backend/src/__tests__/document.test.ts`
- `reports/Phase-06-Report.md`

### Modified Files
- `backend/package.json`: Added `multer` and `@types/multer` dependencies, updated `test` script.
- `backend/prisma/schema.prisma`: Added `Document` model and `documents Document[]` relation to `User`.
- `backend/src/routes/index.ts`: Mounted `documentRoutes` under `/v1/documents`.
- `reports/README.md`: Updated phase completion table.

---

## 8. Dependencies

- Added `multer` (`^1.4.5-lts.1`) to backend dependencies.
- Added `@types/multer` (`^1.4.12`) to backend devDependencies.

---

## 9. Configuration Changes

None. Reused `UPLOAD_PATH` from `env.ts`.

---

## 10. Database Changes

Added `documents` table to PostgreSQL via Prisma Client generation:
- `id` (UUID Primary Key)
- `userId` (Foreign Key to `users.id`)
- `originalFileName` (String)
- `storedFileName` (String)
- `mimeType` (String)
- `size` (Integer)
- `path` (String)
- `pageCount` (Integer, default 1)
- `status` (String, default "ACTIVE")
- `createdAt` & `updatedAt` (Timestamps)
- `deletedAt` (Nullable Timestamp)

---

## 11. API Changes

- `POST /api/v1/documents/upload`: Protected. Uploads document file payload (`multipart/form-data`).
- `GET /api/v1/documents`: Protected. Lists documents with pagination and search.
- `GET /api/v1/documents/:id`: Protected. Retrieves document metadata.
- `PATCH /api/v1/documents/:id`: Protected. Renames document.
- `DELETE /api/v1/documents/:id`: Protected. Deletes document record and unlinks file.
- `GET /api/v1/documents/:id/download`: Protected. Downloads original document file.
- `GET /api/v1/documents/:id/preview`: Protected. Streams document inline preview.

---

## 12. UI Changes

No UI changes in this phase.

---

## 13. Testing

- **Unit Tests:** PASSED (`npm run test` ran `auth.test.ts`, `user.test.ts`, and `document.test.ts` verifying filename conventions, allowed MIME types, extension filtering, Zod schemas, and query parsers).
- **Monorepo Lint:** PASSED (`npm run lint` — 0 errors across backend and frontend).
- **Monorepo Build:** PASSED (`npm run build` — 0 errors across backend and frontend).

---

## 14. Security

- Directory traversal prevented via `path.resolve` and strict filename generation.
- Executable files (.exe, .sh, .bat, etc.) rejected during upload filter.
- File ownership enforced on every retrieve, rename, delete, download, and preview request.
- Unlink operation safely wrapped in try-catch to avoid process crashing if disk file is absent.

---

## 15. Performance

- Uploads stream directly to disk storage without keeping raw file buffers in RAM.
- Document queries utilize `@@index([userId])` and `@@index([createdAt])`.

---

## 16. Known Issues

- None.

---

## 17. Remaining Work

- Phase 07+: Print Pricing Engine, Order Workflow System, Cart Management, Razorpay Payment Integration, Dashboards.

---

## 18. Risks

- None.

---

## 19. Git Summary

- **Branch:** `main`
- **Files Changed:** 11 files added/modified.

---

## 20. Metrics

- **Files Added:** 8
- **Files Modified:** 4
- **Lines Added:** ~850
- **APIs:** 7 endpoints

---

## 21. Lessons Learned

- Organizing upload storage into `YYYY/MM/` directories prevents filesystem slowdowns when managing thousands of uploaded files over time.

---

## 22. Handover Notes

- Document management endpoints are mounted under `/api/v1/documents`.
- Attached file key for upload requests must be named `"document"`.

---

# Final Checklist

✓ Build passes  
✓ Lint passes  
✓ Tests pass  
✓ Documentation updated  
✓ Report saved  
✓ Ready for approval  
