import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrder,
} from '../services/order.service';
import { sendError, sendSuccess } from '../utils/response';
import { OrderQueryInput } from '../validators/order.validator';

export const createOrderController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const order = await createOrder(req.user.id, req.body);
    sendSuccess(res, 201, 'Print order created successfully', order);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to create print order');
  }
};

export const getUserOrdersController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const query = req.query as unknown as OrderQueryInput;
    const result = await getUserOrders(req.user.id, req.user.role, query);
    sendSuccess(res, 200, 'Print orders retrieved successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve print orders');
  }
};

export const getOrderByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const order = await getOrderById(id, req.user.id, req.user.role);
    sendSuccess(res, 200, 'Print order details retrieved successfully', order);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve print order details');
  }
};

export const updateOrderController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const updatedOrder = await updateOrder(id, req.user.id, req.user.role, req.body);
    sendSuccess(res, 200, 'Print order updated successfully', updatedOrder);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update print order');
  }
};

export const cancelOrderController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const { remarks } = req.body || {};
    const cancelledOrder = await cancelOrder(id, req.user.id, req.user.role, remarks);
    sendSuccess(res, 200, 'Print order cancelled successfully', cancelledOrder);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to cancel print order');
  }
};
