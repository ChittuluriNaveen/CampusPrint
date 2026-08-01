import { InventoryCategory, InventoryItemStatus, StockTransactionType } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from './auth.service';

export interface CreateInventoryItemInput {
  name: string;
  sku?: string | null;
  category: InventoryCategory;
  unit?: string;
  currentQuantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  purchasePrice: number;
  sellingPrice?: number | null;
  location?: string | null;
  supplierId?: string | null;
}

export interface AdjustStockInput {
  inventoryItemId: string;
  quantity: number;
  type: StockTransactionType;
  reason: string;
  userId?: string;
}

export interface RecordPurchaseInput {
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  supplierId?: string | null;
  invoiceNumber?: string | null;
  notes?: string | null;
  userId?: string;
}

export const getInventoryDashboard = async () => {
  const items = await prisma.inventoryItem.findMany({
    include: { supplier: true },
  });

  const totalItems = items.length;
  const totalValuation = items.reduce(
    (sum, item) => sum + item.currentQuantity * item.purchasePrice,
    0
  );

  const lowStockCount = items.filter(
    item => item.currentQuantity <= item.minQuantity && item.currentQuantity > 0
  ).length;

  const outOfStockCount = items.filter(item => item.currentQuantity <= 0).length;

  const recentTransactions = await prisma.inventoryTransaction.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      item: true,
      performedBy: { select: { id: true, name: true, email: true } },
    },
  });

  const lowStockItems = items.filter(item => item.currentQuantity <= item.minQuantity);

  return {
    summary: {
      totalItems,
      totalValuation: Math.round(totalValuation * 100) / 100,
      lowStockCount,
      outOfStockCount,
    },
    lowStockAlerts: lowStockItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      currentQuantity: item.currentQuantity,
      minQuantity: item.minQuantity,
      unit: item.unit,
      status: item.currentQuantity <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
    })),
    recentTransactions: recentTransactions.map(t => ({
      id: t.id,
      itemName: t.item.name,
      category: t.item.category,
      type: t.type,
      quantity: t.quantity,
      previousStock: t.previousStock,
      newStock: t.newStock,
      reason: t.reason,
      performedBy: t.performedBy?.name || 'System Auto',
      createdAt: t.createdAt,
    })),
  };
};

export const listInventoryItems = async (query?: {
  category?: InventoryCategory;
  search?: string;
  status?: InventoryItemStatus;
}) => {
  const whereClause: Record<string, unknown> = {};

  if (query?.category) {
    whereClause.category = query.category;
  }
  if (query?.status) {
    whereClause.status = query.status;
  }
  if (query?.search) {
    whereClause.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { sku: { contains: query.search, mode: 'insensitive' } },
      { location: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.inventoryItem.findMany({
    where: whereClause,
    include: { supplier: true },
    orderBy: { updatedAt: 'desc' },
  });

  return items;
};

export const createInventoryItem = async (input: CreateInventoryItemInput) => {
  const status: InventoryItemStatus =
    input.currentQuantity <= 0
      ? InventoryItemStatus.OUT_OF_STOCK
      : input.currentQuantity <= (input.minQuantity || 50)
      ? InventoryItemStatus.LOW_STOCK
      : InventoryItemStatus.IN_STOCK;

  const newItem = await prisma.inventoryItem.create({
    data: {
      name: input.name,
      sku: input.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      category: input.category,
      unit: input.unit || 'SHEETS',
      currentQuantity: input.currentQuantity,
      minQuantity: input.minQuantity || 50,
      maxQuantity: input.maxQuantity || 1000,
      purchasePrice: input.purchasePrice,
      sellingPrice: input.sellingPrice,
      location: input.location,
      supplierId: input.supplierId,
      status,
    },
  });

  // Log initial stock creation transaction if quantity > 0
  if (input.currentQuantity > 0) {
    await prisma.inventoryTransaction.create({
      data: {
        inventoryItemId: newItem.id,
        type: StockTransactionType.STOCK_IN,
        quantity: input.currentQuantity,
        previousStock: 0,
        newStock: input.currentQuantity,
        reason: 'Initial stock entry',
      },
    });
  }

  return newItem;
};

export const updateInventoryItem = async (id: string, input: Partial<CreateInventoryItemInput>) => {
  const existing = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Inventory item not found');
  }

  const newQty = input.currentQuantity !== undefined ? input.currentQuantity : existing.currentQuantity;
  const minQty = input.minQuantity !== undefined ? input.minQuantity : existing.minQuantity;

  const status: InventoryItemStatus =
    newQty <= 0
      ? InventoryItemStatus.OUT_OF_STOCK
      : newQty <= minQty
      ? InventoryItemStatus.LOW_STOCK
      : InventoryItemStatus.IN_STOCK;

  const updated = await prisma.inventoryItem.update({
    where: { id },
    data: {
      ...input,
      status,
    },
  });

  return updated;
};

export const deleteInventoryItem = async (id: string) => {
  const existing = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Inventory item not found');
  }

  await prisma.inventoryItem.delete({ where: { id } });
  return true;
};

