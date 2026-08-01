import React, { useEffect, useState } from 'react';
import {
  Printer,
  PrintQueueItem,
  PrinterDashboardSummary,
  assignPrinterToQueueJob,
  createPrinter,
  getPrintQueue,
  getPrinterDashboard,
  getPrinterReports,
  pauseQueueJob,
  resumeQueueJob,
  updatePrinterStatus,
  updateQueuePriority,
} from '../../services/printer.service';
import { SelectPrinterModal } from '../../components/common/SelectPrinterModal';

export const AdminPrinterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'FLEET' | 'ANALYTICS'>('QUEUE');

  // Dashboard Data State
  const [summary, setSummary] = useState<PrinterDashboardSummary | null>(null);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [queueItems, setQueueItems] = useState<PrintQueueItem[]>([]);
  const [reports, setReports] = useState<any | null>(null);
  const [printingQueueItem, setPrintingQueueItem] = useState<PrintQueueItem | null>(null);

  // Filters State
  const [queueStatusFilter, setQueueStatusFilter] = useState<string>('');
  const [queuePriorityFilter, setQueuePriorityFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<PrintQueueItem | null>(null);
  const [targetPrinterId, setTargetPrinterId] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');

  // Add Printer Form State
  const [newPrinter, setNewPrinter] = useState({
    name: '',
    code: '',
    printerType: 'LASER',
    manufacturer: 'HP',
    model: 'LaserJet Enterprise',
    supportedPaperSizes: ['A4'],
    supportedColorModes: ['BW'],
    supportedDuplex: true,
    location: 'Central Print Hub - Room 101',
    maxDailyCapacity: 2500,
  });

  const fetchData = async () => {
    try {
      const [dashRes, queueRes, reportRes] = await Promise.all([
        getPrinterDashboard(),
        getPrintQueue({
          status: queueStatusFilter || undefined,
          priority: queuePriorityFilter || undefined,
          search: searchQuery || undefined,
        }),
        getPrinterReports(),
      ]);

      if (dashRes.success) {
        setSummary(dashRes.data.summary);
        setPrinters(dashRes.data.printersList);
      }
      if (queueRes.success) {
        setQueueItems(queueRes.data);
      }
      if (reportRes.success) {
        setReports(reportRes.data);
      }
    } catch (err) {
      console.error('Failed to load printer management data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [queueStatusFilter, queuePriorityFilter, searchQuery]);

  const handleStatusToggle = async (printerId: string, currentStatus: string, isMaint: boolean) => {
    try {
      const nextStatus = currentStatus === 'MAINTENANCE' ? 'ONLINE' : 'MAINTENANCE';
      await updatePrinterStatus(printerId, nextStatus, !isMaint);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update printer status');
    }
  };

  const handleCreatePrinter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPrinter(newPrinter);
      setShowAddModal(false);
      setNewPrinter({
        name: '',
        code: '',
        printerType: 'LASER',
        manufacturer: 'HP',
        model: 'LaserJet Enterprise',
        supportedPaperSizes: ['A4'],
        supportedColorModes: ['BW'],
        supportedDuplex: true,
        location: 'Central Print Hub - Room 101',
        maxDailyCapacity: 2500,
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create printer');
    }
  };

  const handleManualAssign = async () => {
    if (!selectedQueueItem || !targetPrinterId) return;
    try {
      await assignPrinterToQueueJob(selectedQueueItem.id, targetPrinterId, overrideReason);
      setShowAssignModal(false);
      setSelectedQueueItem(null);
      setTargetPrinterId('');
      setOverrideReason('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reassign printer');
    }
  };

  const handlePriorityChange = async (queueId: string, priority: string) => {
    try {
      await updateQueuePriority(queueId, priority);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update priority');
    }
  };

  const handlePauseToggle = async (item: PrintQueueItem) => {
    try {
      if (item.paused) {
        await resumeQueueJob(item.id);
      } else {
        const reason = prompt('Enter reason for pausing print queue job:', 'Maintenance override');
        if (reason) {
          await pauseQueueJob(item.id, reason);
        }
      }
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle pause state');
    }
  };

  const handleExportCSV = () => {
    if (!reports?.printerUtilizationReport) return;
    const headers = ['Printer Name', 'Code', 'Daily Pages Printed', 'Capacity', 'Utilization Rate %', 'Status'];
    const rows = reports.printerUtilizationReport.map((r: any) => [
      `"${r.printerName}"`,
      `"${r.printerCode}"`,
      r.dailyPrintedPages,
      r.dailyCapacity,
      `${r.utilizationRatePct}%`,
      r.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Printer_Utilization_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              🖨️
            </span>
            Printer Management & Intelligent Queue
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor printer fleet health, balance print workloads, and manage priority queues in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium border border-slate-700 transition"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
          >
            ➕ Add New Printer
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fleet Size</p>
            <p className="text-2xl font-bold text-white mt-1">{summary.totalPrinters}</p>
            <p className="text-xs text-blue-400 mt-1">{summary.onlinePrinters} Online / {summary.offlinePrinters} Offline</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Queue Workload</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{summary.queueLength}</p>
            <p className="text-xs text-slate-400 mt-1">{summary.jobsWaiting} Waiting / {summary.jobsPrinting} Printing</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fleet Utilization</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{summary.printerUtilization}%</p>
            <p className="text-xs text-slate-400 mt-1">Daily Capacity Balance</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Wait Time</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{summary.averageWaitMinutes} min</p>
            <p className="text-xs text-slate-400 mt-1">Auto-Estimated Queue Delay</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 col-span-2 md:col-span-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Today</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{summary.jobsCompletedToday}</p>
            <p className="text-xs text-slate-400 mt-1">Print Jobs Fulfilled</p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('QUEUE')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'QUEUE'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Intelligent Queue ({queueItems.length})
        </button>
        <button
          onClick={() => setActiveTab('FLEET')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'FLEET'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🖥️ Printer Fleet ({printers.length})
        </button>
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'ANALYTICS'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Performance Reports
        </button>
      </div>

      {/* TAB 1: INTELLIGENT QUEUE */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search order # or student name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:border-blue-500"
              />
              <select
                value={queueStatusFilter}
                onChange={e => setQueueStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="QUEUED">QUEUED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="PRINTING">PRINTING</option>
                <option value="PAUSED">PAUSED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
              <select
                value={queuePriorityFilter}
                onChange={e => setQueuePriorityFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="URGENT">🔴 URGENT</option>
                <option value="HIGH">🟠 HIGH</option>
                <option value="NORMAL">🔵 NORMAL</option>
                <option value="LOW">⚪ LOW</option>
              </select>
            </div>
          </div>

          {/* Queue Table */}
          <div className="bg-slate-800/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-4">Order / Student</th>
                  <th className="py-3 px-4">Specs & Files</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Printer</th>
                  <th className="py-3 px-4">Queue Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {queueItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No jobs currently in print queue.
                    </td>
                  </tr>
                ) : (
                  queueItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">#{item.queuePosition}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{item.order?.orderNumber}</p>
                        <p className="text-slate-400 text-[11px]">{item.order?.user?.name || 'Student'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {item.order?.files?.map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-slate-300">
                              <span className="text-[10px] bg-slate-700 px-1.5 rounded text-blue-300">{f.paperSize}</span>
                              <span className="text-[10px] bg-slate-700 px-1.5 rounded text-amber-300">{f.colourMode}</span>
                              <span className="text-slate-400">{f.originalFileName} ({f.pageCount}p × {f.copies})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={item.priority}
                          onChange={e => handlePriorityChange(item.id, e.target.value)}
                          className={`text-[11px] font-bold px-2 py-1 rounded border focus:outline-none ${
                            item.priority === 'URGENT'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : item.priority === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : item.priority === 'NORMAL'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-slate-700 text-slate-300 border-slate-600'
                          }`}
                        >
                          <option value="URGENT">URGENT</option>
                          <option value="HIGH">HIGH</option>
                          <option value="NORMAL">NORMAL</option>
                          <option value="LOW">LOW</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        {item.assignedPrinter ? (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <div>
                              <p className="font-semibold text-slate-200">{item.assignedPrinter.name}</p>
                              <p className="text-[10px] text-slate-400">{item.assignedPrinter.code}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned (Auto-matching...)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            item.status === 'ASSIGNED'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : item.status === 'PRINTING'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : item.status === 'PAUSED'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-700 text-slate-300 border-slate-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setPrintingQueueItem(item)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold shadow transition"
                        >
                          🖨️ Print
                        </button>
                        <button
                          onClick={() => {
                            setSelectedQueueItem(item);
                            setShowAssignModal(true);
                          }}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px]"
                        >
                          ⇄ Reassign
                        </button>
                        <button
                          onClick={() => handlePauseToggle(item)}
                          className={`px-2.5 py-1 rounded text-[11px] ${
                            item.paused
                              ? 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50'
                              : 'bg-amber-600/30 text-amber-300 hover:bg-amber-600/50'
                          }`}
                        >
                          {item.paused ? '▶ Resume' : '⏸ Pause'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRINTER FLEET */}
      {activeTab === 'FLEET' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {printers.map(printer => (
            <div
              key={printer.id}
              className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4 shadow-lg hover:border-slate-600 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{printer.name}</h3>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {printer.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {printer.manufacturer} {printer.model} • {printer.location || 'Hub'}
                  </p>
                </div>
                <button
                  onClick={() => handleStatusToggle(printer.id, printer.status, printer.isMaintenanceMode)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                    printer.status === 'ONLINE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : printer.status === 'MAINTENANCE'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  }`}
                >
                  {printer.status}
                </button>
              </div>

              {/* Capability Chips */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded">
                  Paper: {printer.supportedPaperSizes.join(', ')}
                </span>
                <span className="bg-purple-900/40 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded">
                  Color: {printer.supportedColorModes.join(', ')}
                </span>
                <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded">
                  Duplex: {printer.supportedDuplex ? 'Yes' : 'No'}
                </span>
              </div>

              {/* Utilization Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Daily Utilization</span>
                  <span>
                    {printer.currentDailyCount} / {printer.maxDailyCapacity} pages ({printer.utilizationPct || 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (printer.utilizationPct || 0) > 85
                        ? 'bg-rose-500'
                        : (printer.utilizationPct || 0) > 60
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, printer.utilizationPct || 0)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ANALYTICS & REPORTS */}
      {activeTab === 'ANALYTICS' && reports && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="font-bold text-white text-lg">Printer Performance Audit & Utilization</h2>
              <p className="text-slate-400 text-xs">Generate and export utilization reports for maintenance and cost accounting.</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-2"
            >
              📥 Export CSV Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Utilization Breakdown Table */}
            <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-4">
              <h3 className="font-semibold text-white text-sm mb-3">Printer Capacity & Utilization</h3>
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="pb-2">Printer Name</th>
                    <th className="pb-2">Daily Count</th>
                    <th className="pb-2">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {reports.printerUtilizationReport?.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-medium text-white">{r.printerName}</td>
                      <td className="py-2.5">{r.dailyPrintedPages} / {r.dailyCapacity}</td>
                      <td className="py-2.5 font-bold text-emerald-400">{r.utilizationRatePct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audit History Log */}
            <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-4">
              <h3 className="font-semibold text-white text-sm mb-3">Recent Queue Audit Activity</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {reports.recentQueueHistory?.map((h: any) => (
                  <div key={h.id} className="p-2 bg-slate-900/60 border border-slate-800 rounded text-xs">
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>{h.performedBy}</span>
                      <span>{new Date(h.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-200 mt-1 font-medium">{h.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW PRINTER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Add New Printer to Fleet</h2>
            <form onSubmit={handleCreatePrinter} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Printer Name</label>
                <input
                  type="text"
                  required
                  value={newPrinter.name}
                  onChange={e => setNewPrinter({ ...newPrinter, name: e.target.value })}
                  placeholder="e.g. HP LaserJet Enterprise"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Printer Code</label>
                  <input
                    type="text"
                    required
                    value={newPrinter.code}
                    onChange={e => setNewPrinter({ ...newPrinter, code: e.target.value })}
                    placeholder="PRN-005"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Printer Type</label>
                  <select
                    value={newPrinter.printerType}
                    onChange={e => setNewPrinter({ ...newPrinter, printerType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="LASER">LASER</option>
                    <option value="INKJET">INKJET</option>
                    <option value="DIGITAL_MULTIFUNCTION">DIGITAL_MULTIFUNCTION</option>
                    <option value="PLOTTER">PLOTTER</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={newPrinter.manufacturer}
                    onChange={e => setNewPrinter({ ...newPrinter, manufacturer: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Daily Capacity</label>
                  <input
                    type="number"
                    value={newPrinter.maxDailyCapacity}
                    onChange={e => setNewPrinter({ ...newPrinter, maxDailyCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-medium shadow-lg"
                >
                  Create Printer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANUAL PRINTER REASSIGNMENT */}
      {showAssignModal && selectedQueueItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Manual Printer Reassignment Override</h2>
            <p className="text-xs text-slate-400">
              Reassign order <span className="text-blue-400 font-semibold">{selectedQueueItem.order?.orderNumber}</span> to a specific printer fleet target.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Target Printer</label>
                <select
                  value={targetPrinterId}
                  onChange={e => setTargetPrinterId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Printer --</option>
                  {printers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code}) — {p.status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Override Reason</label>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  placeholder="e.g. Urgent student request / maintenance reroute"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleManualAssign}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded font-medium shadow-lg"
                >
                  Confirm Reassign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Select Printer Modal for Starting Print */}
      <SelectPrinterModal
        isOpen={!!printingQueueItem}
        onClose={() => setPrintingQueueItem(null)}
        onConfirm={printerId => {
          if (printingQueueItem) {
            assignPrinterToQueueJob(
              printingQueueItem.id,
              printerId,
              'Printer selected by operator to start printing'
            ).then(() => fetchData());
            setPrintingQueueItem(null);
          }
        }}
      />
    </div>
  );
};

export default AdminPrinterPage;
