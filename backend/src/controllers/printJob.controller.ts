import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  assignOperator,
  cancelPrintJob,
  createPrintJob,
  getPrintJobById,
  getPrintQueue,
  updatePrintJobStatus,
  updatePriority,
} from '../services/printJob.service';
import { sendError, sendSuccess } from '../utils/response';

export const createPrintJobController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const job = await createPrintJob(req.user.id, req.body);
    sendSuccess(res, 201, 'Print job created and queued successfully', job);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to create print job');
  }
};

export const getPrintQueueController = async (req: Request, res: Response): Promise<void> => {
  try {
    const queue = await getPrintQueue(req.query as any);
    sendSuccess(res, 200, 'Print queue retrieved successfully', queue);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve print queue');
  }
};

export const getPrintJobByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const job = await getPrintJobById(id, req.user.id, req.user.role);
    sendSuccess(res, 200, 'Print job details retrieved successfully', job);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve print job details');
  }
};

export const updatePrintJobStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const updated = await updatePrintJobStatus(id, req.user.id, req.body);
    sendSuccess(res, 200, 'Print job status updated successfully', updated);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update print job status');
  }
};

export const assignOperatorController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const assigned = await assignOperator(id, req.user.id, req.body);
    sendSuccess(res, 200, 'Print job operator assigned successfully', assigned);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to assign print job operator');
  }
};

export const updatePriorityController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const updated = await updatePriority(id, req.user.id, req.body);
    sendSuccess(res, 200, 'Print job priority updated successfully', updated);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update print job priority');
  }
};

export const cancelPrintJobController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const notes = req.body?.notes;
    const cancelled = await cancelPrintJob(id, req.user.id, notes);
    sendSuccess(res, 200, 'Print job cancelled successfully', cancelled);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to cancel print job');
  }
};
