import { ColourMode, DuplexMode, OrderStatus, PaperSize, PaymentMethod } from '@prisma/client';
import { z } from 'zod';

export const orderFileSchema = z.object({
  documentId: z.string().optional(),
  originalFileName: z.string().min(1, 'Original file name is required'),
  storedFileName: z.string().min(1, 'Stored file name is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().int().positive('File size must be positive'),
  pageCount: z.number().int().min(1).default(1),
  copies: z.number().int().min(1, 'Copies must be at least 1').max(100).default(1),
  paperSize: z.nativeEnum(PaperSize).default(PaperSize.A4),
  colourMode: z.nativeEnum(ColourMode).default(ColourMode.BW),
  duplexMode: z.nativeEnum(DuplexMode).default(DuplexMode.SINGLE),
  orientation: z.enum(['portrait', 'landscape', 'PORTRAIT', 'LANDSCAPE']).default('portrait'),
  binding: z.boolean().default(false),
  lamination: z.boolean().default(false),
  coverPage: z.boolean().default(false),
  pageRange: z.string().optional().nullable(),
  specialInstructions: z.string().optional().nullable(),
});

export const createOrderSchema = z.object({
  documentId: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional().default(PaymentMethod.ONLINE_RAZORPAY),
  remarks: z.string().optional().nullable(),
  files: z.array(orderFileSchema).min(1, 'At least one file is required to create a print order'),
});

export const updateOrderSchema = z.object({
  remarks: z.string().optional().nullable(),
  files: z.array(orderFileSchema).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    errorMap: () => ({ message: 'Invalid order status transition value' }),
  }),
  remarks: z.string().optional().nullable(),
  printerId: z.string().optional(),
});

export const reviewRequestSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT']),
  reason: z.string().optional(),
});

export const adjustPriceSchema = z.object({
  newTotal: z.number().positive('Price must be greater than 0'),
  reason: z.string().min(1, 'Adjustment reason is required'),
});

export const recordCounterPaymentSchema = z.object({
  paymentMethod: z.enum(['COUNTER_CASH', 'COUNTER_UPI']),
  amount: z.number().positive('Payment amount must be greater than 0'),
});

export const orderQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  status: z.nativeEnum(OrderStatus).optional(),
  search: z.string().optional(),
});

export const verifyPickupSchema = z.object({
  pickupCode: z.string().min(1, 'Pickup verification code is required'),
  method: z.enum(['MANUAL_CODE', 'QR_CODE']).optional().default('MANUAL_CODE'),
});

export type OrderFileInput = z.infer<typeof orderFileSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ReviewRequestInput = z.infer<typeof reviewRequestSchema>;
export type AdjustPriceInput = z.infer<typeof adjustPriceSchema>;
export type RecordCounterPaymentInput = z.infer<typeof recordCounterPaymentSchema>;
export type VerifyPickupInput = z.infer<typeof verifyPickupSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
