# 07_API_Specification.md

# CampusPrint -- REST API Specification

Version: v1

## API Principles

-   RESTful endpoints
-   JSON request/response
-   JWT authentication
-   Consistent response envelope
-   Versioned under `/api/v1`

------------------------------------------------------------------------

# Base URL

Development

    http://localhost:5000/api/v1

Production

    https://api.campusprint.example/api/v1

------------------------------------------------------------------------

# Standard Response

Success

``` json
{
  "success": true,
  "message": "Operation completed.",
  "data": {}
}
```

Error

``` json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

------------------------------------------------------------------------

# Authentication

Authorization header

    Authorization: Bearer <JWT>

Roles

-   STUDENT
-   ADMIN
-   SUPER_ADMIN

------------------------------------------------------------------------

# Auth Endpoints

## Register

`POST /auth/register`

Request

``` json
{
  "name":"John Doe",
  "email":"john@example.edu",
  "password":"StrongPassword123",
  "studentId":"CSE001"
}
```

Responses

-   201 Created
-   400 Validation Error
-   409 Duplicate User

------------------------------------------------------------------------

## Login

`POST /auth/login`

Returns

-   JWT
-   User profile
-   Role

------------------------------------------------------------------------

## Logout

`POST /auth/logout`

Invalidates refresh token (future).

------------------------------------------------------------------------

## Profile

`GET /auth/profile`

Returns authenticated user.

------------------------------------------------------------------------

# Orders

## Create Order

`POST /orders`

Requirements

-   Authenticated student
-   Valid files
-   Valid print configuration

------------------------------------------------------------------------

## Get My Orders

`GET /orders`

Supports

-   page
-   limit
-   status
-   search

------------------------------------------------------------------------

## Get Order

`GET /orders/:id`

------------------------------------------------------------------------

## Cancel Order

`PATCH /orders/:id/cancel`

Allowed only before printing starts.

------------------------------------------------------------------------

# Upload

## Upload File

`POST /files/upload`

Content-Type

    multipart/form-data

Supported

-   PDF
-   DOCX
-   PPTX
-   JPG
-   PNG

Validation

-   MIME type
-   Maximum size
-   Virus scanning (future)

------------------------------------------------------------------------

# Pricing

## Calculate

`POST /pricing/calculate`

Request

``` json
{
  "pages":24,
  "copies":2,
  "paperSize":"A4",
  "colour":"BW"
}
```

Returns

``` json
{
  "subtotal":48,
  "tax":2,
  "total":50
}
```

------------------------------------------------------------------------

# Payments

## Create Razorpay Order

`POST /payments/create-order`

Returns

-   Razorpay Order ID
-   Amount
-   Currency

------------------------------------------------------------------------

## Verify Payment

`POST /payments/verify`

Validates Razorpay signature.

Creates order only after verification.

------------------------------------------------------------------------

## Payment History

`GET /payments`

Student receives own history.

Admin receives all.

------------------------------------------------------------------------

# Notifications

## List

`GET /notifications`

## Mark Read

`PATCH /notifications/:id/read`

------------------------------------------------------------------------

# Admin

## Dashboard

`GET /admin/dashboard`

Metrics

-   Revenue
-   Pending
-   Printing
-   Ready
-   Completed

------------------------------------------------------------------------

## Orders

`GET /admin/orders`

Supports

-   search
-   status
-   paymentStatus
-   page
-   limit

------------------------------------------------------------------------

## Update Status

`PATCH /admin/orders/:id/status`

Allowed transitions

PAYMENT_PENDING →

PAID →

QUEUED →

PRINTING →

QUALITY_CHECK →

READY →

COLLECTED

------------------------------------------------------------------------

## Pricing

`GET /admin/pricing`

`PUT /admin/pricing`

Admin only.

------------------------------------------------------------------------

## Users

`GET /admin/users`

`PATCH /admin/users/:id`

`DELETE /admin/users/:id`

Soft delete only.

------------------------------------------------------------------------

# Reports

`GET /admin/reports/daily`

`GET /admin/reports/weekly`

`GET /admin/reports/monthly`

Exports

-   CSV
-   PDF (future)

------------------------------------------------------------------------

# Status Codes

  Code   Meaning
  ------ -----------------------
  200    Success
  201    Created
  400    Validation Error
  401    Unauthorised
  403    Forbidden
  404    Not Found
  409    Conflict
  422    Business Rule Failed
  429    Too Many Requests
  500    Internal Server Error

------------------------------------------------------------------------

# Pagination

Query Parameters

    ?page=1
    &limit=20

Response

``` json
{
 "page":1,
 "limit":20,
 "total":150,
 "pages":8
}
```

------------------------------------------------------------------------

# Filtering

Supported

-   Status
-   Date Range
-   Payment Status
-   Order Number
-   Student

------------------------------------------------------------------------

# Security

-   JWT required for protected APIs
-   HTTPS in production
-   Input validation
-   Rate limiting
-   Role-based access control

------------------------------------------------------------------------

# API Versioning

Current

    /api/v1

Future

    /api/v2

Maintain backward compatibility where possible.

------------------------------------------------------------------------

# Success Criteria

The API is considered complete when every student and administrator
workflow can be performed exclusively through documented REST endpoints
with consistent request validation, responses, authentication, and error
handling.
