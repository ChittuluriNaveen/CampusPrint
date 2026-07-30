import { z } from 'zod';

export const addToCartSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const checkoutPreviewSchema = z.object({
  orderIds: z.array(z.string()).optional(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CheckoutPreviewInput = z.infer<typeof checkoutPreviewSchema>;
