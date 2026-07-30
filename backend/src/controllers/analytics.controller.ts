import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  getDashboardAnalytics,
  getRevenueAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
  getPaymentAnalytics,
  getQueueAnalytics,
  exportReportCSV,
} from '../services/analytics.service';
import { sendError, sendSuccess } from '../utils/response';
import { analyticsQuerySchema } from '../validators/analytics.validator';

export const getDashboardAnalyticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const data = await getDashboardAnalytics(query);
    sendSuccess(res, 200, 'Dashboard analytics retrieved successfully', data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve dashboard analytics');
  }
};

export const getRevenueAnalyticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const data = await getRevenueAnalytics(query);
    sendSuccess(res, 200, 'Revenue analytics retrieved successfully', data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve revenue analytics');
  }
};

export const getOrderAnalyticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const data = await getOrderAnalytics(query);
    sendSuccess(res, 200, 'Order analytics retrieved successfully', data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve order analytics');
  }
};

export const getUserAnalyticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const data = await getUserAnalytics(query);
    sendSuccess(res, 200, 'User analytics retrieved successfully', data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve user analytics');
  }
};

export const getPaymentAnalyticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const data = await getPaymentAnalytics(query);
    sendSuccess(res, 200, 'Payment analytics retrieved successfully', data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve payment analytics');
  }
};

export const getQueueAnalyticsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await getQueueAnalytics();
    sendSuccess(res, 200, 'Queue analytics retrieved successfully', data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve queue analytics');
  }
};

export const exportReportCSVController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const csvData = await exportReportCSV(query);

    const filename = `campusprint_${query.reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvData);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to export analytics report');
  }
};
