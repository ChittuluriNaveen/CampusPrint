import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

export const createPrintJobSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  priority: z.number().int().min(1).max(3).default(1),
  operatorId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const updatePrintJobStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    errorMap: () => ({ message: 'Invalid print job status' }),
  }),
  notes: z.string().max(500).optional(),
});

export const assignOperatorSchema = z.object({
  operatorId: z.string().min(1, 'Operator ID is required'),
});

export const updatePrioritySchema = z.object({
  priority: z.number().int().min(1).max(3, 'Priority must be between 1 (Normal) and 3 (Urgent)'),
});

export const printJobQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  status: z.nativeEnum(OrderStatus).optional(),
  operatorId: z.string().optional(),
  priority: z.string().optional().transform(val => (val ? parseInt(val, 10) : undefined)),
  search: z.string().optional(),
});

export type CreatePrintJobInput = z.infer<typeof createPrintJobSchema>;
export type UpdatePrintJobStatusInput = z.infer<typeof updatePrintJobStatusSchema>;
export type AssignOperatorInput = z.infer<typeof assignOperatorSchema>;
export type UpdatePriorityInput = z.infer<typeof updatePrioritySchema>;
export type PrintJobQueryInput = z.infer<typeof printJobQuerySchema>;
