import { UserRole, UserStatus } from '@prisma/client';
import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100).optional(),
  studentId: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  year: z.number().int().min(1).max(6).optional().nullable(),
  phone: z.string().optional().nullable(),
  avatar: z.string().url('Avatar must be a valid URL').optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number'),
});

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  isVerified: z.boolean().optional(),
  department: z.string().optional().nullable(),
  year: z.number().int().min(1).max(6).optional().nullable(),
  phone: z.string().optional().nullable(),
});

export const userQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
