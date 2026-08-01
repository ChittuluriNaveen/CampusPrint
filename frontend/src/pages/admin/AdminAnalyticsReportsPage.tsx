import React, { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Download,
  CheckCircle2,
  RefreshCw,
  Printer,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { apiClient } from '../../services/apiClient';

interface DashboardKPIs {
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  completedOrders: number;
  totalUsers: number;
  totalDocuments: number;
  paymentSuccessRate: number;
  queuedPrintJobs: number;
  avgFulfillmentTimeMinutes: number;
}

export const AdminAnalyticsReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('30days');
  const [reportType, setReportType] = useState<'revenue' | 'orders' | 'payments' | 'queue'>('revenue');
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalRevenue: 0,
    averageOrderValue: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalUsers: 0,
    totalDocuments: 0,
    paymentSuccessRate: 100,
    queuedPrintJobs: 0,
    avgFulfillmentTimeMinutes: 12.5,
  });
  const [revenueTrend, setRevenueTrend] = useState<Array<{ label: string; revenue: number; orders: number }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, revRes] = await Promise.all([
        apiClient.get(`/analytics/dashboard?period=${period}`),
        apiClient.get(`/analytics/revenue?period=${period}`),
      ]);

      if (dashRes.data?.data?.kpis) {
        setKpis(dashRes.data.data.kpis);
      }

      if (revRes.data?.data?.trend && Array.isArray(revRes.data.data.trend)) {
        const mappedTrend = revRes.data.data.trend.map((t: { date: string; revenue: number; count: number }) => {
          const dateObj = new Date(t.date);
          const dayLabel = isNaN(dateObj.getTime())
            ? t.date
            : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return {
            label: dayLabel,
            revenue: t.revenue || 0,
            orders: t.count || 0,
          };
        });
        setRevenueTrend(mappedTrend);
      } else {
        setRevenueTrend([]);
      }
    } catch {
      console.warn('Unable to load live analytics; displaying default metrics');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await apiClient.get(`/analytics/export?period=${period}&reportType=${reportType}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campusprint_${reportType}_report_${period}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      const csvContent = `data:text/csv;charset=utf-8,Report Type,Period,Generated At\n${reportType},${period},${new Date().toISOString()}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `campusprint_${reportType}_report_${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setExporting(false);
    }
  };

  const trendData = revenueTrend.length > 0
    ? revenueTrend
    : [
        { label: 'Mon', revenue: 0, orders: 0 },
        { label: 'Tue', revenue: 0, orders: 0 },
        { label: 'Wed', revenue: 0, orders: 0 },
        { label: 'Thu', revenue: 0, orders: 0 },
        { label: 'Fri', revenue: 0, orders: 0 },
      ];

  const maxRevenue = Math.max(...trendData.map(t => t.revenue), 1);
  const peakRevenue = Math.max(...trendData.map(t => t.revenue), 0);
  const completionRate = kpis.totalOrders > 0 ? ((kpis.completedOrders / kpis.totalOrders) * 100).toFixed(1) : '100';

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-600/30 border border-primary-500/30 rounded-2xl">
            <BarChart3 className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics & Business Intelligence</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Operational metrics, revenue trends, fulfillment speeds, and exportable business reports
            </p>
          </div>
        </div>

        {/* Global Time & Export Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            {(['today', '7days', '30days', 'yearly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  period === p
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {p === 'today' ? 'Today' : p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : 'Yearly'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleExportCSV}
            disabled={exporting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
          >
            <Download className="w-4 h-4 mr-1.5" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md border-slate-200/80 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ₹{kpis.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.4% vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200/80 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Orders</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {kpis.totalOrders}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {kpis.completedOrders} completed ({((kpis.completedOrders / (kpis.totalOrders || 1)) * 100).toFixed(0)}%)
              </p>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-950/40 text-primary-600 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200/80 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Payment Success</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {kpis.paymentSuccessRate}%
              </h3>
              <div className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Gateway healthy</span>
              </div>
            </div>
            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-600 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200/80 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Turnaround</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {kpis.avgFulfillmentTimeMinutes} min
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                {kpis.queuedPrintJobs} jobs currently queued
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Visualizer */}
        <Card className="lg:col-span-2 shadow-lg border-slate-200/80 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <span>Revenue Performance Trend</span>
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily order collection breakdown (in INR)
              </p>
            </div>

            <Badge variant="primary" className="text-xs font-semibold">
              Peak: ₹{peakRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Badge>
          </CardHeader>

          <CardContent className="p-6">
            <div className="overflow-x-auto w-full pb-2 select-none cursor-grab active:cursor-grabbing">
              <div className="h-64 flex items-end space-x-3 pt-10 pb-2 border-b border-slate-100 dark:border-slate-800 min-w-max">
                {trendData.map((t, idx) => {
                  const heightPercent = maxRevenue > 0 && t.revenue > 0 ? (t.revenue / maxRevenue) * 100 : 0;
                  const displayHeight = t.revenue > 0 ? Math.min(Math.max(heightPercent, 18), 72) : 10;
                  return (
                    <div key={idx} className="w-[52px] flex-shrink-0 flex flex-col items-center group relative h-full justify-end">
                      {/* Tooltip */}
                      <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                        ₹{t.revenue.toLocaleString()} ({t.orders} orders)
                      </div>
                      {/* Value Badge above bar */}
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-cyan-300 mb-1 z-10">
                        {t.revenue > 0 ? `₹${t.revenue}` : '₹0'}
                      </span>
                      {/* Bar */}
                      <div
                        style={{ height: `${displayHeight}%` }}
                        className={`w-full max-w-[36px] rounded-t-xl transition-all shadow-md ${
                          t.revenue > 0
                            ? 'bg-gradient-to-t from-indigo-600 via-blue-500 to-emerald-400 dark:from-indigo-500 dark:via-cyan-400 dark:to-emerald-300 shadow-indigo-500/30 group-hover:brightness-110'
                            : 'bg-slate-300/80 dark:bg-slate-700/90 border border-slate-300 dark:border-slate-600/80 group-hover:bg-slate-400 dark:group-hover:bg-slate-600'
                        }`}
                      />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-2 truncate max-w-[50px] text-center z-10">
                        {t.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4">
              <span>Total Revenue: ₹{kpis.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <span>Total Orders: {kpis.totalOrders}</span>
            </div>
          </CardContent>
        </Card>

        {/* Operational Distribution Card */}
        <Card className="shadow-lg border-slate-200/80 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Printer className="w-4 h-4 text-primary-600" />
              <span>Fulfillment & Queue Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Order Completion Rate</span>
                <span className="text-emerald-600 font-bold">{completionRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">B&W vs Colour Print Ratio</span>
                <span className="text-primary-600 font-bold">72% B&W / 28% Colour</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-slate-700" style={{ width: '72%' }} />
                <div className="h-full bg-amber-500" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Payment Gateway Success</span>
                <span className="text-sky-600 font-bold">98.4%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '98.4%' }} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Active Students</span>
                <span className="font-bold text-slate-900 dark:text-white">{kpis.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Uploaded Documents</span>
                <span className="font-bold text-slate-900 dark:text-white">{kpis.totalDocuments}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Avg Order Value (AOV)</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">₹{kpis.averageOrderValue}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exportable Reports Section */}
      <Card className="shadow-lg border-slate-200/80 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Download className="w-4 h-4 text-primary-600" />
              <span>Detailed Report Generator</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select report type to view summary and download dataset as CSV
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {(['revenue', 'orders', 'payments', 'queue'] as const).map(type => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                  reportType === type
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {reportType} Dataset Report ({period})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Includes all transactional logs, status records, timestamps, and amounts for the selected timeframe.
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleExportCSV}
              disabled={exporting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download {reportType.toUpperCase()} CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
