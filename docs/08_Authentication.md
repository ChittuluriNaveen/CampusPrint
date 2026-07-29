# 08_Authentication.md

# CampusPrint -- Authentication & Authorization Specification

## 1. Purpose

This document defines authentication, authorization, identity management
and session handling for CampusPrint.

------------------------------------------------------------------------

# 2. Authentication Goals

-   Secure user identities
-   Protect APIs
-   Prevent unauthorised access
-   Support role-based access control
-   Enable future SSO integration

------------------------------------------------------------------------

# 3. Supported Roles

  Role          Description
  ------------- -------------------------------------
  STUDENT       Places and tracks print orders
  ADMIN         Manages orders, pricing and reports
  SUPER_ADMIN   Global administration (future)

------------------------------------------------------------------------

# 4. Registration Flow

1.  User submits registration form.
2.  Backend validates input.
3.  Password is hashed using bcrypt.
4.  User record is created.
5.  Verification email (future).
6.  Account becomes active.

Required fields

-   Name
-   University Email
-   Password
-   Student ID
-   Department
-   Academic Year

------------------------------------------------------------------------

# 5. Login Flow

``` text
User
  │
  ▼
Enter Credentials
  │
  ▼
Validate Request
  │
  ▼
Find User
  │
  ▼
Compare Password
  │
  ▼
Generate JWT
  │
  ▼
Return Token + Profile
```

------------------------------------------------------------------------

# 6. JWT Strategy

Access Token

-   Short-lived
-   Included in Authorization header

Future

-   Refresh Token
-   Token rotation
-   Session revocation

Header

    Authorization: Bearer <token>

------------------------------------------------------------------------

# 7. Password Policy

-   Minimum 8 characters
-   Uppercase letter
-   Lowercase letter
-   Number
-   Special character (recommended)

Passwords are never stored in plain text.

------------------------------------------------------------------------

# 8. Password Reset (Future)

1.  Request reset.
2.  Generate secure token.
3.  Send email.
4.  Verify token.
5.  Set new password.
6.  Invalidate previous sessions.

------------------------------------------------------------------------

# 9. Role-Based Access Control

  Feature            Student   Admin   Super Admin
  ----------------- --------- ------- -------------
  Register              ✓        ✗          ✗
  Upload Files          ✓        ✗          ✗
  View Own Orders       ✓        ✗          ✗
  Manage Orders         ✗        ✓          ✓
  Manage Pricing        ✗        ✓          ✓
  Manage Users          ✗        ✓          ✓
  Global Settings       ✗        ✗          ✓

------------------------------------------------------------------------

# 10. Protected Routes

Require JWT:

-   Dashboard
-   Orders
-   Upload
-   Payments
-   Notifications
-   Reports
-   Admin APIs

------------------------------------------------------------------------

# 11. Middleware Responsibilities

Authentication Middleware

-   Validate JWT
-   Load user
-   Reject invalid tokens

Authorisation Middleware

-   Verify required role
-   Return HTTP 403 if forbidden

Validation Middleware

-   Validate request payloads
-   Sanitise input

------------------------------------------------------------------------

# 12. Security Controls

-   bcrypt password hashing
-   JWT signature verification
-   HTTPS in production
-   Rate limiting
-   Helmet headers
-   Input validation
-   CORS configuration

------------------------------------------------------------------------

# 13. Session Management

Current MVP

-   Stateless JWT

Future

-   Refresh tokens
-   Device sessions
-   Logout everywhere
-   Session expiry dashboard

------------------------------------------------------------------------

# 14. Audit Logging

Record:

-   Registration
-   Login
-   Logout
-   Password change
-   Failed login attempts
-   Privileged administrative actions

Never log passwords or tokens.

------------------------------------------------------------------------

# 15. Error Responses

Examples

-   Invalid credentials
-   Token expired
-   Token missing
-   Account blocked
-   Account inactive
-   Access denied

------------------------------------------------------------------------

# 16. Future Authentication Features

-   Google Sign-In
-   Microsoft Entra ID
-   University SSO
-   Two-Factor Authentication
-   Passkeys/WebAuthn

------------------------------------------------------------------------

# 17. Acceptance Criteria

Authentication is complete when:

-   Users can register and log in securely.
-   Passwords are hashed.
-   JWT protects private APIs.
-   Roles are enforced.
-   Protected resources cannot be accessed without authorisation.
-   Authentication failures return consistent error responses.
