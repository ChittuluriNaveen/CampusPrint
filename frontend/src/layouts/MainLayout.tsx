import React from 'react';
import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🖨️</span>
            <span className="font-bold text-xl tracking-tight text-blue-700">CampusPrint</span>
          </div>
          <div className="text-sm font-medium text-gray-500">
            System Foundation v1.0.0
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto p-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CampusPrint — Campus Printing Management System. All rights reserved.
      </footer>
    </div>
  );
};
