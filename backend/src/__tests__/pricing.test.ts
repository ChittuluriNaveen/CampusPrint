import { ColourMode, DuplexMode, PaperSize } from '@prisma/client';
import { calculateItemPricing, calculateOrderPricing } from '../services/pricing.service';
import { calculatePricingSchema, updatePricingConfigSchema } from '../validators/pricing.validator';

async function runPricingTests() {
  console.log('--- Running Pricing Engine Unit Tests ---');

  // 1. Single Item B&W Single-Sided A4 calculation test
  console.log('Testing B&W Single-Sided A4 cost calculation...');
  const bwItem = await calculateItemPricing({
    pages: 10,
    copies: 2,
    paperSize: PaperSize.A4,
    colourMode: ColourMode.BW,
    duplexMode: DuplexMode.SINGLE,
    binding: false,
    lamination: false,
    coverPage: false,
  });
  // 10 pages * 2 copies * 2.0 basePrice = 40.0
  if (bwItem.printCost !== 40 || bwItem.itemSubtotal !== 40) {
    throw new Error(`B&W single-sided A4 cost calculation failed. Got subtotal ${bwItem.itemSubtotal}`);
  }
  console.log('✓ B&W Single-Sided A4 cost calculation passed.');

  // 2. Double-Sided Colour A4 calculation test with Binding & Lamination
  console.log('Testing Double-Sided Colour A4 cost calculation with Binding...');
  const colourItem = await calculateItemPricing({
    pages: 10, // 10 pages double sided = 5 sheets per copy
    copies: 1,
    paperSize: PaperSize.A4,
    colourMode: ColourMode.COLOUR,
    duplexMode: DuplexMode.DOUBLE,
    binding: true,
    lamination: true,
    coverPage: false,
  });
  // 5 sheets * 18.0 basePrice = 90.0 printCost + 20.0 binding + 15.0 lamination = 125.0
  if (colourItem.printCost !== 90 || colourItem.itemSubtotal !== 125) {
    throw new Error(`Double-sided Colour A4 cost calculation failed. Got subtotal ${colourItem.itemSubtotal}`);
  }
  console.log('✓ Double-sided Colour A4 cost calculation passed.');

  // 3. Full Order Calculation breakdown test (subtotal, tax, total)
  console.log('Testing Order Cost Breakdown calculation...');
  const orderPricing = await calculateOrderPricing({
    items: [
      {
        pages: 24,
        copies: 2,
        paperSize: PaperSize.A4,
        colourMode: ColourMode.BW,
        duplexMode: DuplexMode.SINGLE,
        binding: false,
        lamination: false,
        coverPage: false,
      },
    ],
  });
  // 24 pages * 2 copies * 2.0 = 96 subtotal
  // 18% tax on 96 = 17.28
  // Total = 113.28
  if (orderPricing.subtotal !== 96 || orderPricing.tax !== 17.28 || orderPricing.total !== 113.28) {
    throw new Error(`Order cost breakdown calculation failed. Subtotal: ${orderPricing.subtotal}, Tax: ${orderPricing.tax}, Total: ${orderPricing.total}`);
  }
  console.log('✓ Order cost breakdown calculation passed.');

  // 4. Calculate Pricing Zod Schema Validation
  console.log('Testing calculatePricingSchema validator...');
  const validFlatInput = calculatePricingSchema.safeParse({
    pages: 24,
    copies: 2,
    paperSize: PaperSize.A4,
    colour: ColourMode.BW,
  });
  if (!validFlatInput.success) throw new Error('Flat calculate pricing schema validation failed');

  const invalidInput = calculatePricingSchema.safeParse({
    pages: -5, // Invalid negative pages
  });
  if (invalidInput.success) throw new Error('Invalid negative pages pricing schema test failed');
  console.log('✓ Calculate pricing schema validation tests passed.');

  // 5. Update Pricing Config Zod Schema Validation
  console.log('Testing updatePricingConfigSchema validator...');
  const validConfigInput = updatePricingConfigSchema.safeParse({
    paperSize: PaperSize.A4,
    colourMode: ColourMode.BW,
    duplexMode: DuplexMode.SINGLE,
    basePrice: 2.5,
    bindingPrice: 20.0,
    laminationPrice: 15.0,
    gstPercentage: 18.0,
    active: true,
  });
  if (!validConfigInput.success) throw new Error('Valid pricing config schema validation failed');

  const invalidConfigInput = updatePricingConfigSchema.safeParse({
    paperSize: PaperSize.A4,
    basePrice: -10, // Invalid negative basePrice
  });
  if (invalidConfigInput.success) throw new Error('Invalid negative basePrice config schema test failed');
  console.log('✓ Update pricing config schema validation tests passed.');

  console.log('--- ALL PRICING ENGINE UNIT TESTS PASSED SUCCESSFULLY ---');
}

runPricingTests().catch(err => {
  console.error('Pricing unit test failed:', err);
  process.exit(1);
});
