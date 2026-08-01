import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Printer, Sun, Moon, Menu, LogIn, LogOut, User, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import { NotificationBell } from './NotificationBell';

export interface NavbarProps {
  onToggleMobileMenu?: () => void;
  portalName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, portalName = 'Student Portal' }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = isAuthenticated
    ? [
        {
          label: user?.name || 'User Profile',
          onClick: () => navigate('/settings'),
          icon: <Avatar name={user?.name || 'User'} size="sm" />,
        },
        { label: 'Settings', onClick: () => navigate('/settings'), icon: <Settings className="w-4 h-4" /> },
        { label: 'Sign Out', onClick: handleSignOut, danger: true, icon: <LogOut className="w-4 h-4" /> },
      ]
    : [
        { label: 'Sign In', onClick: () => navigate('/login'), icon: <LogIn className="w-4 h-4" /> },
        { label: 'Register', onClick: () => navigate('/register'), icon: <User className="w-4 h-4" /> },
      ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="p-2 bg-brand-600 text-white rounded-lg group-hover:bg-brand-700 transition-colors shadow-sm">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">
                Campus<span className="text-brand-600 dark:text-brand-500">Print</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] ml-2 font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {portalName}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </Button>

          <NotificationBell />

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {isAuthenticated ? (
            <Dropdown
              trigger={
                <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Avatar name={user?.name || 'Student'} size="sm" />
                </button>
              }
              items={userMenuItems}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 rounded-lg transition-colors border border-brand-200 dark:border-brand-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
