import React, { useEffect, useState } from 'react';
import {
  FileText,
  Search,
  Printer,
  RefreshCw,
  CheckCircle,
  XCircle,
  DollarSign,
  Building2,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { SelectPrinterModal } from '../../components/common/SelectPrinterModal';

interface AdminOrderItem {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod?: string;
  subtotal: number;
  tax: number;
  total: number;
  priceAdjusted?: boolean;
  priceAdjustmentReason?: string;
  rejectedReason?: string;
  pickupCode?: string;
  pickupVerificationAttempts?: number;
  remarks?: string;
  createdAt: string;
  user?: { name: string; email: string; studentId?: string };
  files?: Array<{
    id: string;
    originalFileName: string;
    copies: number;
    paperSize: string;
    colourMode: string;
    duplexMode: string;
    orientation?: string;
    pageRange?: string;
    calculatedPrice: number;
  }>;
}

export const AdminOrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('SUBMITTED');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [rejectOrder, setRejectOrder] = useState<AdminOrderItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [adjustOrder, setAdjustOrder] = useState<AdminOrderItem | null>(null);
  const [newTotal, setNewTotal] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState('');
  const [printingOrderId, setPrintingOrderId] = useState<string | null>(null);

  const [verifyPickupOrder, setVerifyPickupOrder] = useState<AdminOrderItem | null>(null);
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'MANUAL_CODE' | 'QR_CODE'>('MANUAL_CODE');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/orders', {
        params: {
          search: search || undefined,
          status: activeTab !== 'ALL' && activeTab !== 'SUBMITTED' ? activeTab : undefined,
        },
      });
      if (response.data?.data?.orders) {
        setOrders(response.data.data.orders);
      }
    } catch {
      console.warn('Fallback to demo admin order desk');
      setOrders([
        {
          id: 'ord-1',
          orderNumber: 'ORD-20260730-8819',
          status: 'PRINTING',
          subtotal: 75.0,
          tax: 10.0,
          total: 85.0,
          createdAt: new Date().toISOString(),
          user: { name: 'Naveen Chittuluri', email: 'naveen@campusprint.edu', studentId: 'CS202601' },
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
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleUpdateStatus = async (orderId: string, newStatus: string, printerId?: string) => {
    if (newStatus === 'PRINTING' && !printerId) {
      setPrintingOrderId(orderId);
      return;
    }
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus, printerId });
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const handleAcceptRequest = async (orderId: string) => {
    try {
      await apiClient.patch(`/admin/orders/${orderId}/review`, { action: 'ACCEPT' });
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to accept print request');
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectOrder) return;
    try {
      await apiClient.patch(`/admin/orders/${rejectOrder.id}/review`, {
        action: 'REJECT',
        reason: rejectReason || 'Rejected by print shop operator.',
      });
      setRejectOrder(null);
      setRejectReason('');
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to reject request');
    }
  };

  const handleConfirmPriceAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustOrder || !newTotal || !adjustReason) return;
    try {
      await apiClient.patch(`/admin/orders/${adjustOrder.id}/adjust-price`, {
        newTotal: parseFloat(newTotal),
        reason: adjustReason,
      });
      setAdjustOrder(null);
      setNewTotal('');
      setAdjustReason('');
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to adjust price');
    }
  };

  const handleConfirmCounterPayment = async (orderId: string, amount: number) => {
    try {
      await apiClient.post(`/admin/orders/${orderId}/record-payment`, {
        paymentMethod: 'COUNTER_CASH',
        amount,
      });
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to record payment');
    }
  };

  const handleConfirmVerifyPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPickupOrder || !pickupCodeInput.trim()) return;
    setVerifying(true);
    setVerifyError(null);
    try {
      await apiClient.post(`/admin/orders/${verifyPickupOrder.id}/verify-pickup`, {
        pickupCode: pickupCodeInput.trim(),
        method: verificationMethod,
      });
      setVerifyPickupOrder(null);
      setPickupCodeInput('');
      fetchOrders();
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : 'Invalid pickup code verification');
    } finally {
      setVerifying(false);
    }
  };

  const filteredOrders = orders.filter(ord => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      ord.user?.email.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'ALL') return matchesSearch;
    return matchesSearch && (
      ord.status === activeTab ||
      (activeTab === 'SUBMITTED' && ord.status === 'PENDING_REVIEW') ||
      (activeTab === 'COLLECTED' && ord.status === 'COMPLETED') ||
      (activeTab === 'COMPLETED' && ord.status === 'COLLECTED')
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Print Shop Operator Desk</h1>
          <p className="text-sm text-slate-500">Review incoming print requests, adjust pricing, and manage queue</p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-1 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {['SUBMITTED', 'ACCEPTED', 'PAYMENT_PENDING', 'QUEUED', 'PRINTING', 'READY_FOR_PICKUP', 'COLLECTED', 'CANCELLED', 'ALL'].map(
            tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'SUBMITTED' ? 'Incoming Review' : tab.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order or student..."
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
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No requests found in this queue</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isIncomingReview = order.status === 'SUBMITTED' || order.status === 'PENDING_REVIEW';
            const isAwaitingPayment = order.status === 'ACCEPTED' || order.status === 'PAYMENT_PENDING';

            return (
              <div
                key={order.id}
                className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {order.orderNumber}
                    </span>
                    <p className="text-xs text-slate-500">
                      Student:{' '}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {order.user?.name || 'Student'}
                      </span>{' '}
                      ({order.user?.email})
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <select
                      value={order.status}
                      onChange={e => handleUpdateStatus(order.id, e.target.value)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
                    >
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="QUEUED">QUEUED</option>
                      <option value="PRINTING">PRINTING</option>
                      <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                      <option value="COLLECTED">COLLECTED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Operator Actions for Incoming Review */}
                {isIncomingReview && (
                  <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-900 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
                      Operator Action Needed: Inspect & Review Print Request
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(order.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>

                      <button
                        onClick={() => setAdjustOrder(order)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Adjust Price</span>
                      </button>

                      <button
                        onClick={() => setRejectOrder(order)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                )}

                {order.status === 'CANCELLED' && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                    <XCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                    <span>
                      Order Cancelled by Student before printing started.
                    </span>
                  </div>
                )}

                {/* Counter Payment Option */}
                {isAwaitingPayment && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                    <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                      Student chosen method: {order.paymentMethod || 'COUNTER_CASH'}
                    </span>
                    <button
                      onClick={() => handleConfirmCounterPayment(order.id, order.total)}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Record Counter Payment (₹{order.total.toFixed(2)})</span>
                    </button>
                  </div>
                )}

                {/* Paid or Queued Option */}
                {(order.status === 'PAID' || order.status === 'QUEUED') && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                    <span className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                      Order is paid & queued for printing.
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PRINTING')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Start Printing</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                      >
                        <span>Mark Ready for Pickup</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Printing Option */}
                {order.status === 'PRINTING' && (
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
                    <span className="text-xs text-indigo-800 dark:text-indigo-300 font-medium">
                      Document is actively printing on queue.
                    </span>
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center space-x-1.5 shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  </div>
                )}

                {/* Pickup Verification Option */}
                {(order.status === 'READY_FOR_PICKUP' || order.status === 'READY') && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Order documents ready for counter pickup verification</span>
                    </div>
                    <button
                      onClick={() => {
                        setVerifyPickupOrder(order);
                        setPickupCodeInput('');
                        setVerifyError(null);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center space-x-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Verify Pickup & Handover</span>
                    </button>
                  </div>
                )}

                {/* Order Files */}
                <div className="space-y-2">
                  {order.files?.map(file => (
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
                        {file.pageRange && <span>Pages: {file.pageRange}</span>}
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{file.calculatedPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-slate-400">
                    Received: {new Date(order.createdAt).toLocaleString()}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    Total: ₹{order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Reject Print Request</h2>
            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Low resolution image, unreadable font, or unsupported format."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRejectOrder(null)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs rounded-lg bg-rose-600 text-white font-bold"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Price Adjustment Modal */}
      {adjustOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Adjust Request Pricing</h2>
            <form onSubmit={handleConfirmPriceAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  New Total Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTotal}
                  onChange={e => setNewTotal(e.target.value)}
                  placeholder={adjustOrder.total.toFixed(2)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Price Adjustment
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="e.g. Heavy paper weight surcharge or extra cover sheet"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAdjustOrder(null)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs rounded-lg bg-amber-600 text-white font-bold"
                >
                  Save New Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Pickup Modal */}
      {verifyPickupOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Counter Pickup Verification</h2>
              </div>
              <button
                onClick={() => setVerifyPickupOrder(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{verifyPickupOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{verifyPickupOrder.user?.name || 'Student'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Documents:</span>
                <span className="text-slate-700 dark:text-slate-300">{verifyPickupOrder.files?.length || 0} File(s)</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">Total Price:</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{verifyPickupOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmVerifyPickup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Verification Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationMethod('MANUAL_CODE')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      verificationMethod === 'MANUAL_CODE'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Manual Passcode
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMethod('QR_CODE')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      verificationMethod === 'QR_CODE'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    QR Code Scanner
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enter 6-Character Pickup Code (e.g. CP-7X4KQ9)
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={pickupCodeInput}
                  onChange={e => setPickupCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. CP-7X4KQ9 or 7X4KQ9"
                  className="w-full px-3 py-2 font-mono text-center text-lg font-black uppercase tracking-wider bg-surface-light dark:bg-surface-dark border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {verifyError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium text-center">
                  {verifyError}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyPickupOrder(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying || !pickupCodeInput.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md disabled:opacity-50 inline-flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{verifying ? 'Verifying...' : 'Verify & Handover Order'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Select Printer Modal for PRINTING status transition */}
      <SelectPrinterModal
        isOpen={!!printingOrderId}
        onClose={() => setPrintingOrderId(null)}
        onConfirm={printerId => {
          if (printingOrderId) {
            handleUpdateStatus(printingOrderId, 'PRINTING', printerId);
            setPrintingOrderId(null);
          }
        }}
      />
    </div>
  );
};
