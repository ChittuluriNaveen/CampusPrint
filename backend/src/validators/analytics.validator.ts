import { z } from 'zod';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export const analyticsQuerySchema = z.object({
  period: z.enum(['today', '7days', '30days', 'monthly', 'yearly', 'custom']).optional().default('30days'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  format: z.enum(['json', 'csv']).optional().default('json'),
  reportType: z.enum(['revenue', 'orders', 'users', 'payments', 'queue', 'documents']).optional().default('revenue'),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
