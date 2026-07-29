# 38_Data_Retention_Privacy.md

# CampusPrint -- Data Retention & Privacy

## 1. Purpose

This document defines how CampusPrint collects, stores, retains,
archives, and securely disposes of data while protecting user privacy
and complying with applicable regulations.

------------------------------------------------------------------------

# 2. Objectives

-   Protect personal information
-   Define data retention periods
-   Minimise unnecessary data collection
-   Ensure secure deletion
-   Support audits and compliance

------------------------------------------------------------------------

# 3. Data Classification

  Category       Examples                       Sensitivity
  -------------- ------------------------------ -------------
  Public         Help pages                     Low
  Internal       Application logs               Medium
  Confidential   User profiles, orders          High
  Restricted     Password hashes, API secrets   Critical

------------------------------------------------------------------------

# 4. Data Collected

-   User account information
-   Order details
-   Uploaded documents
-   Payment references (no card data)
-   Activity logs
-   System audit logs

------------------------------------------------------------------------

# 5. Retention Policy

  -----------------------------------------------------------------------
  Data Type                           Retention
  ----------------------------------- -----------------------------------
  User Accounts                       Until account deletion or legal
                                      requirement

  Orders                              7 years

  Uploaded Files                      Configurable (default 90 days after
                                      order completion)

  Application Logs                    30 days

  Audit Logs                          1 year

  Backups                             90 days
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 6. Privacy Principles

-   Collect only required data
-   Use data for stated purposes
-   Restrict access by role
-   Encrypt sensitive information
-   Maintain audit trails

------------------------------------------------------------------------

# 7. User Rights

Users should be able to:

-   View their information
-   Correct inaccurate information
-   Delete eligible data
-   Download their data where supported

------------------------------------------------------------------------

# 8. Data Protection Controls

-   HTTPS for all traffic
-   Password hashing
-   Encryption at rest where supported
-   Role-based access control
-   Regular security reviews

------------------------------------------------------------------------

# 9. Secure Disposal

When retention expires:

1.  Remove application records
2.  Delete uploaded files
3.  Remove backup copies according to schedule
4.  Record deletion in audit logs where appropriate

------------------------------------------------------------------------

# 10. Third-Party Services

Review all integrations to ensure:

-   Secure data transfer
-   Minimal data sharing
-   Appropriate contractual protections
-   Periodic security assessment

------------------------------------------------------------------------

# 11. Compliance Review

Review this policy annually or after major legal, architectural, or
business changes.

------------------------------------------------------------------------

# 12. Acceptance Criteria

Data retention and privacy practices are complete when retention periods
are documented, privacy controls are implemented, secure deletion
procedures exist, and sensitive data is protected throughout its
lifecycle.
