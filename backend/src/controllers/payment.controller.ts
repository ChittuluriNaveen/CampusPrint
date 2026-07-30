import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  createPaymentSession,
  getPaymentById,
  getPaymentHistory,
  handlePaymentWebhook,
  retryPaymentSession,
  verifyPayment,
} from '../services/payment.service';
import { sendError, sendSuccess } from '../utils/response';

export const createPaymentController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const session = await createPaymentSession(req.user.id, req.body.orderId);
    sendSuccess(res, 201, 'Payment session created successfully', session);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to create payment session');
  }
};

export const verifyPaymentController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const result = await verifyPayment(req.user.id, req.body);
    sendSuccess(res, 200, 'Payment verified successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to verify payment');
  }
};

export const handleWebhookController = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const rawBody = JSON.stringify(req.body);
    const result = await handlePaymentWebhook(rawBody, signature, req.body);
    sendSuccess(res, 200, 'Webhook processed successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Webhook processing failed');
  }
};

export const getPaymentHistoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const history = await getPaymentHistory(req.user.id, req.user.role);
    sendSuccess(res, 200, 'Payment history retrieved successfully', history);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve payment history');
  }
};

export const getPaymentByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const payment = await getPaymentById(req.user.id, req.user.role, id);
    sendSuccess(res, 200, 'Payment record retrieved successfully', payment);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve payment record');
  }
};

export const retryPaymentController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const session = await retryPaymentSession(req.user.id, req.body.orderId);
    sendSuccess(res, 200, 'Payment retry session generated successfully', session);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to generate payment retry session');
  }
};

export const adminListPaymentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const history = await getPaymentHistory(req.user.id, req.user.role);
    sendSuccess(res, 200, 'Admin payments list retrieved successfully', history);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve payments list');
  }
};
