import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  calculateOrderPricing,
  getPricingConfigurations,
  updatePricingConfiguration,
} from '../services/pricing.service';
import { sendError, sendSuccess } from '../utils/response';

export const calculatePricingController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await calculateOrderPricing(req.body);
    sendSuccess(res, 200, 'Pricing calculated successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to calculate pricing');
  }
};

export const getPricingConfigController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const configs = await getPricingConfigurations();
    sendSuccess(res, 200, 'Pricing configurations retrieved successfully', configs);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve pricing configurations');
  }
};

export const updatePricingConfigController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const updated = await updatePricingConfiguration(req.user.id, req.body);
    sendSuccess(res, 200, 'Pricing configuration updated successfully', updated);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update pricing configuration');
  }
};
