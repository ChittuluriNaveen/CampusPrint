# 30_Error_Catalog.md

# CampusPrint -- Error Catalog

## 1. Purpose

This document defines standard error handling, response formats, error
codes, logging expectations, and troubleshooting guidance for
CampusPrint.

------------------------------------------------------------------------

# 2. Standard Error Response

``` json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email or password.",
    "details": [],
    "requestId": "abc123"
  }
}
```

------------------------------------------------------------------------

# 3. HTTP Status Mapping

  Status   Meaning
  -------- ------------------------
  400      Bad Request
  401      Unauthenticated
  403      Forbidden
  404      Resource Not Found
  409      Conflict
  413      Payload Too Large
  415      Unsupported Media Type
  422      Validation Failed
  429      Too Many Requests
  500      Internal Server Error
  503      Service Unavailable

------------------------------------------------------------------------

# 4. Authentication Errors

  Code       Description
  ---------- ------------------------------
  AUTH_001   Invalid credentials
  AUTH_002   JWT expired
  AUTH_003   Invalid token
  AUTH_004   Password reset token invalid
  AUTH_005   Account disabled

------------------------------------------------------------------------

# 5. Authorization Errors

  Code       Description
  ---------- -----------------------------
  RBAC_001   Insufficient permissions
  RBAC_002   Admin access required
  RBAC_003   Resource ownership mismatch

------------------------------------------------------------------------

# 6. Validation Errors

  Code      Description
  --------- -------------------------
  VAL_001   Required field missing
  VAL_002   Invalid email
  VAL_003   Invalid print settings
  VAL_004   Invalid page range
  VAL_005   Invalid request payload

------------------------------------------------------------------------

# 7. File Upload Errors

  Code       Description
  ---------- -------------------------
  FILE_001   Unsupported file type
  FILE_002   File exceeds size limit
  FILE_003   Upload failed
  FILE_004   Corrupted file
  FILE_005   File scan failed

------------------------------------------------------------------------

# 8. Payment Errors

  Code      Description
  --------- -----------------------------
  PAY_001   Payment verification failed
  PAY_002   Amount mismatch
  PAY_003   Duplicate payment
  PAY_004   Refund failed
  PAY_005   Payment gateway unavailable

------------------------------------------------------------------------

# 9. Database Errors

  Code     Description
  -------- --------------------
  DB_001   Connection failed
  DB_002   Duplicate record
  DB_003   Transaction failed
  DB_004   Query timeout

------------------------------------------------------------------------

# 10. Notification Errors

  Code         Description
  ------------ ------------------------------
  NOTIFY_001   Notification delivery failed
  NOTIFY_002   Email service unavailable

------------------------------------------------------------------------

# 11. Internal Errors

  Code      Description
  --------- -----------------------------
  SYS_001   Unexpected server error
  SYS_002   Configuration error
  SYS_003   External dependency failure

------------------------------------------------------------------------

# 12. Retry Guidance

Retry recommended for:

-   Temporary network failures
-   Payment gateway timeouts
-   Email delivery failures
-   Database reconnect attempts

Do not retry:

-   Authentication failures
-   Validation errors
-   Permission errors

------------------------------------------------------------------------

# 13. User-Friendly Messages

-   "Please check your login details and try again."
-   "The uploaded file is not supported."
-   "Your payment could not be verified."
-   "Something went wrong. Please try again later."

Avoid exposing technical implementation details.

------------------------------------------------------------------------

# 14. Logging Requirements

Every error log should include:

-   Timestamp
-   Request ID
-   User ID (if available)
-   Error code
-   HTTP status
-   Stack trace (server only)

Never log passwords, JWTs, or payment secrets.

------------------------------------------------------------------------

# 15. Troubleshooting

1.  Identify error code.
2.  Review logs using request ID.
3.  Verify configuration.
4.  Reproduce issue.
5.  Apply fix and validate.

------------------------------------------------------------------------

# 16. Acceptance Criteria

The error catalog is complete when every application error has a unique
code, standard response format, logging guidance, and user-facing
message.
