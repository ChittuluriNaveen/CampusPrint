import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Printer, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const user = await login({ email: email.trim(), password });
      success(`Welcome back, ${user.name}!`);

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    } catch (err: unknown) {
      const errorMessage = typeof err === 'string' ? err : err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fillTestAdmin = () => {
    setEmail('admin@campusprint.edu');
    setPassword('Admin@123456');
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-500/30">
            <Printer className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in to <span className="text-brand-600 dark:text-brand-500">CampusPrint</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access your printing account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-start space-x-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Institutional Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@campusprint.edu"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Preset Test Login Quick Action */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-center text-slate-500 mb-3">Quick Fill Demo Accounts</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillTestAdmin}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Fill Admin Credentials</span>
            </button>
          </div>
        </div>

        {/* Registration Link */}
        <div className="text-center text-xs text-slate-600 dark:text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};
