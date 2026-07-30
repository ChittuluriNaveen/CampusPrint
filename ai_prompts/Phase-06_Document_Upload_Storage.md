# Phase 06 — Document Upload & Storage

Version: 1.0

Status: Ready for Implementation

---

# Objective

Implement the complete Document Upload & Storage module for CampusPrint.

This phase establishes the document management foundation required for future print orders.

Students should be able to securely upload, manage, preview and delete their own documents.

Administrators should only have access according to the RBAC rules defined in the documentation.

No print ordering or pricing logic should be implemented in this phase.

---

# Documentation

Before implementation read ONLY:

- reports/Previous-Phase-Report.md
- docs/09_Document_Management.md
- docs/12_Security.md
- docs/16_Project_Structure.md
- docs/29_Coding_Standards.md

---

# Scope

Implement ONLY:

✓ Document Upload

✓ File Validation

✓ File Storage

✓ File Metadata

✓ Document Listing

✓ Document Details

✓ Delete Document

✓ Rename Document

✓ Document Preview

✓ Download Document

✓ Storage Service

✓ Upload Middleware

✓ Upload Validation

✓ Storage Configuration

✓ Audit Logging (if documented)

---

# Out of Scope

Do NOT implement:

❌ Print Orders

❌ Cart

❌ Pricing

❌ Payments

❌ Printing Workflow

❌ Analytics

❌ Notifications

❌ Dashboard Features

❌ Business Logic

---

# Supported File Types

Implement support only for the file types defined in the documentation.

Typical examples:

- PDF
- DOC
- DOCX
- PPT
- PPTX
- JPG
- JPEG
- PNG

Reject unsupported formats.

---

# Upload Rules

Implement:

Maximum file size validation

Allowed extensions

Allowed MIME types

Duplicate handling

Filename sanitisation

Safe file naming

Unique stored filenames

---

# Storage

Implement the storage strategy defined in the documentation.

Typical options include:

- Local Storage
- Cloud Storage
- Object Storage

Store only metadata in the database.

Actual files should be stored using the configured storage provider.

---

# Metadata

Maintain metadata such as:

- Original filename
- Stored filename
- File size
- MIME type
- Upload date
- Uploaded by
- Storage path
- File status

Do not store unnecessary information.

---

# Database

Reuse existing models.

Extend only if required.

Generate migrations only when necessary.

---

# APIs

Implement only documented APIs.

Typical examples:

POST /documents/upload

GET /documents

GET /documents/:id

PATCH /documents/:id

DELETE /documents/:id

GET /documents/:id/download

GET /documents/:id/preview

---

# Security

Implement:

Ownership validation

Role validation

Upload validation

Download authorisation

Delete authorisation

Prevent:

Directory traversal

Malicious filenames

Executable uploads

Oversized uploads

Unauthorised access

---

# Middleware

Implement reusable middleware for:

Upload handling

Validation

Authorisation

Error handling

Reuse existing middleware wherever possible.

---

# Services

Create reusable services for:

Document Storage

Document Metadata

File Validation

Preview

Download

Deletion

Avoid duplicated logic.

---

# Validation

Validate:

File type

File size

Ownership

Permissions

Metadata

Return consistent API responses.

---

# Error Handling

Handle:

Unsupported file

Oversized file

Missing file

Upload failure

Storage failure

Database failure

Permission denied

Return meaningful error messages.

---

# Logging

Log:

Upload

Rename

Delete

Download

Preview

Do not log sensitive information.

---

# Coding Standards

Every implementation must:

- Follow SOLID principles
- Use TypeScript
- Be reusable
- Be modular
- Use async/await
- Be production ready

---

# Validation Checklist

Verify:

✓ Upload works

✓ File validation works

✓ Storage works

✓ Metadata saved

✓ Preview works

✓ Download works

✓ Delete works

✓ Ownership enforced

✓ Authorization enforced

✓ Build passes

✓ Lint passes

---

# Deliverables

Provide:

1. Upload Architecture

2. Storage Architecture

3. APIs Created

4. Middleware Added

5. Services Added

6. Validation Strategy

7. Security Summary

8. Build Status

9. Lint Status

10. Remaining Work

---

# Success Criteria

This phase is complete only if:

✓ Document upload works

✓ Storage works

✓ Metadata managed

✓ Download works

✓ Preview works

✓ Delete works

✓ Security enforced

✓ Build passes

✓ Lint passes

✓ No print-order functionality exists

✓ No pricing exists

✓ No payment logic exists

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

reports/Phase-06-Report.md

4. Commit:

git add .

git commit -m "Phase 06: Document upload and storage"

5. If a Git remote is configured:

git push origin main

Stop.

Wait for user approval before Phase 07.