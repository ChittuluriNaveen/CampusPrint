# 05_System_Architecture.md

# CampusPrint -- System Architecture

## 1. Overview

CampusPrint follows a modular MERN architecture designed for
maintainability, scalability, and future cloud deployment.

    +-------------+        HTTPS         +----------------+
    | React Front | <------------------> | Express API    |
    +-------------+                      +----------------+
                                              |
                                              |
                                   +----------+----------+
                                   |                     |
                            MongoDB Database      File Storage
                                   |
                            Payment Gateway
                              (Razorpay)

------------------------------------------------------------------------

# 2. Architectural Goals

-   Modular design
-   Separation of concerns
-   Stateless backend
-   Secure authentication
-   Scalable storage
-   Cloud-ready deployment

------------------------------------------------------------------------

# 3. Layers

## Presentation Layer

Responsibilities

-   React UI
-   Routing
-   Forms
-   Validation
-   State management
-   API communication

## API Layer

Responsibilities

-   Authentication
-   Business logic
-   Validation
-   File processing
-   Payment orchestration

## Data Layer

Responsibilities

-   MongoDB persistence
-   Indexes
-   Aggregations
-   Transactions where required

------------------------------------------------------------------------

# 4. Major Components

## Frontend

-   Landing Page
-   Authentication
-   Student Dashboard
-   Admin Dashboard
-   Upload Module
-   Payment Module
-   Order Tracking
-   Analytics

## Backend

-   Auth Service
-   User Service
-   Order Service
-   Pricing Service
-   Payment Service
-   Notification Service
-   File Service
-   Reporting Service

------------------------------------------------------------------------

# 5. Authentication Flow

1.  User registers.
2.  Password is hashed.
3.  User logs in.
4.  JWT is issued.
5.  Token accompanies protected requests.
6.  Middleware validates token and role.

------------------------------------------------------------------------

# 6. Document Upload Flow

1.  Select files.
2.  Client-side validation.
3.  Upload using multipart/form-data.
4.  Server validates file type and size.
5.  Store file with unique name.
6.  Persist metadata in MongoDB.

Future storage:

-   AWS S3
-   Azure Blob
-   Cloudinary

------------------------------------------------------------------------

# 7. Pricing Flow

Input:

-   Pages
-   Copies
-   Colour
-   Paper Size
-   Duplex
-   Binding
-   Lamination

↓

Pricing Engine

↓

Subtotal

↓

Tax

↓

Final Amount

------------------------------------------------------------------------

# 8. Payment Flow

Student

↓

Create Order

↓

Backend creates Razorpay Order

↓

Razorpay Checkout

↓

Payment Success

↓

Signature Verification

↓

Persist Payment

↓

Create Print Order

↓

Queue Assignment

------------------------------------------------------------------------

# 9. Order Lifecycle

Draft

↓

Payment Pending

↓

Paid

↓

Queued

↓

Printing

↓

Quality Check

↓

Ready

↓

Collected

------------------------------------------------------------------------

# 10. Database Interaction

Collections

-   users
-   orders
-   payments
-   pricing
-   notifications
-   activityLogs
-   settings

Relationships

User 1 → N Orders

Order 1 → N Files

Order 1 → 1 Payment

------------------------------------------------------------------------

# 11. Suggested Backend Structure

    server/
      config/
      controllers/
      middleware/
      models/
      repositories/
      routes/
      services/
      utils/
      validators/

Repositories isolate database access while services contain business
logic.

------------------------------------------------------------------------

# 12. Suggested Frontend Structure

    client/src/
      assets/
      components/
      contexts/
      hooks/
      layouts/
      pages/
      routes/
      services/
      styles/
      utils/

------------------------------------------------------------------------

# 13. Security Architecture

-   HTTPS
-   JWT Authentication
-   bcrypt Password Hashing
-   Helmet
-   CORS
-   Rate Limiting
-   Input Validation
-   File Validation
-   Secure Environment Variables

------------------------------------------------------------------------

# 14. Deployment Architecture

Frontend

React → Vercel

Backend

Express → Render / Railway

Database

MongoDB Atlas

Storage

Cloud Storage (future)

------------------------------------------------------------------------

# 15. Monitoring

Capture

-   API latency
-   Error rates
-   Payment failures
-   Upload failures
-   Authentication events

------------------------------------------------------------------------

# 16. Scalability Roadmap

Current

Monolithic MERN application.

Future

-   Redis cache
-   Background job queue
-   Object storage
-   Email microservice
-   Notification microservice
-   Multi-campus tenancy
-   Load balancing

------------------------------------------------------------------------

# 17. Architecture Principles

-   Thin controllers
-   Service-oriented business logic
-   Reusable components
-   Stateless APIs
-   Configuration via environment variables
-   Clear module boundaries

------------------------------------------------------------------------

# 18. Definition of Success

The architecture is successful when it supports secure authentication,
efficient document uploads, reliable online payments, configurable
pricing, responsive dashboards, and future expansion without major
redesign.
