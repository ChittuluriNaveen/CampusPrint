import { z } from 'zod';
import { NotificationType } from '@prisma/client';

export const notificationQuerySchema = z.object({
  isRead: z
    .string()
    .optional()
    .transform(val => (val === undefined ? undefined : val === 'true')),
  type: z.nativeEnum(NotificationType).optional(),
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 20)),
});

export const notificationIdParamSchema = z.object({
  id: z.string().uuid('Invalid notification ID format'),
});

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
