import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  ShoppingCart,
  Upload,
  PlusCircle,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface DashboardStats {
  totalDocuments: number;
  activeOrders: number;
  completedOrders: number;
  pendingPayments: number;
  totalSpent: number;
  cartItemCount: number;
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  department: string | null;
  year: number | null;
  avatar: string | null;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  files: Array<{ originalFileName: string; copies: number }>;
  printJob?: { jobNumber: string; status: string; priority: number };
}

interface RecentDocument {
  id: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  pageCount: number;
  createdAt: string;
}

export const StudentDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    activeOrders: 0,
    completedOrders: 0,
    pendingPayments: 0,
    totalSpent: 0,
    cartItemCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users/dashboard/summary');
      if (response.data?.data) {
        const data = response.data.data;
        setProfile(data.studentProfile);
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setRecentDocuments(data.recentDocuments || []);
      }
    } catch {
      console.warn('Using default demo student dashboard metrics');
      setProfile({
        id: 'demo-student-id',
        name: 'Naveen Chittuluri',
        email: 'naveen.student@campusprint.edu',
        studentId: 'STU-2026-8819',
        department: 'Computer Science & Engineering',
        year: 4,
        avatar: null,
      });
      setStats({
        totalDocuments: 8,
        activeOrders: 2,
        completedOrders: 14,
        pendingPayments: 1,
        totalSpent: 420.5,
        cartItemCount: 3,
      });
      setRecentOrders([
        {
          id: 'ord-1',
          orderNumber: 'ORD-20260730-8819',
          status: 'PRINTING',
          total: 85.0,
          createdAt: new Date().toISOString(),
          files: [{ originalFileName: 'Algorithm_Design_Report.pdf', copies: 2 }],
          printJob: { jobNumber: 'JOB-20260730-A8F2', status: 'PRINTING', priority: 2 },
        },
        {
          id: 'ord-2',
          orderNumber: 'ORD-20260730-1092',
          status: 'PAYMENT_PENDING',
          total: 45.0,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          files: [{ originalFileName: 'Lab_Manual_Ch3.pdf', copies: 1 }],
        },
      ]);
      setRecentDocuments([
        {
          id: 'doc-1',
          originalFileName: 'Algorithm_Design_Report.pdf',
          mimeType: 'application/pdf',
          size: 2450000,
          pageCount: 18,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'doc-2',
          originalFileName: 'Lab_Manual_Ch3.pdf',
          mimeType: 'application/pdf',
          size: 1120000,
          pageCount: 9,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRINTING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Printing</span>;
      case 'QUEUED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Queued</span>;
      case 'READY':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Ready for Pickup</span>;
      case 'COLLECTED':
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Collected</span>;
      case 'PAYMENT_PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">Payment Due</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Print Portal Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {profile?.name || 'Student'}! 👋
            </h1>
            <p className="text-primary-100 text-sm max-w-xl">
              {profile?.department || 'Department of Engineering'} • Student ID:{' '}
              <span className="font-semibold text-white">{profile?.studentId || 'STU-2026'}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all"
              title="Refresh Dashboard Metrics"
            >
              <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/student/documents"
              className="inline-flex items-center justify-center space-x-2 bg-white text-primary-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-50 transition-all shadow-md hover:shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Documents
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">
            {stats.totalDocuments}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 inline-block">
            Stored in Cloud
          </span>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Orders
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-amber-600 dark:text-amber-400">
            {stats.activeOrders}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 inline-block">
            In Print Queue
          </span>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-emerald-600 dark:text-emerald-400">
            {stats.completedOrders}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 inline-block">
            Collected Print Jobs
          </span>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Due
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-rose-600 dark:text-rose-400">
            {stats.pendingPayments}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 inline-block">
            Awaiting Checkout
          </span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Spent
            </span>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3 text-purple-600 dark:text-purple-400">
            ₹{stats.totalSpent.toFixed(2)}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 inline-block">
            Lifetime Print Spend
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/student/documents"
          className="flex items-center space-x-3 p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Upload Files</h3>
            <p className="text-xs text-slate-500">PDF, DOCX, PNG</p>
          </div>
        </Link>

        <Link
          to="/student/orders"
          className="flex items-center space-x-3 p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">New Order</h3>
            <p className="text-xs text-slate-500">Configure Specs</p>
          </div>
        </Link>

        <Link
          to="/student/cart"
          className="flex items-center space-x-3 p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform relative">
            <ShoppingCart className="w-5 h-5" />
            {stats.cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {stats.cartItemCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">My Cart</h3>
            <p className="text-xs text-slate-500">{stats.cartItemCount} Items Ready</p>
          </div>
        </Link>

        <Link
          to="/student/payments"
          className="flex items-center space-x-3 p-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Payments</h3>
            <p className="text-xs text-slate-500">Receipts & History</p>
          </div>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Tracker */}
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Print Orders</h2>
              <p className="text-xs text-slate-500">Live order progress and processing queue</p>
            </div>
            <Link
              to="/student/orders"
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No active print orders</p>
              <p className="text-xs text-slate-500 mt-1">Upload a document to configure your first print order.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-sm">
                      📄 {order.files?.[0]?.originalFileName || 'Document Package'}
                      {order.files?.length > 1 ? ` (+${order.files.length - 1} more)` : ''}
                    </p>
                    {order.printJob && (
                      <span className="inline-block text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                        Job: {order.printJob.jobNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{order.total.toFixed(2)}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/student/orders`}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Documents */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Documents</h2>
              <p className="text-xs text-slate-500">Cloud file storage</p>
            </div>
            <Link
              to="/student/documents"
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentDocuments.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No documents stored</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {doc.originalFileName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {doc.pageCount} Pages • {(doc.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
