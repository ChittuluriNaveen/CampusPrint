import { apiClient } from './apiClient';

export interface InventoryItem {
  id: string;
  name: string;
  sku?: string | null;
  category: 'PAPER' | 'INK_TONER' | 'BINDING' | 'LAMINATION' | 'CONSUMABLE' | 'OTHER';
  unit: string;
  currentQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  purchasePrice: number;
  sellingPrice?: number | null;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  location?: string | null;
  supplierId?: string | null;
  supplier?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  itemName: string;
  category: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'AUTO_DEDUCTION' | 'MANUAL_ADJUSTMENT' | 'DAMAGE_LOSS';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

export interface InventoryDashboardData {
  summary: {
    totalItems: number;
    totalValuation: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  lowStockAlerts: Array<{
    id: string;
    name: string;
    category: string;
    currentQuantity: number;
    minQuantity: number;
    unit: string;
    status: string;
  }>;
  recentTransactions: InventoryTransaction[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  _count?: { items: number };
}

export const inventoryApi = {
  getDashboard: async () => {
    const response = await apiClient.get<{ data: InventoryDashboardData }>('/inventory/dashboard');
    return response.data.data;
  },

  getItems: async (params?: { category?: string; search?: string; status?: string }) => {
    const response = await apiClient.get<{ data: { items: InventoryItem[] } }>('/inventory', { params });
    return response.data.data.items;
  },

  createItem: async (data: Partial<InventoryItem>) => {
    const response = await apiClient.post<{ data: InventoryItem }>('/inventory', data);
    return response.data.data;
  },

  adjustStock: async (data: {
    inventoryItemId: string;
    quantity: number;
    type: 'STOCK_IN' | 'STOCK_OUT' | 'MANUAL_ADJUSTMENT' | 'DAMAGE_LOSS';
    reason: string;
  }) => {
    const response = await apiClient.post('/inventory/adjust', data);
    return response.data;
  },

  recordPurchase: async (data: {
    inventoryItemId: string;
    quantity: number;
    unitCost: number;
    supplierId?: string | null;
    invoiceNumber?: string | null;
    notes?: string | null;
  }) => {
    const response = await apiClient.post('/inventory/purchase', data);
    return response.data;
  },

  getSuppliers: async () => {
    const response = await apiClient.get<{ data: { suppliers: Supplier[] } }>('/inventory/suppliers');
    return response.data.data.suppliers;
  },

  createSupplier: async (data: Partial<Supplier>) => {
    const response = await apiClient.post<{ data: Supplier }>('/inventory/suppliers', data);
    return response.data.data;
  },
};
