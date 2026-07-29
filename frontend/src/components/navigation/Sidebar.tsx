import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Clock,
  Settings,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  items?: SidebarItem[];
  className?: string;
}

const defaultStudentItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/student', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'New Upload', path: '/student/upload', icon: <FileText className="w-4 h-4" /> },
  { label: 'Order History', path: '/orders', icon: <Clock className="w-4 h-4" /> },
  { label: 'Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
  { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  items = defaultStudentItems,
  className = '',
}) => {
  return (
    <aside
      className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      <div className="p-4 flex-1 flex flex-col justify-between">
        <nav className="space-y-1.5">
          {items.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {!isCollapsed && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-semibold">
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>Need Print Support?</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-[11px]">
                Visit print desk or email support@campusprint.edu
              </p>
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
