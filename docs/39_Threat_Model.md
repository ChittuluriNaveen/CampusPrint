# 39_Threat_Model.md

# CampusPrint -- Threat Model

## 1. Purpose

This document identifies potential security threats to CampusPrint,
evaluates associated risks, and defines mitigation strategies to reduce
the likelihood and impact of security incidents.

------------------------------------------------------------------------

# 2. Objectives

-   Identify attack surfaces
-   Protect user and business data
-   Prioritise security controls
-   Support secure software development
-   Reduce operational risk

------------------------------------------------------------------------

# 3. Assets

Critical assets include:

-   User accounts
-   Uploaded documents
-   Order information
-   Payment records
-   API services
-   Database
-   Administrative portal
-   Secrets and configuration

------------------------------------------------------------------------

# 4. Threat Modelling Method

CampusPrint follows the STRIDE model:

-   **S**poofing
-   **T**ampering
-   **R**epudiation
-   **I**nformation Disclosure
-   **D**enial of Service
-   **E**levation of Privilege

------------------------------------------------------------------------

# 5. Attack Surfaces

-   Web application
-   REST APIs
-   Authentication endpoints
-   File upload service
-   Payment integration
-   Admin dashboard
-   Database connections

------------------------------------------------------------------------

# 6. Threat Analysis

  ------------------------------------------------------------------------
  Threat              Example                Mitigation
  ------------------- ---------------------- -----------------------------
  Spoofing            Credential theft       MFA (future), strong
                                             passwords, JWT validation

  Tampering           Modified requests      Input validation, server-side
                                             verification

  Repudiation         Denying an action      Audit logs and request IDs

  Information         Data leakage           HTTPS, encryption, RBAC
  Disclosure                                 

  Denial of Service   Excessive requests     Rate limiting, monitoring

  Elevation of        Admin access abuse     Role-based authorisation,
  Privilege                                  least privilege
  ------------------------------------------------------------------------

------------------------------------------------------------------------

# 7. Security Controls

-   HTTPS everywhere
-   Password hashing (bcrypt/Argon2)
-   JWT authentication
-   Role-Based Access Control (RBAC)
-   Input validation
-   Output encoding
-   Secure HTTP headers
-   Dependency vulnerability scanning

------------------------------------------------------------------------

# 8. File Upload Security

-   MIME type validation
-   File size limits
-   Malware scanning (future)
-   Randomised filenames
-   Restricted execution permissions

------------------------------------------------------------------------

# 9. Monitoring & Detection

Monitor:

-   Failed login attempts
-   Privilege changes
-   Suspicious API activity
-   Repeated upload failures
-   Unusual traffic spikes

------------------------------------------------------------------------

# 10. Incident Response

1.  Detect
2.  Contain
3.  Eradicate
4.  Recover
5.  Review and improve

------------------------------------------------------------------------

# 11. Security Review

Review the threat model:

-   Before major releases
-   After architectural changes
-   Following security incidents
-   At least annually

------------------------------------------------------------------------

# 12. Acceptance Criteria

The threat model is complete when major attack surfaces are documented,
threats are analysed using STRIDE, mitigation controls are defined, and
periodic security reviews are scheduled.
