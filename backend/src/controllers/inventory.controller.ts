import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  adjustStock,
  createInventoryItem,
  createSupplier,
  deleteInventoryItem,
  getInventoryDashboard,
  listInventoryItems,
  listSuppliers,
  recordPurchase,
  updateInventoryItem,
} from '../services/inventory.service';
import { sendError, sendSuccess } from '../utils/response';

export const getInventoryDashboardController = async (req: Request, res: Response): Promise<void> => {
  try {
    const dashboardData = await getInventoryDashboard();
    sendSuccess(res, 200, 'Inventory dashboard retrieved successfully', dashboardData);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to fetch inventory dashboard');
  }
};

export const listInventoryItemsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, status } = req.query;
    const items = await listInventoryItems({
      category: category as any,
      search: search as string,
      status: status as any,
    });
    sendSuccess(res, 200, 'Inventory items retrieved successfully', { items });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to list inventory items');
  }
};

export const createInventoryItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    const newItem = await createInventoryItem(req.body);
    sendSuccess(res, 201, 'Inventory item created successfully', newItem);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to create inventory item');
  }
};

export const updateInventoryItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await updateInventoryItem(id, req.body);
    sendSuccess(res, 200, 'Inventory item updated successfully', updated);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update inventory item');
  }
};

export const deleteInventoryItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteInventoryItem(id);
    sendSuccess(res, 200, 'Inventory item deleted successfully');
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to delete inventory item');
  }
};

export const adjustStockController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await adjustStock({
      ...req.body,
      userId: req.user?.id,
    });
    sendSuccess(res, 200, 'Stock adjusted successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to adjust stock');
  }
};

export const recordPurchaseController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await recordPurchase({
      ...req.body,
      userId: req.user?.id,
    });
    sendSuccess(res, 200, 'Stock purchase logged successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to record purchase restock');
  }
};

export const listSuppliersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await listSuppliers();
    sendSuccess(res, 200, 'Suppliers retrieved successfully', { suppliers });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to fetch suppliers');
  }
};

export const createSupplierController = async (req: Request, res: Response): Promise<void> => {
  try {
    const newSupplier = await createSupplier(req.body);
    sendSuccess(res, 201, 'Supplier created successfully', newSupplier);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to create supplier');
  }
};
