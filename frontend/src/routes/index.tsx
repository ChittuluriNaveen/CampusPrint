import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { StudentDashboard } from '../pages/dashboard/StudentDashboard';
import { DocumentManagementPage } from '../pages/documents/DocumentManagementPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { CartPage } from '../pages/cart/CartPage';
import { PaymentHistoryPage } from '../pages/payments/PaymentHistoryPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { DesignSystemOverview } from '../pages/DesignSystemOverview';
import { PlaceholderPage } from '../pages/PlaceholderPage';

// Admin Operations Pages
import { AdminDashboardOverview } from '../pages/admin/AdminDashboardOverview';
import { AdminUserManagementPage } from '../pages/admin/AdminUserManagementPage';
import { AdminOrderManagementPage } from '../pages/admin/AdminOrderManagementPage';
import { AdminQueueManagementPage } from '../pages/admin/AdminQueueManagementPage';
import { AdminPricingConfigPage } from '../pages/admin/AdminPricingConfigPage';
import { AdminPaymentManagementPage } from '../pages/admin/AdminPaymentManagementPage';
import { AdminDocumentManagementPage } from '../pages/admin/AdminDocumentManagementPage';
import { AdminAnalyticsReportsPage } from '../pages/admin/AdminAnalyticsReportsPage';

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
        <Route path="student/notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Admin Dashboard Operations Center Routes */}
        <Route path="admin" element={<AdminDashboardOverview />} />
        <Route path="admin/users" element={<AdminUserManagementPage />} />
        <Route path="admin/orders" element={<AdminOrderManagementPage />} />
        <Route path="admin/queue" element={<AdminQueueManagementPage />} />
        <Route path="admin/pricing" element={<AdminPricingConfigPage />} />
        <Route path="admin/payments" element={<AdminPaymentManagementPage />} />
        <Route path="admin/documents" element={<AdminDocumentManagementPage />} />
        <Route path="admin/reports" element={<AdminAnalyticsReportsPage />} />

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
