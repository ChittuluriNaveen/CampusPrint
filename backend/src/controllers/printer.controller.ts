import { Request, Response } from 'express';
import {
  assignQueuePrinterSchema,
  createPrinterSchema,
  pauseQueueSchema,
  queueQuerySchema,
  updatePrinterSchema,
  updatePrinterStatusSchema,
  updateQueuePrioritySchema,
} from '../validators/printer.validator';
import * as printerService from '../services/printer.service';

// --- Printer Fleet Endpoints ---
export const getPrinters = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as any;
    const search = req.query.search as string;

    const printers = await printerService.listPrinters({ status, search });
    res.json({ success: true, data: printers });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const getPrinterDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const printer = await printerService.getPrinterById(id);
    res.json({ success: true, data: printer });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const createPrinter = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createPrinterSchema.parse(req.body);
    const printer = await printerService.createPrinter(validatedData);
    res.status(201).json({ success: true, data: printer });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

export const updatePrinter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updatePrinterSchema.parse(req.body);
    const printer = await printerService.updatePrinter(id, validatedData);
    res.json({ success: true, data: printer });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

export const deletePrinter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await printerService.deletePrinter(id);
    res.json({ success: true, message: 'Printer removed successfully' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const updatePrinterStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updatePrinterStatusSchema.parse(req.body);
    const printer = await printerService.updatePrinterStatus(id, validatedData);
    res.json({ success: true, data: printer });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// --- Intelligent Print Queue Endpoints ---
export const getPrintQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedQuery = queueQuerySchema.parse(req.query);
    const queue = await printerService.getPrintQueue(validatedQuery);
    res.json({ success: true, data: queue });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const assignPrinterToQueueJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // queueId
    const validatedData = assignQueuePrinterSchema.parse(req.body);
    const userId = (req as any).user?.id;

    const updated = await printerService.manualAssignPrinter(id, validatedData, userId);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

export const updateQueuePriority = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // queueId
    const validatedData = updateQueuePrioritySchema.parse(req.body);
    const userId = (req as any).user?.id;

    const updated = await printerService.updateQueuePriority(id, validatedData, userId);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

export const pauseQueueJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // queueId
    const validatedData = pauseQueueSchema.parse(req.body);
    const userId = (req as any).user?.id;

    const updated = await printerService.togglePauseQueueJob(id, true, validatedData, userId);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

export const resumeQueueJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // queueId
    const userId = (req as any).user?.id;

    const updated = await printerService.togglePauseQueueJob(id, false, undefined, userId);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

export const retryQueueJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // queueId
    const userId = (req as any).user?.id;

    const updated = await printerService.retryFailedQueueJob(id, userId);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// --- Dashboard Metrics & Reports Endpoints ---
export const getPrinterDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const dashboard = await printerService.getPrinterDashboard();
    res.json({ success: true, data: dashboard });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const getPrinterReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await printerService.getPrinterReports();
    res.json({ success: true, data: reports });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
