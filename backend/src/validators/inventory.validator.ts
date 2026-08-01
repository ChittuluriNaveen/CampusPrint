import { InventoryCategory, StockTransactionType } from '@prisma/client';
import { z } from 'zod';

export const createInventoryItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters long').max(150),
  sku: z.string().optional().nullable(),
  category: z.nativeEnum(InventoryCategory),
  unit: z.string().default('SHEETS'),
  currentQuantity: z.number().min(0, 'Quantity cannot be negative'),
  minQuantity: z.number().min(0, 'Minimum quantity cannot be negative').default(50),
  maxQuantity: z.number().min(1, 'Maximum quantity must be at least 1').default(1000),
  purchasePrice: z.number().min(0, 'Purchase price cannot be negative'),
  sellingPrice: z.number().min(0).optional().nullable(),
  location: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
});

export const updateInventoryItemSchema = createInventoryItemSchema.partial();

export const adjustStockSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  type: z.enum([
    StockTransactionType.STOCK_IN,
    StockTransactionType.STOCK_OUT,
    StockTransactionType.MANUAL_ADJUSTMENT,
    StockTransactionType.DAMAGE_LOSS,
  ]),
  reason: z.string().min(3, 'Reason must be provided').max(250),
});

export const recordPurchaseSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  quantity: z.number().positive('Purchase quantity must be greater than 0'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
  supplierId: z.string().uuid().optional().nullable(),
  invoiceNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const createSupplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required').max(150),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
});
