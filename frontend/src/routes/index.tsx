import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { StudentDashboard } from '../pages/dashboard/StudentDashboard';
import { DocumentManagementPage } from '../pages/documents/DocumentManagementPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { CartPage } from '../pages/cart/CartPage';
import { PaymentHistoryPage } from '../pages/payments/PaymentHistoryPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { DesignSystemOverview } from '../pages/DesignSystemOverview';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Default redirect to Student Portal */}
        <Route index element={<Navigate to="/student" replace />} />
        
        {/* Student Self-Service Dashboard Routes */}
        <Route path="student" element={<StudentDashboard />} />
        <Route path="student/documents" element={<DocumentManagementPage />} />
        <Route path="student/orders" element={<OrdersPage />} />
        <Route path="student/cart" element={<CartPage />} />
        <Route path="student/payments" element={<PaymentHistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Design System Reference */}
        <Route path="design-system" element={<DesignSystemOverview />} />

        {/* Authentication Placeholders */}
        <Route
          path="login"
          element={
            <PlaceholderPage
              title="Student & Admin Authentication Login"
              description="User authentication, JWT token handling, and role-based login forms."
              category="Authentication"
            />
          }
        />
        <Route
          path="register"
          element={
            <PlaceholderPage
              title="Student Registration"
              description="Institutional student account registration and email verification."
              category="Authentication"
            />
          }
        />

        {/* Admin Desk Placeholder */}
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

        {/* Catch-all 404 Route */}
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
