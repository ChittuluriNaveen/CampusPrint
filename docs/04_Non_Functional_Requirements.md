# 04_Non_Functional_Requirements.md

# CampusPrint -- Non-Functional Requirements (NFR)

## 1. Purpose

This document defines the quality attributes that CampusPrint must
satisfy beyond functional behaviour.

------------------------------------------------------------------------

# 2. Performance

## Response Time

-   Page load: \< 2 seconds on broadband
-   API average response: \< 500 ms
-   File upload progress displayed immediately
-   Dashboard loads within 3 seconds

## Concurrent Users

MVP Target: - 200 concurrent users

Future Target: - 5,000+ concurrent users

------------------------------------------------------------------------

# 3. Scalability

The architecture shall support:

-   Horizontal backend scaling
-   Stateless APIs
-   CDN-ready frontend
-   Cloud object storage
-   Multiple print shops
-   Multi-campus deployment

------------------------------------------------------------------------

# 4. Availability

Target uptime:

-   99.5% (MVP)
-   99.9% (Production)

------------------------------------------------------------------------

# 5. Reliability

-   No data loss after successful payment.
-   Automatic retry for transient failures.
-   Graceful error handling.
-   Database transactions where required.

------------------------------------------------------------------------

# 6. Security

Requirements:

-   HTTPS only in production
-   JWT authentication
-   Password hashing (bcrypt)
-   Input validation
-   Rate limiting
-   Helmet security headers
-   CORS configuration
-   Secure file validation
-   Protection against XSS, CSRF and injection attacks

Secrets shall never be committed to source control.

------------------------------------------------------------------------

# 7. Privacy

-   Store minimum personal data.
-   Restrict access by role.
-   Audit administrative actions.
-   Allow users to update profile information.

------------------------------------------------------------------------

# 8. Maintainability

-   Modular architecture
-   Reusable components
-   Separation of concerns
-   Consistent naming conventions
-   Clear documentation
-   Automated linting and formatting

------------------------------------------------------------------------

# 9. Usability

The application should:

-   Be intuitive for first-time users
-   Minimise clicks
-   Provide clear feedback
-   Display actionable error messages
-   Support keyboard navigation

------------------------------------------------------------------------

# 10. Accessibility

Target WCAG 2.1 AA where practical.

Requirements:

-   Semantic HTML
-   Visible focus states
-   Keyboard support
-   Screen-reader friendly labels
-   Sufficient colour contrast

------------------------------------------------------------------------

# 11. Compatibility

Supported Browsers:

-   Chrome
-   Edge
-   Firefox
-   Safari (latest versions)

Devices:

-   Desktop
-   Tablet
-   Mobile

------------------------------------------------------------------------

# 12. Logging & Monitoring

Log:

-   Authentication events
-   Payment events
-   File uploads
-   Errors
-   Administrative actions

Do not log passwords or sensitive tokens.

------------------------------------------------------------------------

# 13. Backup & Recovery

-   Scheduled database backups
-   Restore procedure documented
-   Uploaded files recoverable from storage
-   Environment configuration backed up securely

------------------------------------------------------------------------

# 14. Deployment

Support:

-   Local development
-   Staging
-   Production

Configuration must be environment-driven.

------------------------------------------------------------------------

# 15. Testing Quality Gates

Minimum expectations:

-   Unit tests for business logic
-   API integration tests
-   Manual UI testing
-   Payment sandbox testing
-   File upload validation testing

------------------------------------------------------------------------

# 16. Code Quality

-   ESLint
-   Prettier
-   Meaningful commit messages
-   Pull-request reviews (team projects)
-   No duplicated business logic

------------------------------------------------------------------------

# 17. Performance Optimisation

Frontend:

-   Lazy loading
-   Code splitting
-   Image optimisation
-   Caching

Backend:

-   Pagination
-   Indexed database queries
-   Efficient aggregation
-   Compression where appropriate

------------------------------------------------------------------------

# 18. Success Criteria

CampusPrint satisfies its non-functional requirements when it is secure,
responsive, scalable, maintainable, accessible, and deployable while
providing a consistent experience across supported browsers and devices.
