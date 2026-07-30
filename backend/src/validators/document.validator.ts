import { z } from 'zod';

export const renameDocumentSchema = z.object({
  name: z
    .string()
    .min(1, 'Document name cannot be empty')
    .max(255, 'Document name cannot exceed 255 characters'),
});

export const documentQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
});

export type RenameDocumentInput = z.infer<typeof renameDocumentSchema>;
export type DocumentQueryInput = z.infer<typeof documentQuerySchema>;
