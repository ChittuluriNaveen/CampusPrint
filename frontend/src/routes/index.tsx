import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DesignSystemOverview } from '../pages/DesignSystemOverview';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DesignSystemOverview />} />
        <Route
          path="login"
          element={
            <PlaceholderPage
              title="Student & Admin Authentication Login"
              description="User authentication, JWT token handling, and role-based login forms will be implemented in Phase 03."
              category="Authentication"
            />
          }
        />
        <Route
          path="register"
          element={
            <PlaceholderPage
              title="Student Registration"
              description="Institutional student account registration and email verification will be implemented in Phase 03."
              category="Authentication"
            />
          }
        />
        <Route
          path="student"
          element={
            <PlaceholderPage
              title="Student Print Portal & Quick Upload"
              description="Student document upload drawer, live print cost calculator, and active order tracker."
              category="Student Portal"
            />
          }
        />
        <Route
          path="admin"
          element={
            <PlaceholderPage
              title="Admin Queue & Operations Dashboard"
              description="Real-time print shop queue manager, job printer assignment, price configurator, and analytics."
              category="Admin Portal"
            />
          }
        />
        <Route
          path="profile"
          element={
            <PlaceholderPage
              title="User Account Profile"
              description="Student ID, institutional credentials, department, and contact information management."
              category="Account"
            />
          }
        />
        <Route
          path="orders"
          element={
            <PlaceholderPage
              title="Print Order History & Receipts"
              description="Complete list of past print requests, payment receipts, invoice PDF downloads, and re-order triggers."
              category="Orders"
            />
          }
        />
        <Route
          path="settings"
          element={
            <PlaceholderPage
              title="System & Theme Settings"
              description="Theme preferences, notification options, and institutional print parameters."
              category="Settings"
            />
          }
        />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page Not Found (404)"
              description="The requested page route is not available."
              category="Navigation"
            />
          }
        />
      </Route>
    </Routes>
  );
};
