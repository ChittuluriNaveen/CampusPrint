import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { MobileMenu } from '../components/navigation/MobileMenu';
import { Footer } from '../components/navigation/Footer';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Printer,
  ShoppingCart,
  CreditCard,
  Settings,
  Users,
  Layers,
  DollarSign,
  BarChart3,
  ListOrdered,
  Boxes,
} from 'lucide-react';

import { ForcePasswordResetModal } from '../components/auth/ForcePasswordResetModal';

export const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = user?.role || 'STUDENT';

  const studentNavItems = [
    { label: 'Student Dashboard', path: '/student', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Document Vault', path: '/student/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Print Orders', path: '/student/orders', icon: <Printer className="w-4 h-4" /> },
    { label: 'Shopping Cart', path: '/student/cart', icon: <ShoppingCart className="w-4 h-4" /> },
    { label: 'Payment Receipts', path: '/student/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const operatorNavItems = [
    { label: 'Printers & Queue', path: '/admin/printers', icon: <Printer className="w-4 h-4" /> },
    { label: 'Live Print Queue', path: '/admin/queue', icon: <Layers className="w-4 h-4" /> },
    { label: 'Order Management', path: '/admin/orders', icon: <ListOrdered className="w-4 h-4" /> },
    { label: 'Document Desk', path: '/admin/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Inventory & Supplies', path: '/admin/inventory', icon: <Boxes className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const adminNavItems = [
    { label: 'Admin Desk Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Printers & Queue', path: '/admin/printers', icon: <Printer className="w-4 h-4" /> },
    { label: 'Live Print Queue', path: '/admin/queue', icon: <Layers className="w-4 h-4" /> },
    { label: 'Order Management', path: '/admin/orders', icon: <ListOrdered className="w-4 h-4" /> },
    { label: 'Document Desk', path: '/admin/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Inventory & Supplies', path: '/admin/inventory', icon: <Boxes className="w-4 h-4" /> },
    { label: 'User Directory', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Pricing Matrix', path: '/admin/pricing', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Payment Ledger', path: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Analytics & Reports', path: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const superAdminNavItems = [
    { label: 'Admin Desk Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Printers & Queue', path: '/admin/printers', icon: <Printer className="w-4 h-4" /> },
    { label: 'Live Print Queue', path: '/admin/queue', icon: <Layers className="w-4 h-4" /> },
    { label: 'Order Management', path: '/admin/orders', icon: <ListOrdered className="w-4 h-4" /> },
    { label: 'Document Desk', path: '/admin/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Inventory & Supplies', path: '/admin/inventory', icon: <Boxes className="w-4 h-4" /> },
    { label: 'User Directory', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Pricing Matrix', path: '/admin/pricing', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Payment Ledger', path: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Analytics & Reports', path: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const currentNavItems =
    role === 'SUPER_ADMIN'
      ? superAdminNavItems
      : role === 'ADMIN'
      ? adminNavItems
      : role === 'OPERATOR'
      ? operatorNavItems
      : studentNavItems;

  const currentPortalName =
    role === 'SUPER_ADMIN'
      ? 'Super Admin Portal'
      : role === 'ADMIN'
      ? 'Admin Desk'
      : role === 'OPERATOR'
      ? 'Print Operator Desk'
      : 'Student Portal';

  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 transition-colors">
      <ForcePasswordResetModal />
      <Navbar portalName={currentPortalName} onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={currentNavItems}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          items={currentNavItems}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
