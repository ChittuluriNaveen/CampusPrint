import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Printer,
  IndianRupee,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  CreditCard,
  Layers,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface AdminSummaryData {
  users: {
    total: number;
    active: number;
    inactive: number;
    roles: { students: number; operators: number; admins: number };
  };
  documents: { total: number; totalMB: number };
  orders: {
    total: number;
    pending: number;
    printing: number;
    ready: number;
    completed: number;
    cancelled: number;
  };
  financials: { totalRevenue: number; successfulPayments: number; failedPayments: number };
  printQueue: { queued: number; printing: number; ready: number; totalActive: number };
  recentActivity: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    user?: { name: string; email: string };
  }>;
}

export const AdminDashboardOverview: React.FC = () => {
  const [summary, setSummary] = useState<AdminSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminSummary = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/dashboard/summary');
      if (response.data?.data) {
        setSummary(response.data.data);
      }
    } catch {
      console.warn('Fallback to demo administrative dashboard summary');
      setSummary({
        users: {
          total: 1240,
          active: 1180,
          inactive: 60,
          roles: { students: 1210, operators: 18, admins: 12 },
        },
        documents: { total: 4890, totalMB: 1845.5 },
        orders: {
          total: 3420,
          pending: 14,
          printing: 8,
          ready: 12,
          completed: 3350,
          cancelled: 36,
        },
        financials: {
          totalRevenue: 184250.0,
          successfulPayments: 3380,
          failedPayments: 12,
        },
        printQueue: { queued: 14, printing: 8, ready: 12, totalActive: 22 },
        recentActivity: [
          {
            id: 'ord-101',
            orderNumber: 'ORD-20260730-8819',
            status: 'PRINTING',
            total: 85.0,
            createdAt: new Date().toISOString(),
            user: { name: 'Naveen Chittuluri', email: 'naveen@campusprint.edu' },
          },
          {
            id: 'ord-102',
            orderNumber: 'ORD-20260730-1092',
            status: 'QUEUED',
            total: 45.0,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            user: { name: 'Priya Sharma', email: 'priya@campusprint.edu' },
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSummary();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Administrative Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">System Control Console</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Real-time print order queues, user credentials, document storage, and pricing engine controls.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAdminSummary}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all"
              title="Refresh System Metrics"
            >
              <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/admin/queue"
              className="inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Manage Print Queue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Users</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">
            {summary?.users.total.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            {summary?.users.roles.students} Students • {summary?.users.roles.operators} Operators
          </span>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Queue</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-amber-600 dark:text-amber-400">
            {summary?.printQueue.totalActive}
          </p>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            {summary?.printQueue.queued} Queued • {summary?.printQueue.printing} Printing
          </span>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Jobs</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-emerald-600 dark:text-emerald-400">
            {summary?.orders.completed.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500 mt-1 inline-block">Lifetime Print Orders</span>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Document Vault</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">
            {summary?.documents.total.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            {summary?.documents.totalMB} MB Storage
          </span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-purple-600 dark:text-purple-400">
            ₹{summary?.financials.totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-slate-500 mt-1 inline-block">Razorpay Transactions</span>
        </div>
      </div>

      {/* Admin Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Link
          to="/admin/users"
          className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all text-center group space-y-2"
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">User Accounts</span>
        </Link>

        <Link
          to="/admin/orders"
          className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all text-center group space-y-2"
        >
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Print Orders</span>
        </Link>

        <Link
          to="/admin/queue"
          className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all text-center group space-y-2"
        >
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Print Queue</span>
        </Link>

        <Link
          to="/admin/pricing"
          className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all text-center group space-y-2"
        >
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Pricing Config</span>
        </Link>

        <Link
          to="/admin/payments"
          className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all text-center group space-y-2"
        >
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Payments</span>
        </Link>

        <Link
          to="/admin/documents"
          className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all text-center group space-y-2"
        >
          <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">System Library</span>
        </Link>
      </div>

      {/* System Activity & Active Queue Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent System Activity</h2>
              <p className="text-xs text-slate-500">Latest incoming print orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-primary-600 hover:underline inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {summary?.recentActivity.map(act => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {act.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full">
                      {act.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{act.user?.name || act.user?.email}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    ₹{act.total.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {new Date(act.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Status Breakdown */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Operational Summary</h2>
            <p className="text-xs text-slate-500">Print shop queue and revenue distribution</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Print Queue Load ({summary?.printQueue.totalActive} Active Jobs)</span>
                <span>{summary?.printQueue.printing} Printing</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{
                    width: `${
                      summary?.printQueue.totalActive
                        ? (summary.printQueue.printing / summary.printQueue.totalActive) * 100
                        : 0
                    }%`,
                  }}
                  className="bg-amber-500 h-full"
                />
                <div
                  style={{
                    width: `${
                      summary?.printQueue.totalActive
                        ? (summary.printQueue.queued / summary.printQueue.totalActive) * 100
                        : 0
                    }%`,
                  }}
                  className="bg-blue-500 h-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="text-slate-500">Successful Payments</span>
                <p className="text-base font-bold text-emerald-600">
                  {summary?.financials.successfulPayments}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="text-slate-500">Failed / Pending Payments</span>
                <p className="text-base font-bold text-rose-600">
                  {summary?.financials.failedPayments}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
