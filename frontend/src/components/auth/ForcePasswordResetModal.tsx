import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/apiClient';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { KeyRound, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForcePasswordResetModal: React.FC = () => {
  const { user, clearMustChangePassword, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('TempPass@123');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user || !user.mustChangePassword) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one digit.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.patch('/users/password', {
        currentPassword,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        clearMustChangePassword();
      }, 1200);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || 'Failed to update password. Please verify current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <Card className="w-full max-w-md shadow-2xl border-amber-500/30 dark:border-amber-500/20 bg-white dark:bg-slate-900">
        <CardHeader className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">
            Action Required: Set New Password
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Your account was provisioned with a default temporary password. Please set your personal secure password to continue.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {success ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Password Updated Successfully!</h4>
              <p className="text-xs text-slate-500">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current / Default Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="TempPass@123"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Secure Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 chars, 1 uppercase, 1 number"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={logout}
                >
                  Log Out
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
                  isLoading={loading}
                >
                  <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                  Save & Continue
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
