# CampusPrint User & Administrator Guide

## Overview

Welcome to **CampusPrint**! This guide provides detailed instructions for students using the print portal and administrators managing campus printing operations.

---

## Part 1: Student Guide

### 1. Student Registration & Login
1. Navigate to `https://campusprint.edu/register`.
2. Enter your Full Name, Campus Email (`student@campus.edu`), Student ID, Department, and Password.
3. Upon registration, log in at `/login` to access your student portal dashboard.

### 2. Uploading Print Documents
1. Click **Upload Document** on your dashboard navigation bar.
2. Select your document file (`.pdf`, `.docx`, `.doc`, `.png`, `.jpg`).
3. Click **Upload**. The system will scan page counts and store your document securely in your private Document Vault.

### 3. Configuring Print Settings & Previewing Costs
1. In your Document Vault, click **Print Configuration**.
2. Select your print specifications:
   - **Paper Size:** A4, A3, Letter, or Legal.
   - **Color Mode:** Black & White (₹2.00/page) or Colour (₹18.00/page).
   - **Duplex Mode:** Single-Sided or Double-Sided.
   - **Copies:** 1 to 50.
   - **Finishing Options:** Spiral Binding (+₹20.00), Lamination (+₹15.00), or Cover Page (+₹10.00).
3. The system dynamically updates item price and tax calculations in real time.

### 4. Checkout & Razorpay Online Payment
1. Click **Add to Cart** and proceed to **Checkout**.
2. Review order subtotal, GST tax (18%), and final payable amount.
3. Click **Pay with Razorpay**. Complete online payment via UPI, Credit/Debit Card, or Net Banking.
4. Upon successful payment, your order status automatically transitions to `QUEUED` and an order confirmation number (`ORD-YYYYMMDD-XXXX`) is issued.

### 5. Tracking Order Status & Pickup
1. Track progress on your **My Orders** screen:
   - ⏳ **QUEUED**: Order received and awaiting operator processing.
   - 🖨️ **PRINTING**: Document is actively printing at the print center.
   - 🔍 **QUALITY_CHECK**: Print job complete and undergoing quality inspection.
   - ✅ **READY**: Order ready for pickup at the campus printing counter.
   - 📦 **COLLECTED**: Order picked up by student.
2. Show your Order Number or QR Code at the counter to collect your prints.

---

## Part 2: Administrator & Operator Guide

### 1. Operator Print Queue Management
1. Operators log into `/admin/dashboard` or `/operator/queue`.
2. View active incoming print jobs sorted by priority and order timestamp.
3. Click **Start Printing** to update job status to `PRINTING`.
4. Once completed, click **Mark Ready** to trigger an automated in-app notification to the student.

### 2. Managing Dynamic Pricing Rules
1. Navigate to **Admin Settings** -> **Pricing Management**.
2. Adjust base per-page rates for B&W, Colour, paper sizes, and finishing add-ons.
3. Click **Save Pricing Rules** to apply updated rates system-wide.

### 3. Viewing Analytics & Exporting CSV Reports
1. Navigate to **Admin Dashboard** -> **Analytics & Reports**.
2. View real-time KPI metrics: Total Revenue, Average Order Value (AOV), Total Print Orders, and Queue Turnaround Time.
3. Filter by date ranges (`Today`, `7 Days`, `30 Days`, `Yearly`).
4. Click **Download CSV Report** to export financial and operational datasets for auditing.
