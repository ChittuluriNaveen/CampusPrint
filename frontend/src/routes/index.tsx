import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { StudentDashboard } from '../pages/dashboard/StudentDashboard';
import { DocumentManagementPage } from '../pages/documents/DocumentManagementPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { CartPage } from '../pages/cart/CartPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { PaymentHistoryPage } from '../pages/payments/PaymentHistoryPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { DesignSystemOverview } from '../pages/DesignSystemOverview';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProtectedRoute } from './ProtectedRoute';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Admin Operations Pages
import { AdminDashboardOverview } from '../pages/admin/AdminDashboardOverview';
import { AdminUserManagementPage } from '../pages/admin/AdminUserManagementPage';
import { AdminOrderManagementPage } from '../pages/admin/AdminOrderManagementPage';
import { AdminQueueManagementPage } from '../pages/admin/AdminQueueManagementPage';
import { AdminPricingConfigPage } from '../pages/admin/AdminPricingConfigPage';
import { AdminPaymentManagementPage } from '../pages/admin/AdminPaymentManagementPage';
import { AdminDocumentManagementPage } from '../pages/admin/AdminDocumentManagementPage';
import { AdminAnalyticsReportsPage } from '../pages/admin/AdminAnalyticsReportsPage';
import { AdminInventoryPage } from '../pages/admin/AdminInventoryPage';
import { AdminPrinterPage } from '../pages/admin/AdminPrinterPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Authentication Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="design-system" element={<DesignSystemOverview />} />

        {/* Protected Student Portal Routes */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/student" replace />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="student/documents" element={<DocumentManagementPage />} />
          <Route path="student/orders" element={<OrdersPage />} />
          <Route path="student/cart" element={<CartPage />} />
          <Route path="student/checkout" element={<CheckoutPage />} />
          <Route path="student/payments" element={<PaymentHistoryPage />} />
          <Route path="student/notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Protected Operator & Admin Shared Operations Routes */}
        <Route element={<ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN', 'SUPER_ADMIN']} />}>
          <Route path="admin/orders" element={<AdminOrderManagementPage />} />
          <Route path="admin/queue" element={<AdminQueueManagementPage />} />
          <Route path="admin/documents" element={<AdminDocumentManagementPage />} />
          <Route path="admin/inventory" element={<AdminInventoryPage />} />
          <Route path="admin/printers" element={<AdminPrinterPage />} />
        </Route>

        {/* Protected Admin & Super Admin Management Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
          <Route path="admin" element={<AdminDashboardOverview />} />
          <Route path="admin/users" element={<AdminUserManagementPage />} />
          <Route path="admin/pricing" element={<AdminPricingConfigPage />} />
          <Route path="admin/payments" element={<AdminPaymentManagementPage />} />
          <Route path="admin/reports" element={<AdminAnalyticsReportsPage />} />
        </Route>

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
