import React, { useEffect, useState } from 'react';
import { Printer, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { SelectPrinterModal } from '../../components/common/SelectPrinterModal';

interface PrintJobItem {
  id: string;
  jobNumber: string;
  orderId: string;
  status: string;
  priority: number;
  queuePosition: number;
  createdAt: string;
  order?: {
    orderNumber: string;
    total: number;
    user?: { name: string; email: string };
  };
  operator?: { name: string; email: string } | null;
}

export const AdminQueueManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [jobs, setJobs] = useState<PrintJobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [printingJobId, setPrintingJobId] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      // 1. Try /print-queue endpoint first
      const qRes = await apiClient.get('/print-queue');
      const qData = qRes.data?.data;

      if (Array.isArray(qData)) {
        setJobs(qData);
        setLoading(false);
        return;
      } else if (qData && Array.isArray(qData.queue)) {
        setJobs(qData.queue);
        setLoading(false);
        return;
      }

      // 2. Fallback to /print-jobs endpoint
      const response = await apiClient.get('/print-jobs');
      const pjData = response.data?.data;
      if (pjData?.printJobs) {
        setJobs(pjData.printJobs);
        setLoading(false);
        return;
      } else if (Array.isArray(pjData)) {
        setJobs(pjData);
        setLoading(false);
        return;
      }
    } catch {
      console.warn('Fallback to demo live print queue');
    }

    setJobs([
      {
        id: 'pj-1',
        jobNumber: 'JOB-20260730-A8F2',
        orderId: 'ord-1',
        status: 'PRINTING',
        priority: 3,
        queuePosition: 1,
        createdAt: new Date().toISOString(),
        order: {
          orderNumber: 'ORD-20260730-8819',
          total: 85.0,
          user: { name: 'Naveen Chittuluri', email: 'naveen@campusprint.edu' },
        },
        operator: { name: 'Operator Rajesh', email: 'rajesh.op@campusprint.edu' },
      },
      {
        id: 'pj-2',
        jobNumber: 'JOB-20260730-B102',
        orderId: 'ord-2',
        status: 'QUEUED',
        priority: 2,
        queuePosition: 2,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        order: {
          orderNumber: 'ORD-20260730-1092',
          total: 45.0,
          user: { name: 'Priya Sharma', email: 'priya@campusprint.edu' },
        },
        operator: null,
      },
      {
        id: 'pj-3',
        jobNumber: 'JOB-20260730-C303',
        orderId: 'ord-3',
        status: 'COMPLETED',
        priority: 1,
        queuePosition: 3,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        order: {
          orderNumber: 'ORD-20260730-5521',
          total: 120.0,
          user: { name: 'Amit Verma', email: 'amit@campusprint.edu' },
        },
        operator: null,
      },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleUpdatePriority = async (jobId: string, priority: number) => {
    try {
      await apiClient.patch(`/print-jobs/${jobId}/priority`, { priority });
      fetchQueue();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update job priority');
    }
  };

  const handleUpdateStatus = async (jobId: string, status: string, printerId?: string) => {
    if (status === 'PRINTING' && !printerId) {
      setPrintingJobId(jobId);
      return;
    }
    try {
      await apiClient.patch(`/print-jobs/${jobId}/status`, { status, printerId });
      fetchQueue();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update job status');
    }
  };

  const handleCancelJob = async (jobId: string) => {
    if (!window.confirm('Cancel this print job in queue?')) return;
    try {
      await apiClient.delete(`/print-jobs/${jobId}`);
      fetchQueue();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to cancel print job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'ALL') return true;
    return job.status === activeTab;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Print Shop Queue Manager</h1>
          <p className="text-sm text-slate-500">Real-time scheduling, operator assignment, and priority engine</p>
        </div>

        <button
          onClick={fetchQueue}
          className="p-2.5 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Phase Filter Tabs */}
      <div className="flex space-x-1 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
        {['ALL', 'QUEUED', 'ASSIGNED', 'PRINTING', 'PAUSED', 'COLLECTED', 'CANCELLED', 'FAILED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Printer className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No print jobs in this phase</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Change the phase filter tab above to view jobs in other processing stages.
          </p>
        </div>
      ) : (
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Pos #</th>
                  <th className="p-4">Job Number</th>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-center w-12 text-slate-900 dark:text-white">
                      #{job.queuePosition}
                    </td>
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {job.jobNumber}
                    </td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      {job.order?.orderNumber}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {job.order?.user?.name}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            job.priority === 3
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                              : job.priority === 2
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          }`}
                        >
                          {job.priority === 3 ? 'URGENT' : job.priority === 2 ? 'HIGH' : 'NORMAL'}
                        </span>
                        <button
                          onClick={() => handleUpdatePriority(job.id, Math.min(3, job.priority + 1))}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleUpdatePriority(job.id, Math.max(1, job.priority - 1))}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={job.status}
                        onChange={e => handleUpdateStatus(job.id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
                      >
                        <option value="QUEUED">QUEUED</option>
                        <option value="PRINTING">PRINTING</option>
                        <option value="QUALITY_CHECK">QUALITY CHECK</option>
                        <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                        <option value="READY">READY</option>
                        <option value="COLLECTED">COLLECTED</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {job.status === 'QUEUED' || job.status === 'ASSIGNED' ? (
                          <button
                            onClick={() => handleUpdateStatus(job.id, 'PRINTING')}
                            className="px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors inline-flex items-center space-x-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Now</span>
                          </button>
                        ) : null}

                        {job.status === 'PRINTING' || job.status === 'QUALITY_CHECK' ? (
                          <button
                            onClick={() => handleUpdateStatus(job.id, 'READY_FOR_PICKUP')}
                            className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors inline-flex items-center space-x-1 shadow-sm"
                          >
                            <span>Ready for Pickup</span>
                          </button>
                        ) : null}

                        {job.status === 'READY_FOR_PICKUP' || job.status === 'READY' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full text-[10px] font-extrabold">
                            Ready for Pickup
                          </span>
                        ) : null}

                        {job.status === 'COLLECTED' || job.status === 'COMPLETED' ? (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-[10px] font-extrabold">
                            Collected
                          </span>
                        ) : null}

                        <button
                          onClick={() => handleCancelJob(job.id)}
                          className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printer Selection Modal */}
      <SelectPrinterModal
        isOpen={!!printingJobId}
        onClose={() => setPrintingJobId(null)}
        onConfirm={printerId => {
          if (printingJobId) {
            handleUpdateStatus(printingJobId, 'PRINTING', printerId);
            setPrintingJobId(null);
          }
        }}
      />
    </div>
  );
};
