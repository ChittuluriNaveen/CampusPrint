import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface CartItem {
  id: string;
  orderId: string;
  orderNumber?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  filesCount?: number;
  orderStatus?: string;
  order?: {
    orderNumber?: string;
    total?: number;
    files?: Array<{ originalFileName: string; copies: number }>;
  };
}

interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  grandTotal: number;
}

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCart = async () => {
    try {
      const response = await apiClient.get('/cart');
      if (response.data?.data) {
        setCart(response.data.data);
      }
    } catch {
      console.warn('Fallback to demo student shopping cart');
      setCart({
        items: [
          {
            id: 'ci-1',
            orderId: 'ord-101',
            orderNumber: 'ORD-20260730-8819',
            quantity: 1,
            unitPrice: 85.0,
            totalPrice: 85.0,
            filesCount: 1,
          },
          {
            id: 'ci-2',
            orderId: 'ord-102',
            orderNumber: 'ORD-20260730-1092',
            quantity: 1,
            unitPrice: 45.0,
            totalPrice: 45.0,
            filesCount: 1,
          },
        ],
        itemCount: 2,
        subtotal: 110.17,
        tax: 19.83,
        grandTotal: 130.0,
      });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      await apiClient.put(`/cart/items/${itemId}`, { quantity: newQty });
      fetchCart();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item quantity';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await apiClient.delete(`/cart/items/${itemId}`);
      setMessage({ type: 'success', text: 'Item removed from cart' });
      fetchCart();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from your shopping cart?')) return;
    try {
      await apiClient.delete('/cart');
      setMessage({ type: 'success', text: 'Cart cleared successfully' });
      fetchCart();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleProceedToPayment = () => {
    if (!cart?.items?.length) return;
    navigate('/student/checkout');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shopping Cart</h1>
          <p className="text-sm text-slate-500">Review print orders before initiating secure online payment</p>
        </div>

        {cart?.items?.length ? (
          <button
            onClick={handleClearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 inline-flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        ) : null}
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {!cart?.items?.length ? (
        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl">
          <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Your shopping cart is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Add configured print requests to your cart to process checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => {
              const orderNum = item.orderNumber || item.order?.orderNumber || `ORD-${item.orderId.slice(0, 8)}`;
              const unitPrice = item.unitPrice ?? item.order?.total ?? 0;
              const itemTotal = item.totalPrice ?? (unitPrice * item.quantity);
              const fileName = item.order?.files?.[0]?.originalFileName || `${item.filesCount || 1} Document File(s)`;

              return (
                <div
                  key={item.id}
                  className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {orderNum}
                    </span>
                    <p className="text-xs text-slate-500 truncate">
                      📄 {fileName}
                    </p>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                      ₹{unitPrice.toFixed(2)} per package
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-6">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{itemTotal.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Preview Box */}
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 h-fit">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order Summary</h2>

            <div className="space-y-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal ({cart.itemCount || cart.items.length} items)</span>
                <span>₹{(cart.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST Tax (18%)</span>
                <span>₹{(cart.tax || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Pickup Station</span>
                <span className="font-semibold text-emerald-600">Main Campus Desk</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-base font-bold text-slate-900 dark:text-white">
              <span>Grand Total</span>
              <span className="text-lg text-primary-600 dark:text-primary-400">
                ₹{(cart.grandTotal || 0).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Checkout</span>
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-Bit SSL Encrypted Razorpay Gateway</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
