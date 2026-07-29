# 🖨️ CampusPrint

> **A Production-Grade Campus Printing Management System**

CampusPrint is a modern, scalable, and secure web application that digitises the document printing workflow for educational institutions. Students can upload documents, customise print settings, make secure online payments, and track their print orders in real time, while administrators manage print queues, pricing, reports, and operational analytics from a unified dashboard.

This project is designed following modern software engineering principles and serves as both a production-ready application and a comprehensive academic software engineering project.

---

# 📖 Table of Contents

- Overview
- Features
- Technology Stack
- System Architecture
- Project Structure
- Documentation
- Getting Started
- Development Workflow
- Testing
- Deployment
- Security
- Roadmap
- Contributing
- AI Development
- License

---

# 🚀 Overview

CampusPrint replaces traditional manual print request systems with a fully digital workflow.

Students can:

- Upload documents
- Configure print settings
- Preview pricing
- Pay online
- Track order progress
- Download invoices
- View order history

Administrators can:

- Manage print queues
- Process orders
- Configure pricing
- Manage users
- View analytics
- Generate reports
- Monitor system health

---

# ✨ Key Features

## Student Portal

- Secure Authentication
- Document Upload
- Multiple File Support
- Print Configuration
- Live Price Calculation
- Razorpay Integration
- Order Tracking
- Notifications
- Profile Management
- Order History
- Invoice Download

---

## Admin Portal

- Dashboard
- Queue Management
- User Management
- Pricing Management
- Order Processing
- Reports
- Analytics
- Refund Management
- Activity Logs
- System Monitoring

---

## Platform Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- File Upload Validation
- Secure Payment Verification
- RESTful APIs
- Audit Logging
- Responsive UI
- Accessibility Support
- Production Monitoring
- Disaster Recovery Planning

---

# 🏗 System Architecture

```text
                React Frontend
                       │
                       ▼
                 Express REST API
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
 Authentication   Order Engine   Payment Engine
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                  MongoDB Database
```

---

# 🛠 Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

---

## Backend

- Node.js
- Express.js

---

## Database

- MongoDB

---

## Authentication

- JWT
- bcrypt

---

## Payments

- Razorpay

---

## File Uploads

- Multer

---

## Development Tools

- Git
- GitHub
- Docker
- ESLint
- Prettier
- Husky
- GitHub Actions

---

# 📂 Project Structure

```text
CampusPrint/
│
├── AGENTS.md
├── TASKS.md
├── IMPLEMENTATION_PLAN.md
├── CONTRIBUTING.md
├── README.md
│
├── docs/
│   ├── 01_Project_Vision.md
│   ├── 02_Business_Requirements.md
│   ├── ...
│   └── 45_Project_Handover_Guide.md
│
├── frontend/
│
├── backend/
│
├── infrastructure/
│
├── scripts/
│
└── .github/
```

---

# 📚 Documentation

The `/docs` directory contains the complete project documentation.

It includes:

- Business Requirements
- Functional Requirements
- Architecture
- Database Design
- API Specification
- Authentication
- Payment System
- File Management
- Order Workflow
- UI/UX Guidelines
- Design System
- Testing Strategy
- Deployment Guide
- Security Documentation
- Threat Model
- Monitoring
- DevOps
- Maintenance
- Project Handover

A total of **45 professional documents** describe every aspect of the system.

---

# ⚙ Getting Started

## Prerequisites

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

---

## Clone Repository

```bash
git clone https://github.com/your-org/CampusPrint.git

cd CampusPrint
```

---

## Install Dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

---

## Configure Environment

Create a `.env` file for the backend.

Example:

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=
```

---

## Start Development

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

# 🧪 Testing

The project follows a multi-level testing strategy.

- Unit Testing
- Integration Testing
- API Testing
- End-to-End Testing
- Accessibility Testing
- Security Testing
- Performance Testing

Refer to:

```
docs/18_Testing_Strategy.md
```

---

# 🚀 Deployment

Deployment documentation is available in:

```
docs/19_Deployment_Guide.md
```

Additional operational documents include:

- Monitoring & Observability
- DevOps Runbook
- Infrastructure as Code
- Disaster Recovery
- Release Management
- Maintenance Guide

---

# 🔒 Security

CampusPrint follows security best practices including:

- JWT Authentication
- Password Hashing
- Role-Based Access Control
- Input Validation
- Secure File Uploads
- HTTPS
- Audit Logging
- Threat Modelling
- Security Checklist

For complete details see:

```
docs/26_Security_Checklist.md
```

---

# 📈 Roadmap

Current roadmap includes:

- Core Printing Workflow
- Payment Integration
- Student Dashboard
- Admin Dashboard
- Analytics
- Monitoring
- Performance Optimisation

Future enhancements:

- AI Print Recommendations
- OCR Improvements
- Printer Integration
- Native Mobile Application
- Multi-Campus Support
- Kubernetes Deployment

---

# 🤝 Contributing

Please read:

```
CONTRIBUTING.md
```

before submitting pull requests.

---

# 🤖 AI Development

This repository is designed for AI-assisted development.

AI coding agents should begin with:

```
AGENTS.md
```

Implementation order:

```
TASKS.md
```

Dependency graph:

```
IMPLEMENTATION_PLAN.md
```

The documentation in `/docs` is the **single source of truth**.

---

# 📄 License

This project is intended for educational and production use.

Choose an appropriate licence before public distribution (for example, MIT or Apache 2.0).

---

# 👨‍💻 Project Status

**Current Status:** Documentation Complete (45/45)

Next Phase:

- Repository Setup
- Core Development
- Feature Implementation
- Testing
- Production Deployment

---

## ⭐ Acknowledgements

CampusPrint has been designed following modern software engineering practices with a strong emphasis on:

- Scalability
- Maintainability
- Security
- Accessibility
- Performance
- Clean Architecture
- AI-assisted Development
- Production Readiness