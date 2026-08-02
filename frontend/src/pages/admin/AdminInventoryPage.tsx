import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  History,
  MinusCircle,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Truck,
  X,
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { inventoryApi, InventoryDashboardData, InventoryItem, Supplier } from '../../services/inventory.service';

export const AdminInventoryPage: React.FC = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'inventory' | 'purchases' | 'transactions' | 'suppliers'>('inventory');
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<InventoryDashboardData | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form states
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'STOCK_IN' | 'STOCK_OUT' | 'MANUAL_ADJUSTMENT' | 'DAMAGE_LOSS'>('STOCK_IN');
  const [adjustReason, setAdjustReason] = useState('');

  const [purchaseQty, setPurchaseQty] = useState<number>(500);
  const [purchaseCost, setPurchaseCost] = useState<number>(0.50);
  const [purchaseInvoice, setPurchaseInvoice] = useState('');
  const [purchaseSupplierId, setPurchaseSupplierId] = useState('');

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'PAPER' | 'INK_TONER' | 'BINDING' | 'LAMINATION' | 'CONSUMABLE' | 'OTHER'>('PAPER');
  const [newItemUnit, setNewItemUnit] = useState('SHEETS');
  const [newItemCurrentQty, setNewItemCurrentQty] = useState(500);
  const [newItemMinQty, setNewItemMinQty] = useState(100);
  const [newItemPrice, setNewItemPrice] = useState(0.50);
  const [newItemLocation, setNewItemLocation] = useState('Warehouse');

  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierContact, setNewSupplierContact] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, itemsRes, suppRes] = await Promise.all([
        inventoryApi.getDashboard(),
        inventoryApi.getItems(),
        inventoryApi.getSuppliers(),
      ]);
      setDashboard(dashRes);
      setItems(itemsRes);
      setSuppliers(suppRes);
    } catch (err) {
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await inventoryApi.adjustStock({
        inventoryItemId: selectedItem.id,
        quantity: adjustQty,
        type: adjustType,
        reason: adjustReason || 'Manual adjustment via inventory desk',
      });
      toast.success('Stock level adjusted successfully!');
      setIsAdjustModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to adjust stock level');
    }
  };

  const handleRecordPurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await inventoryApi.recordPurchase({
        inventoryItemId: selectedItem.id,
        quantity: purchaseQty,
        unitCost: purchaseCost,
        invoiceNumber: purchaseInvoice || undefined,
        supplierId: purchaseSupplierId || undefined,
      });
      toast.success('Purchase restock recorded successfully!');
      setIsPurchaseModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to record restock purchase');
    }
  };

  const handleCreateItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inventoryApi.createItem({
        name: newItemName,
        category: newItemCategory,
        unit: newItemUnit,
        currentQuantity: newItemCurrentQty,
        minQuantity: newItemMinQty,
        purchasePrice: newItemPrice,
        location: newItemLocation,
      });
      toast.success('New inventory item added successfully!');
      setIsNewItemModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to add new item');
    }
  };

  const handleCreateSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inventoryApi.createSupplier({
        name: newSupplierName,
        contactPerson: newSupplierContact,
        phone: newSupplierPhone,
        email: newSupplierEmail,
      });
      toast.success('New supplier registered successfully!');
      setIsSupplierModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to register supplier');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            Inventory & Print Resources
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor print consumables, set low-stock thresholds, and track automatic usage deductions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Consumable</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Valuation</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹{dashboard?.summary.totalValuation.toLocaleString() || 0}
          </p>
          <span className="text-xs font-semibold text-slate-500 mt-1 block">Active Stock Worth</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Catalog Items</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {dashboard?.summary.totalItems || 0}
          </p>
          <span className="text-xs font-semibold text-slate-500 mt-1 block">Tracked Consumables</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-sm bg-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Low Stock Alerts</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {dashboard?.summary.lowStockCount || 0}
          </p>
          <span className="text-xs font-semibold text-amber-600/80 dark:text-amber-400/80 mt-1 block">Below Min Threshold</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-red-500/30 rounded-2xl p-5 shadow-sm bg-red-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Out of Stock</span>
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-600 flex items-center justify-center">
              <MinusCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-2">
            {dashboard?.summary.outOfStockCount || 0}
          </p>
          <span className="text-xs font-semibold text-red-600/80 dark:text-red-400/80 mt-1 block">Requires Immediate Restock</span>
        </div>
      </div>

      {/* Low Stock Alert Warning Banner */}
      {dashboard && dashboard.lowStockAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Low Stock Restock Alert ({dashboard.lowStockAlerts.length} Items)
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {dashboard.lowStockAlerts.map(alertItem => (
                <span
                  key={alertItem.id}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center space-x-1"
                >
                  <span>{alertItem.name}:</span>
                  <span className="font-black underline">{alertItem.currentQuantity} {alertItem.unit}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === 'inventory'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Stock Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === 'transactions'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Usage & Audit Log</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === 'suppliers'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Suppliers</span>
        </button>
      </div>

      {/* Tab Content 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search paper, SKU, location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500">Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="PAPER">Paper Sheets</option>
                <option value="INK_TONER">Ink & Toner</option>
                <option value="BINDING">Binding Materials</option>
                <option value="LAMINATION">Lamination</option>
                <option value="CONSUMABLE">General Consumable</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="px-5 py-3.5">Consumable Item</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Stock Level</th>
                    <th className="px-5 py-3.5">Unit Cost</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Storage Location</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{item.sku}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-black text-slate-900 dark:text-white">
                          {item.currentQuantity.toLocaleString()} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                        </div>
                        <div className="text-xs text-slate-400">Min: {item.minQuantity}</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700 dark:text-slate-300">
                        ₹{item.purchasePrice.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        {item.currentQuantity <= 0 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/20">
                            Out of Stock
                          </span>
                        ) : item.currentQuantity <= item.minQuantity ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                        {item.location || 'Central Desk'}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setAdjustQty(10);
                            setIsAdjustModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                        >
                          Adjust Stock
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setPurchaseQty(500);
                            setPurchaseCost(item.purchasePrice);
                            setIsPurchaseModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary-600/10 text-primary-600 dark:text-primary-400 hover:bg-primary-600/20 text-xs font-bold transition-colors"
                        >
                          Log Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-400 text-sm">
                        No consumables match the search or filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Audit Transactions Log */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
            Recent Stock Deductions & Restock Logs
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Item Name</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Qty Change</th>
                  <th className="px-5 py-3.5">Stock Shift</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {dashboard?.recentTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 text-xs font-mono text-slate-400">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">{t.itemName}</td>
                    <td className="px-5 py-4">
                      {t.type === 'AUTO_DEDUCTION' ? (
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
                          Auto Order Deduct
                        </span>
                      ) : t.type === 'STOCK_IN' ? (
                        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                          Purchase / In
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-600 text-xs font-bold">
                          {t.type}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-black">
                      {t.type === 'STOCK_IN' ? `+${t.quantity}` : `-${t.quantity}`}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                      {t.previousStock} ➔ <span className="font-bold text-slate-900 dark:text-white">{t.newStock}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300">{t.reason}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">{t.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Suppliers */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Registered Paper & Material Suppliers</h3>
            <button
              onClick={() => setIsSupplierModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map(sup => (
              <div key={sup.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{sup.name}</h4>
                    <p className="text-xs text-slate-400">{sup.contactPerson || 'Direct Supplier'}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div>📞 {sup.phone || 'N/A'}</div>
                  <div>✉️ {sup.email || 'N/A'}</div>
                  <div>📍 {sup.address || 'Local Distributor'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
          <form onSubmit={handleAdjustStockSubmit} className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-4">
            <button
              type="button"
              onClick={() => setIsAdjustModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Adjust Stock: {selectedItem.name}</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={e => setAdjustType(e.target.value as 'STOCK_IN' | 'STOCK_OUT' | 'MANUAL_ADJUSTMENT' | 'DAMAGE_LOSS')}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="STOCK_IN">Manual Stock In (+ Add)</option>
                  <option value="STOCK_OUT">Manual Stock Out (- Remove)</option>
                  <option value="DAMAGE_LOSS">Damage / Loss (- Remove)</option>
                  <option value="MANUAL_ADJUSTMENT">Correction Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity ({selectedItem.unit})</label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={e => setAdjustQty(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Physical inventory recount correction"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold"
              >
                Save Adjustment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log Purchase Modal */}
      {isPurchaseModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
          <form onSubmit={handleRecordPurchaseSubmit} className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-4">
            <button
              type="button"
              onClick={() => setIsPurchaseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Restock: {selectedItem.name}</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Restock Quantity ({selectedItem.unit})</label>
                <input
                  type="number"
                  value={purchaseQty}
                  onChange={e => setPurchaseQty(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Purchase Cost (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={purchaseCost}
                  onChange={e => setPurchaseCost(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Supplier</label>
                <select
                  value={purchaseSupplierId}
                  onChange={e => setPurchaseSupplierId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="">Default Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice / PO Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. INV-2026-9901"
                  value={purchaseInvoice}
                  onChange={e => setPurchaseInvoice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Log Restock
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Consumable Item Modal */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
          <form onSubmit={handleCreateItemSubmit} className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-4">
            <button
              type="button"
              onClick={() => setIsNewItemModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Consumable Item</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. A4 Glossy Photo Paper 180GSM"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value as 'PAPER' | 'INK_TONER' | 'BINDING' | 'LAMINATION' | 'CONSUMABLE' | 'OTHER')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="PAPER">PAPER</option>
                    <option value="INK_TONER">INK_TONER</option>
                    <option value="BINDING">BINDING</option>
                    <option value="LAMINATION">LAMINATION</option>
                    <option value="CONSUMABLE">CONSUMABLE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={e => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={newItemCurrentQty}
                    onChange={e => setNewItemCurrentQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={newItemMinQty}
                    onChange={e => setNewItemMinQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Purchase Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Location</label>
                <input
                  type="text"
                  placeholder="e.g. Rack A - Shelf 2"
                  value={newItemLocation}
                  onChange={e => setNewItemLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewItemModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold"
              >
                Create Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Supplier Modal */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
          <form onSubmit={handleCreateSupplierSubmit} className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-4">
            <button
              type="button"
              onClick={() => setIsSupplierModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Register New Supplier</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Supplier Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Office Supplies"
                  value={newSupplierName}
                  onChange={e => setNewSupplierName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Anand Sharma"
                  value={newSupplierContact}
                  onChange={e => setNewSupplierContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765..."
                    value={newSupplierPhone}
                    onChange={e => setNewSupplierPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="sales@apex.com"
                    value={newSupplierEmail}
                    onChange={e => setNewSupplierEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSupplierModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold"
              >
                Register Supplier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

