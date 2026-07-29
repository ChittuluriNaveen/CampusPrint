import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { MobileMenu } from '../components/navigation/MobileMenu';
import { Footer } from '../components/navigation/Footer';
import { LayoutDashboard, FileText, Clock, Settings, User } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Student Portal', path: '/student', icon: <User className="w-4 h-4" /> },
    { label: 'Admin Portal', path: '/admin', icon: <FileText className="w-4 h-4" /> },
    { label: 'Order History', path: '/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={navItems}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          items={navItems}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
