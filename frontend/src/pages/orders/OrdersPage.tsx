import React, { useEffect, useState } from 'react';
import { FileText, Search, Printer } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface OrderItem {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  files: Array<{
    id: string;
    originalFileName: string;
    copies: number;
    paperSize: string;
    colourMode: string;
    duplexMode: string;
    calculatedPrice: number;
  }>;
  printJob?: {
    jobNumber: string;
    status: string;
    priority: number;
    queuePosition: number;
  };
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders');
      if (response.data?.data?.orders) {
        setOrders(response.data.data.orders);
      }
    } catch {
      console.warn('Fallback to demo student print orders');
      setOrders([
        {
          id: 'ord-1',
          orderNumber: 'ORD-20260730-8819',
          status: 'PRINTING',
          subtotal: 72.03,
          tax: 12.97,
          total: 85.0,
          createdAt: new Date().toISOString(),
          files: [
            {
              id: 'f-1',
              originalFileName: 'Algorithm_Design_Report.pdf',
              copies: 2,
              paperSize: 'A4',
              colourMode: 'COLOUR',
              duplexMode: 'DOUBLE',
              calculatedPrice: 85.0,
            },
          ],
          printJob: {
            jobNumber: 'JOB-20260730-A8F2',
            status: 'PRINTING',
            priority: 2,
            queuePosition: 1,
          },
        },
        {
          id: 'ord-2',
          orderNumber: 'ORD-20260730-1092',
          status: 'PAYMENT_PENDING',
          subtotal: 38.14,
          tax: 6.86,
          total: 45.0,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          files: [
            {
              id: 'f-2',
              originalFileName: 'Lab_Manual_Ch3.pdf',
              copies: 1,
              paperSize: 'A4',
              colourMode: 'BW',
              duplexMode: 'SINGLE',
              calculatedPrice: 45.0,
            },
          ],
        },
        {
          id: 'ord-3',
          orderNumber: 'ORD-20260728-4410',
          status: 'COLLECTED',
          subtotal: 127.12,
          tax: 22.88,
          total: 150.0,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          files: [
            {
              id: 'f-3',
              originalFileName: 'Full_Project_Documentation.pdf',
              copies: 3,
              paperSize: 'A4',
              colourMode: 'BW',
              duplexMode: 'DOUBLE',
              calculatedPrice: 150.0,
            },
          ],
        },
      ]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRINTING':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Printing in Progress</span>;
      case 'QUEUED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Queued</span>;
      case 'READY':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Ready at Counter</span>;
      case 'COLLECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Collected</span>;
      case 'PAYMENT_PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">Payment Pending</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(ord => {
    const matchesSearch = ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.files.some(f => f.originalFileName.toLowerCase().includes(search.toLowerCase()));
    if (activeTab === 'ALL') return matchesSearch;
    return matchesSearch && ord.status === activeTab;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Print Orders & History</h1>
        <p className="text-sm text-slate-500">Track real-time queue position and status for all submitted orders</p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-1 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-1 rounded-xl overflow-x-auto">
          {['ALL', 'PAYMENT_PENDING', 'QUEUED', 'PRINTING', 'READY', 'COLLECTED'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order number or file..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Printer className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No print orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Configure your paper, binding, and color preferences to create a new print order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <span className="text-xs text-slate-500">
                  Submitted: {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Order Files */}
              <div className="space-y-2">
                {order.files.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <FileText className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {file.originalFileName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-500">
                      <span>{file.copies} Copies</span>
                      <span>{file.paperSize}</span>
                      <span>{file.colourMode}</span>
                      <span>{file.duplexMode}</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{file.calculatedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Specs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                {order.printJob ? (
                  <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl text-xs text-indigo-700 dark:text-indigo-300 font-mono">
                    <span>Job #{order.printJob.jobNumber}</span>
                    <span>•</span>
                    <span>Queue Position #{order.printJob.queuePosition}</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">Standard Campus Printer Desk</div>
                )}

                <div className="flex items-center justify-between sm:justify-end space-x-6">
                  <div className="text-right">
                    <span className="text-xs text-slate-500">Total (Incl. 18% GST):</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white ml-2">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
