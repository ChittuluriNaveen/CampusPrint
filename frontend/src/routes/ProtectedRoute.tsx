import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'ADMIN' | 'SUPER_ADMIN' | 'STUDENT' | 'OPERATOR';
  allowedRoles?: Array<'STUDENT' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallbackRedirect = user.role === 'STUDENT' ? '/student' : '/admin/queue';
    return <Navigate to={fallbackRedirect} replace />;
  }

  if (requiredRole && requiredRole === 'ADMIN' && user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN' && user?.role !== 'OPERATOR') {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
};
