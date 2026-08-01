import { PrinterStatus, QueuePriority, QueueStatus } from '@prisma/client';
import { z } from 'zod';

export const createPrinterSchema = z.object({
  name: z.string().min(2, 'Printer name must be at least 2 characters'),
  code: z.string().min(2, 'Printer code must be at least 2 characters'),
  printerType: z.string().default('LASER'),
  manufacturer: z.string().default('HP'),
  model: z.string().default('LaserJet Pro'),
  supportedPaperSizes: z.array(z.string()).min(1, 'At least one paper size must be supported'),
  supportedColorModes: z.array(z.string()).min(1, 'At least one color mode must be supported'),
  supportedDuplex: z.boolean().default(true),
  status: z.nativeEnum(PrinterStatus).default(PrinterStatus.ONLINE),
  location: z.string().optional(),
  maxDailyCapacity: z.number().int().positive().default(2000),
  isMaintenanceMode: z.boolean().default(false),
});

export const updatePrinterSchema = createPrinterSchema.partial().extend({
  active: z.boolean().optional(),
  currentDailyCount: z.number().int().nonnegative().optional(),
});

export const updatePrinterStatusSchema = z.object({
  status: z.nativeEnum(PrinterStatus),
  isMaintenanceMode: z.boolean().optional(),
  notes: z.string().optional(),
});

export const assignQueuePrinterSchema = z.object({
  printerId: z.string().uuid('Invalid printer ID'),
  overrideReason: z.string().optional(),
});

export const updateQueuePrioritySchema = z.object({
  priority: z.nativeEnum(QueuePriority),
  reason: z.string().optional(),
});

export const pauseQueueSchema = z.object({
  reason: z.string().min(3, 'Pause reason required'),
});

export const queueQuerySchema = z.object({
  status: z.nativeEnum(QueueStatus).optional(),
  priority: z.nativeEnum(QueuePriority).optional(),
  printerId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type CreatePrinterInput = z.infer<typeof createPrinterSchema>;
export type UpdatePrinterInput = z.infer<typeof updatePrinterSchema>;
export type UpdatePrinterStatusInput = z.infer<typeof updatePrinterStatusSchema>;
export type AssignQueuePrinterInput = z.infer<typeof assignQueuePrinterSchema>;
export type UpdateQueuePriorityInput = z.infer<typeof updateQueuePrioritySchema>;
export type PauseQueueInput = z.infer<typeof pauseQueueSchema>;
