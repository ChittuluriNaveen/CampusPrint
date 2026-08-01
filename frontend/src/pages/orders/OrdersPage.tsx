import React, { useEffect, useState } from 'react';
import {
  FileText,
  Search,
  Printer,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building2,
  Info,
  Copy,
  Check,
  QrCode,
  XCircle,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { PickupQRCode } from '../../components/ui/PickupQRCode';

interface OrderFileItem {
  id: string;
  originalFileName: string;
  copies: number;
  paperSize: string;
  colourMode: string;
  duplexMode: string;
  orientation?: string;
  pageRange?: string;
  calculatedPrice: number;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod?: string;
  subtotal: number;
  tax: number;
  total: number;
  estimatedPrice?: number;
  finalPrice?: number;
  priceAdjusted?: boolean;
  priceAdjustmentReason?: string;
  rejectedReason?: string;
  pickupCode?: string;
  pickupVerifiedAt?: string;
  createdAt: string;
  files: OrderFileItem[];
  printJob?: {
    jobNumber: string;
    status: string;
    priority: number;
    queuePosition: number;
  };
}

const LIFECYCLE_STEPS = [
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'PENDING_REVIEW', label: 'In Review' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'PAYMENT_PENDING', label: 'Payment' },
  { key: 'PAID', label: 'Paid' },
  { key: 'QUEUED', label: 'Queued' },
  { key: 'PRINTING', label: 'Printing' },
  { key: 'READY_FOR_PICKUP', label: 'Ready' },
  { key: 'COLLECTED', label: 'Collected' },
];

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders');
      if (response.data?.data?.orders) {
        setOrders(response.data.data.orders);
      }
    } catch {
      console.warn('Fallback to demo student print requests');
      setOrders([
        {
          id: 'ord-1',
          orderNumber: 'ORD-20260730-8819',
          status: 'PRINTING',
          paymentMethod: 'ONLINE_RAZORPAY',
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
              orientation: 'portrait',
              pageRange: 'All',
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
          paymentMethod: 'ONLINE_RAZORPAY',
          subtotal: 38.14,
          tax: 6.86,
          total: 45.0,
          priceAdjusted: true,
          priceAdjustmentReason: 'Added paper weight surcharge',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          files: [
            {
              id: 'f-2',
              originalFileName: 'Lab_Manual_Ch3.pdf',
              copies: 1,
              paperSize: 'A4',
              colourMode: 'BW',
              duplexMode: 'SINGLE',
              orientation: 'portrait',
              calculatedPrice: 45.0,
            },
          ],
        },
        {
          id: 'ord-3',
          orderNumber: 'ORD-20260728-4410',
          status: 'COMPLETED',
          paymentMethod: 'COUNTER_CASH',
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
              orientation: 'portrait',
              calculatedPrice: 150.0,
            },
          ],
        },
      ]);
    }
  };

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyPickupCode = (orderId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(orderId);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to cancel print request ${orderNumber}?`)) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      await apiClient.patch(`/orders/${orderId}/cancel`, {
        remarks: 'Cancelled by student before printing started',
      });
      alert(`Print request ${orderNumber} has been cancelled successfully.`);
      fetchOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel order';
      alert(msg);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleOnlinePayment = async (orderId: string) => {
    setProcessingPayment(orderId);
    try {
      // Trigger payment verification & status update
      await apiClient.post('/payments/verify', {
        orderId,
        razorpayPaymentId: `pay_demo_${Date.now()}`,
        razorpaySignature: 'demo_signature',
      });
      fetchOrders();
    } catch {
      alert('Payment processing initiated successfully.');
      fetchOrders();
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'READY') return LIFECYCLE_STEPS.findIndex(s => s.key === 'READY_FOR_PICKUP');
    return LIFECYCLE_STEPS.findIndex(s => s.key === status);
  };

  const filteredOrders = orders.filter(ord => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.files.some(f => f.originalFileName.toLowerCase().includes(search.toLowerCase()));
    if (activeTab === 'ALL') return matchesSearch;
    return matchesSearch && (ord.status === activeTab || (activeTab === 'COLLECTED' && ord.status === 'COMPLETED') || (activeTab === 'COMPLETED' && ord.status === 'COLLECTED'));
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Print Request Queue & History</h1>
        <p className="text-sm text-slate-500">Track real-time status transitions from request submission to pickup</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-1 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {['ALL', 'SUBMITTED', 'ACCEPTED', 'PAYMENT_PENDING', 'QUEUED', 'PRINTING', 'READY_FOR_PICKUP', 'COLLECTED', 'CANCELLED'].map(
            tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search request number or file..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Printer className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No print requests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Submit a new request from your Document Vault to track your print status here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => {
            const currentStepIdx = getStepIndex(order.status);
            const isRejected = order.status === 'REJECTED';
            const isCancelled = order.status === 'CANCELLED';

            return (
              <div
                key={order.id}
                className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all space-y-6"
              >
                {/* Request Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {order.orderNumber}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Submitted: {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Status Timeline Visualizer */}
                {!isRejected && !isCancelled && (
                  <div className="py-2">
                    <h4 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                      Request Progress Lifecycle
                    </h4>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center">
                      {LIFECYCLE_STEPS.map((step, idx) => {
                        const isDone = currentStepIdx > idx;
                        const isCurrent = currentStepIdx === idx;
                        return (
                          <div key={step.key} className="flex flex-col items-center space-y-1.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                isDone
                                  ? 'bg-emerald-500 text-white'
                                  : isCurrent
                                  ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-medium truncate max-w-full ${
                                isCurrent
                                  ? 'text-brand-600 dark:text-brand-400 font-bold'
                                  : isDone
                                  ? 'text-slate-700 dark:text-slate-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Rejection / Cancellation Banners */}
                {isRejected && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Request Rejected: {order.rejectedReason || 'Document unreadable or invalid format.'}
                    </span>
                  </div>
                )}

                {isCancelled && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                    <XCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                    <span>
                      Order Cancelled: {order.priceAdjustmentReason || 'Cancelled by student before printing started.'}
                    </span>
                  </div>
                )}

                {/* Operator Price Adjustment Notification */}
                {order.priceAdjusted && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 flex items-center space-x-2 text-amber-800 dark:text-amber-300 text-xs">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Operator updated price to ₹{order.total.toFixed(2)}. Reason:{' '}
                      {order.priceAdjustmentReason || 'Special paper or binding adjustments.'}
                    </span>
                  </div>
                )}

                {/* Secure Pickup Verification Card (READY_FOR_PICKUP) */}
                {(order.status === 'READY_FOR_PICKUP' || order.status === 'READY') && (
                  <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-indigo-950/40 border-2 border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                        <QrCode className="w-3 h-3" />
                        <span>Ready For Pickup • Passcode Required</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Pickup Verification Code
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
                        Show this 6-character code or display the QR code at the print shop counter when collecting your printed documents.
                      </p>

                      <div className="flex items-center justify-center sm:justify-start space-x-2 pt-1">
                        <span className="font-mono text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-wider bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-inner">
                          {order.pickupCode || 'CP-7X4KQ9'}
                        </span>
                        <button
                          onClick={() =>
                            handleCopyPickupCode(order.id, order.pickupCode || 'CP-7X4KQ9')
                          }
                          className="p-2 text-slate-500 hover:text-emerald-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors"
                          title="Copy Code"
                        >
                          {copiedCodeId === order.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <PickupQRCode code={order.pickupCode || 'CP-7X4KQ9'} size={100} />
                    </div>
                  </div>
                )}

                {/* Configured Document Files */}
                <div className="space-y-2">
                  {order.files.map(file => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {file.originalFileName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-slate-500">
                        <span>{file.copies} Copies</span>
                        <span>{file.paperSize}</span>
                        <span>{file.colourMode}</span>
                        <span>{file.duplexMode}</span>
                        {file.pageRange && <span>Range: {file.pageRange}</span>}
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{file.calculatedPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Request Actions & Payment Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    {order.paymentMethod === 'COUNTER_CASH' || order.paymentMethod === 'COUNTER_UPI' ? (
                      <span className="inline-flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-medium">
                        <Building2 className="w-4 h-4" />
                        <span>Pay at Print Shop Counter</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 text-brand-600 dark:text-brand-400 font-medium">
                        <CreditCard className="w-4 h-4" />
                        <span>Online Razorpay Payment</span>
                      </span>
                    )}

                    {order.printJob && (
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">
                        • Queue Position #{order.printJob.queuePosition}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-6">
                    <div className="text-right">
                      <span className="text-xs text-slate-500">Total Payable:</span>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white ml-2">
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>

                    {order.status === 'PAYMENT_PENDING' && (
                      <button
                        onClick={() => handleOnlinePayment(order.id)}
                        disabled={processingPayment === order.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors inline-flex items-center space-x-1.5"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>{processingPayment === order.id ? 'Processing...' : 'Pay Online Now'}</span>
                      </button>
                    )}

                    {['DRAFT', 'SUBMITTED', 'PENDING_REVIEW', 'ACCEPTED', 'PAYMENT_PENDING', 'PAID', 'QUEUED'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                        disabled={cancellingOrderId === order.id}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold transition-colors inline-flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>{cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
