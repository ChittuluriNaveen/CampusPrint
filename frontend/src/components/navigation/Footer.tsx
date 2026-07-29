import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">CampusPrint</span>
          <span>— Production-Grade Printing Management System</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Privacy Policy
          </a>
          <a href="/support" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Support Desk
          </a>
        </div>
      </div>
    </footer>
  );
};
