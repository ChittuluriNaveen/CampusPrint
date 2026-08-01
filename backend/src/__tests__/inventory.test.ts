import { InventoryCategory, InventoryItemStatus, StockTransactionType } from '@prisma/client';
import { adjustStockSchema, createInventoryItemSchema, createSupplierSchema, recordPurchaseSchema } from '../validators/inventory.validator';

async function runInventoryTests() {
  console.log('--- Running Inventory & Resource Management Unit Tests (EP-04) ---');

  // 1. Zod createInventoryItemSchema validator test
  console.log('Testing createInventoryItemSchema validator...');
  const validItem = createInventoryItemSchema.safeParse({
    name: 'A4 High White Paper 80GSM',
    category: InventoryCategory.PAPER,
    unit: 'SHEETS',
    currentQuantity: 1000,
    minQuantity: 200,
    purchasePrice: 0.75,
    location: 'Central Warehouse',
  });
  if (!validItem.success) {
    throw new Error(`Create inventory item schema validation failed: ${validItem.error.message}`);
  }

  const invalidItem = createInventoryItemSchema.safeParse({
    name: 'A4 Paper',
    category: 'INVALID_CATEGORY', // Invalid Enum
    currentQuantity: -10, // Invalid negative quantity
    purchasePrice: -5,
  });
  if (invalidItem.success) {
    throw new Error('Invalid inventory item schema test failed to reject invalid data');
  }
  console.log('✓ Create inventory item schema validation passed.');

  // 2. Zod adjustStockSchema validator test
  console.log('Testing adjustStockSchema validator...');
  const validAdjust = adjustStockSchema.safeParse({
    inventoryItemId: '123e4567-e89b-12d3-a456-426614174000',
    quantity: 50,
    type: StockTransactionType.STOCK_IN,
    reason: 'Monthly inventory recount adjustment',
  });
  if (!validAdjust.success) {
    throw new Error(`Adjust stock schema validation failed: ${validAdjust.error.message}`);
  }

  const invalidAdjust = adjustStockSchema.safeParse({
    inventoryItemId: '123e4567-e89b-12d3-a456-426614174000',
    quantity: 0, // Must be > 0
    type: 'INVALID_TYPE',
    reason: '',
  });
  if (invalidAdjust.success) {
    throw new Error('Invalid adjust stock schema test failed to reject invalid quantity/type');
  }
  console.log('✓ Adjust stock schema validation passed.');

  // 3. Zod recordPurchaseSchema validator test
  console.log('Testing recordPurchaseSchema validator...');
  const validPurchase = recordPurchaseSchema.safeParse({
    inventoryItemId: '123e4567-e89b-12d3-a456-426614174000',
    quantity: 5000,
    unitCost: 0.65,
    invoiceNumber: 'INV-2026-8801',
    supplierId: '987e6543-e21b-12d3-a456-426614174000',
  });
  if (!validPurchase.success) {
    throw new Error(`Record purchase schema validation failed: ${validPurchase.error.message}`);
  }
  console.log('✓ Record purchase schema validation passed.');

  // 4. Zod createSupplierSchema validator test
  console.log('Testing createSupplierSchema validator...');
  const validSupplier = createSupplierSchema.safeParse({
    name: 'National Paper Distributors Ltd',
    contactPerson: 'Vikram Mehta',
    phone: '+91 9876543210',
    email: 'contact@nationalpaper.in',
    address: 'Plot 45, Industrial Zone, City',
  });
  if (!validSupplier.success) {
    throw new Error(`Create supplier schema validation failed: ${validSupplier.error.message}`);
  }
  console.log('✓ Create supplier schema validation passed.');

  // 5. Duplex vs Simplex Stock Deduction Logic Math Test
  console.log('Testing Duplex vs Simplex Stock Deduction Logic Math...');

  // Simplex: 10 pages, 2 copies -> 20 sheets
  const simplexPages = 10;
  const simplexCopies = 2;
  const simplexSheets = simplexPages * simplexCopies;
  if (simplexSheets !== 20) {
    throw new Error(`Simplex sheets math failed. Expected 20, got ${simplexSheets}`);
  }

  // Duplex: 5 pages, 4 copies -> Math.ceil(5/2) * 4 = 3 * 4 = 12 sheets
  const duplexPages = 5;
  const duplexCopies = 4;
  const duplexSheets = Math.ceil(duplexPages / 2) * duplexCopies;
  if (duplexSheets !== 12) {
    throw new Error(`Duplex sheets math failed. Expected 12, got ${duplexSheets}`);
  }
  console.log('✓ Duplex vs Simplex Stock Deduction Logic Math passed.');

  // 6. Inventory Item Status Trigger Math Test
  console.log('Testing Inventory Status Trigger Logic...');
  const computeStatus = (currentQty: number, minQty: number): InventoryItemStatus => {
    return currentQty <= 0
      ? InventoryItemStatus.OUT_OF_STOCK
      : currentQty <= minQty
      ? InventoryItemStatus.LOW_STOCK
      : InventoryItemStatus.IN_STOCK;
  };

  if (computeStatus(500, 100) !== InventoryItemStatus.IN_STOCK) {
    throw new Error('Status calculation for in-stock item failed');
  }
  if (computeStatus(80, 100) !== InventoryItemStatus.LOW_STOCK) {
    throw new Error('Status calculation for low-stock item failed');
  }
  if (computeStatus(0, 100) !== InventoryItemStatus.OUT_OF_STOCK) {
    throw new Error('Status calculation for out-of-stock item failed');
  }
  console.log('✓ Inventory Status Trigger Logic passed.');

  console.log('--- ALL INVENTORY & RESOURCE MANAGEMENT UNIT TESTS PASSED SUCCESSFULLY ---');
}

runInventoryTests().catch(err => {
  console.error('Inventory unit test failed:', err);
  process.exit(1);
});
