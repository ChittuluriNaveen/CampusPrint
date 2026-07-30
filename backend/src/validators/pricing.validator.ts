import { ColourMode, DuplexMode, PaperSize } from '@prisma/client';
import { z } from 'zod';

export const pricingItemSchema = z.object({
  pages: z.number().int().min(1, 'Pages must be at least 1').default(1),
  copies: z.number().int().min(1, 'Copies must be at least 1').default(1),
  paperSize: z.nativeEnum(PaperSize).default(PaperSize.A4),
  colour: z.nativeEnum(ColourMode).optional(),
  colourMode: z.nativeEnum(ColourMode).optional(),
  duplexMode: z.nativeEnum(DuplexMode).default(DuplexMode.SINGLE),
  binding: z.boolean().default(false),
  lamination: z.boolean().default(false),
  coverPage: z.boolean().default(false),
});

export const calculatePricingSchema = z.object({
  items: z.array(pricingItemSchema).optional(),
  // Supports direct flat payload (e.g., { pages: 24, copies: 2, paperSize: "A4", colour: "BW" })
  pages: z.number().int().min(1).optional(),
  copies: z.number().int().min(1).optional(),
  paperSize: z.nativeEnum(PaperSize).optional(),
  colour: z.nativeEnum(ColourMode).optional(),
  colourMode: z.nativeEnum(ColourMode).optional(),
  duplexMode: z.nativeEnum(DuplexMode).optional(),
  binding: z.boolean().optional(),
  lamination: z.boolean().optional(),
  coverPage: z.boolean().optional(),
});

export const updatePricingConfigSchema = z.object({
  paperSize: z.nativeEnum(PaperSize),
  colourMode: z.nativeEnum(ColourMode),
  duplexMode: z.nativeEnum(DuplexMode),
  basePrice: z.number().min(0, 'Base price cannot be negative'),
  bindingPrice: z.number().min(0, 'Binding price cannot be negative').default(20),
  laminationPrice: z.number().min(0, 'Lamination price cannot be negative').default(15),
  gstPercentage: z.number().min(0).max(100).default(18),
  active: z.boolean().default(true),
});

export type PricingItemInput = z.infer<typeof pricingItemSchema>;
export type CalculatePricingInput = z.infer<typeof calculatePricingSchema>;
export type UpdatePricingConfigInput = z.infer<typeof updatePricingConfigSchema>;
