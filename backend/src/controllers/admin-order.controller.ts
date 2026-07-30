import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import { adminListOrders, adminUpdateOrderStatus } from '../services/order.service';
import { sendError, sendSuccess } from '../utils/response';
import { OrderQueryInput } from '../validators/order.validator';

export const adminListOrdersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as unknown as OrderQueryInput;
    const result = await adminListOrders(query);
    sendSuccess(res, 200, 'All print orders retrieved successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve print orders for admin');
  }
};

export const adminUpdateOrderStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const { status, remarks } = req.body;
    const updatedOrder = await adminUpdateOrderStatus(id, req.user.id, status, remarks);
    sendSuccess(res, 200, 'Order status updated successfully', updatedOrder);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update order status');
  }
};