export const adjustStock = async (input: AdjustStockInput) => {
  const item = await prisma.inventoryItem.findUnique({ where: { id: input.inventoryItemId } });
  if (!item) {
    throw new AppError(404, 'Inventory item not found');
  }

  const isDeduction =
    input.type === StockTransactionType.STOCK_OUT ||
    input.type === StockTransactionType.DAMAGE_LOSS ||
    input.type === StockTransactionType.AUTO_DEDUCTION;

  const changeQty = isDeduction ? -Math.abs(input.quantity) : Math.abs(input.quantity);
  const newStock = Math.max(0, item.currentQuantity + changeQty);

  const status: InventoryItemStatus =
    newStock <= 0
      ? InventoryItemStatus.OUT_OF_STOCK
      : newStock <= item.minQuantity
      ? InventoryItemStatus.LOW_STOCK
      : InventoryItemStatus.IN_STOCK;

  const [updatedItem, transaction] = await prisma.$transaction([
    prisma.inventoryItem.update({
      where: { id: item.id },
      data: { currentQuantity: newStock, status },
    }),
    prisma.inventoryTransaction.create({
      data: {
        inventoryItemId: item.id,
        type: input.type,
        quantity: Math.abs(input.quantity),
        previousStock: item.currentQuantity,
        newStock,
        reason: input.reason,
        performedById: input.userId || null,
      },
    }),
  ]);

  return { updatedItem, transaction };
};

export const recordPurchase = async (input: RecordPurchaseInput) => {
  const item = await prisma.inventoryItem.findUnique({ where: { id: input.inventoryItemId } });
  if (!item) {
    throw new AppError(404, 'Inventory item not found');
  }

  const addedQty = Math.abs(input.quantity);
  const newStock = item.currentQuantity + addedQty;

  const status: InventoryItemStatus =
    newStock <= 0
      ? InventoryItemStatus.OUT_OF_STOCK
      : newStock <= item.minQuantity
      ? InventoryItemStatus.LOW_STOCK
      : InventoryItemStatus.IN_STOCK;

  const reasonMsg = input.invoiceNumber
    ? `Stock Purchase Restock (Invoice: ${input.invoiceNumber})`
    : 'Stock Purchase Restock';

  const [updatedItem, transaction] = await prisma.$transaction([
    prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        currentQuantity: newStock,
        purchasePrice: input.unitCost || item.purchasePrice,
        supplierId: input.supplierId || item.supplierId,
        status,
      },
    }),
    prisma.inventoryTransaction.create({
      data: {
        inventoryItemId: item.id,
        type: StockTransactionType.STOCK_IN,
        quantity: addedQty,
        previousStock: item.currentQuantity,
        newStock,
        reason: reasonMsg,
        performedById: input.userId || null,
      },
    }),
  ]);

  return { updatedItem, transaction };
};

export const deductStockForCompletedOrder = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { files: true },
  });

  if (!order || !order.files || order.files.length === 0) {
    return;
  }

  const paperItems = await prisma.inventoryItem.findMany({
    where: { category: InventoryCategory.PAPER },
  });

  const bindingItem = await prisma.inventoryItem.findFirst({
    where: { category: InventoryCategory.BINDING },
  });

  const laminationItem = await prisma.inventoryItem.findFirst({
    where: { category: InventoryCategory.LAMINATION },
  });

  for (const file of order.files) {
    // Calculate sheets needed (duplex divides by 2 rounded up)
    const sheetsNeeded = file.duplexMode === 'DOUBLE'
      ? Math.ceil(file.pageCount / 2) * file.copies
      : file.pageCount * file.copies;

    // Find paper item matching paperSize
    const matchingPaper = paperItems.find(p => p.name.toLowerCase().includes(file.paperSize.toLowerCase())) || paperItems[0];

    if (matchingPaper && sheetsNeeded > 0) {
      await adjustStock({
        inventoryItemId: matchingPaper.id,
        quantity: sheetsNeeded,
        type: StockTransactionType.AUTO_DEDUCTION,
        reason: `Auto-deducted for Completed Order #${order.orderNumber} (${file.paperSize})`,
      });
    }

    if (file.binding && bindingItem) {
      await adjustStock({
        inventoryItemId: bindingItem.id,
        quantity: file.copies,
        type: StockTransactionType.AUTO_DEDUCTION,
        reason: `Auto-deducted binding for Order #${order.orderNumber}`,
      });
    }

    if (file.lamination && laminationItem) {
      await adjustStock({
        inventoryItemId: laminationItem.id,
        quantity: file.copies,
        type: StockTransactionType.AUTO_DEDUCTION,
        reason: `Auto-deducted lamination for Order #${order.orderNumber}`,
      });
    }
  }
};

export const listSuppliers = async () => {
  return await prisma.supplier.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { items: true } } },
  });
};

export const createSupplier = async (data: {
  name: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}) => {
  return await prisma.supplier.create({
    data: {
      name: data.name,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email || null,
      address: data.address,
    },
  });
};
