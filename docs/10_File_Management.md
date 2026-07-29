# 10_File_Management.md

# CampusPrint -- File Management Specification

## 1. Purpose

This document defines how uploaded documents are validated, stored,
processed, secured and managed throughout their lifecycle.

------------------------------------------------------------------------

# 2. Supported File Types

  Category     Extensions
  ------------ -------------------
  PDF          .pdf
  Word         .doc, .docx
  PowerPoint   .ppt, .pptx
  Images       .jpg, .jpeg, .png

Future: - .xlsx - .txt - .odt

------------------------------------------------------------------------

# 3. Upload Rules

-   Maximum size configurable (default 100 MB)
-   Multiple files per order
-   Drag-and-drop support
-   Progress indicator
-   Cancel upload
-   Retry failed uploads

------------------------------------------------------------------------

# 4. Validation

Client-side: - Extension - Size - Empty file detection

Server-side: - MIME type verification - Size verification - Filename
sanitisation - Malware scan integration (future)

The server is the source of truth.

------------------------------------------------------------------------

# 5. Storage Strategy

## MVP

``` text
uploads/
 ├── 2026/
 │   ├── 07/
 │   └── 08/
```

## Production

-   AWS S3
-   Azure Blob Storage
-   Google Cloud Storage

Store only file metadata in MongoDB.

------------------------------------------------------------------------

# 6. Naming Convention

Never store using the original filename.

Example:

``` text
CP_20260729_3f9c9d2d.pdf
```

Preserve the original filename separately for display.

------------------------------------------------------------------------

# 7. Metadata

Each uploaded file stores:

-   File ID
-   Order ID
-   Original name
-   Stored name
-   MIME type
-   Size
-   Upload time
-   Uploaded by
-   Page count
-   SHA-256 checksum (future)

------------------------------------------------------------------------

# 8. Preview Support

Supported:

-   PDF preview
-   Thumbnail for images

Future:

-   DOCX preview
-   PPTX preview

------------------------------------------------------------------------

# 9. Download Rules

Students: - Own files only

Administrators: - Any order assigned to the print workflow

All downloads require authentication.

------------------------------------------------------------------------

# 10. Retention

Completed orders: - Retain for configurable period

Deleted users: - Preserve documents until retention expires

Future: - Automated archival

------------------------------------------------------------------------

# 11. Security

-   Private storage
-   Random filenames
-   Access through authenticated APIs
-   Validate every download request
-   Prevent directory traversal
-   Restrict executable uploads

------------------------------------------------------------------------

# 12. Processing Pipeline

``` text
Select File
    │
    ▼
Client Validation
    │
    ▼
Upload
    │
    ▼
Server Validation
    │
    ▼
Store File
    │
    ▼
Store Metadata
    │
    ▼
Ready for Print Configuration
```

------------------------------------------------------------------------

# 13. Error Handling

Possible errors:

-   Unsupported file type
-   File too large
-   Corrupt upload
-   Network interruption
-   Storage unavailable

Display clear recovery instructions.

------------------------------------------------------------------------

# 14. Future Enhancements

-   OCR
-   Duplicate detection
-   Compression
-   Virus scanning
-   Google Drive import
-   OneDrive import
-   Dropbox import
-   Version history

------------------------------------------------------------------------

# 15. Acceptance Criteria

The file management module is complete when:

-   Supported files upload successfully.
-   Invalid files are rejected.
-   Files are securely stored.
-   Metadata is persisted.
-   Authorised users can preview and download files.
-   File access is protected by authentication and role checks.
