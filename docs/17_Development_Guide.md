# 17_Development_Guide.md

# CampusPrint -- Development Guide

## 1. Purpose

This guide explains how developers can set up, run, test, debug, and
contribute to CampusPrint consistently across environments.

------------------------------------------------------------------------

# 2. Prerequisites

Install:

-   Node.js (LTS)
-   npm or pnpm
-   Git
-   MongoDB (local) or MongoDB Atlas
-   VS Code
-   Docker (optional)

Recommended Extensions

-   ESLint
-   Prettier
-   GitLens
-   Error Lens
-   Docker

------------------------------------------------------------------------

# 3. Clone Repository

``` bash
git clone https://github.com/<organisation>/CampusPrint.git
cd CampusPrint
```

------------------------------------------------------------------------

# 4. Install Dependencies

Frontend

``` bash
cd client
npm install
```

Backend

``` bash
cd ../server
npm install
```

------------------------------------------------------------------------

# 5. Environment Configuration

Copy the sample file.

``` bash
cp .env.example .env
```

Configure:

-   MongoDB URI
-   JWT Secret
-   Razorpay Keys
-   SMTP Settings
-   Upload Path

Never commit `.env`.

------------------------------------------------------------------------

# 6. Running the Application

Backend

``` bash
npm run dev
```

Frontend

``` bash
npm run dev
```

Verify:

-   Frontend starts without errors.
-   Backend connects to MongoDB.
-   API responds successfully.

------------------------------------------------------------------------

# 7. Database Initialisation

Recommended:

-   Create indexes automatically
-   Seed development data
-   Create an administrator account

Development seed command:

``` bash
npm run seed
```

------------------------------------------------------------------------

# 8. Code Quality

Run before every commit:

``` bash
npm run lint
npm run format
npm test
```

Use:

-   ESLint
-   Prettier
-   TypeScript checking

------------------------------------------------------------------------

# 9. Testing

Unit Tests

``` bash
npm run test
```

Integration Tests

``` bash
npm run test:integration
```

End-to-End Tests

``` bash
npm run test:e2e
```

Recommended tools:

-   Vitest/Jest
-   Supertest
-   Playwright

------------------------------------------------------------------------

# 10. Debugging

Use:

-   VS Code debugger
-   Browser Developer Tools
-   Network inspector
-   MongoDB Compass

Check:

-   API responses
-   Authentication
-   File uploads
-   Payment verification

------------------------------------------------------------------------

# 11. Git Workflow

1.  Create feature branch.
2.  Develop feature.
3.  Run tests.
4.  Commit using conventional commits.
5.  Open Pull Request.
6.  Request review.
7.  Merge after approval.

Example:

``` text
feat: add payment verification
fix: correct upload validation
docs: update API specification
```

------------------------------------------------------------------------

# 12. Pull Request Checklist

-   Code builds successfully
-   Tests pass
-   Linting passes
-   Documentation updated
-   No secrets committed
-   Feature manually verified

------------------------------------------------------------------------

# 13. Release Process

-   Update version
-   Generate changelog
-   Build frontend
-   Deploy backend
-   Verify production health
-   Tag release

------------------------------------------------------------------------

# 14. CI/CD Recommendations

Pipeline should:

-   Install dependencies
-   Run linting
-   Run tests
-   Build application
-   Scan for vulnerabilities
-   Deploy after approval

------------------------------------------------------------------------

# 15. Common Troubleshooting

Problems:

-   MongoDB connection failure
-   Invalid JWT secret
-   Razorpay credentials incorrect
-   CORS errors
-   Upload permission issues
-   Missing environment variables

Always inspect application logs before debugging further.

------------------------------------------------------------------------

# 16. Future Improvements

-   Docker Compose
-   Dev Containers
-   Automated database migrations
-   Preview deployments
-   Continuous performance testing

------------------------------------------------------------------------

# 17. Acceptance Criteria

The development guide is complete when a new developer can:

-   Clone the project
-   Configure the environment
-   Run frontend and backend
-   Execute tests
-   Debug common issues
-   Contribute changes following the defined workflow
