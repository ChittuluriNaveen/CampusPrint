import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
});

export const retryPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

export const webhookSchema = z.object({
  event: z.string().min(1, 'Event type is required'),
  payload: z.record(z.any()).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type RetryPaymentInput = z.infer<typeof retryPaymentSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;
