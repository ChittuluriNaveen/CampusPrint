import { ColourMode, DuplexMode, OrderStatus, PaperSize } from '@prisma/client';
import { generateOrderNumber } from '../utils/orderNumber';
import { createOrderSchema, orderQuerySchema, updateOrderStatusSchema } from '../validators/order.validator';

async function runOrderTests() {
  console.log('--- Running Print Order Management Unit Tests ---');

  // 1. Order number generator test
  console.log('Testing order number generator format...');
  const orderNum = generateOrderNumber();
  console.log(`Generated order number: ${orderNum}`);
  if (!orderNum.startsWith('ORD-') || orderNum.split('-').length !== 3) {
    throw new Error('Order number format validation failed');
  }
  console.log('✓ Order number format test passed.');

  // 2. Create Order Schema Validation
  console.log('Testing createOrderSchema validator...');
  const validOrderInput = createOrderSchema.safeParse({
    remarks: 'Please staple on top left',
    files: [
      {
        originalFileName: 'Assignment.pdf',
        storedFileName: 'CP_20260730_12345678.pdf',
        mimeType: 'application/pdf',
        size: 204800,
        pageCount: 10,
        copies: 2,
        paperSize: PaperSize.A4,
        colourMode: ColourMode.BW,
        duplexMode: DuplexMode.DOUBLE,
      },
    ],
  });
  if (!validOrderInput.success) throw new Error('Valid create order schema test failed');

  const invalidOrderInput = createOrderSchema.safeParse({
    files: [], // empty files list invalid
  });
  if (invalidOrderInput.success) throw new Error('Empty files create order schema test failed');
  console.log('✓ Create order schema validation tests passed.');

  // 3. Update Order Status Schema Validation
  console.log('Testing updateOrderStatusSchema validator...');
  const validStatusUpdate = updateOrderStatusSchema.safeParse({
    status: OrderStatus.PRINTING,
    remarks: 'Print job started on High-Speed Printer 01',
  });
  if (!validStatusUpdate.success) throw new Error('Valid order status update schema test failed');

  const invalidStatusUpdate = updateOrderStatusSchema.safeParse({
    status: 'INVALID_STATUS_STRING',
  });
  if (invalidStatusUpdate.success) throw new Error('Invalid order status update schema test failed');
  console.log('✓ Update order status schema validation tests passed.');

  // 4. Order Query Schema Parsing
  console.log('Testing orderQuerySchema validator...');
  const parsedQuery = orderQuerySchema.parse({
    page: '2',
    limit: '25',
    status: OrderStatus.QUEUED,
    search: 'ORD-2026',
  });
  if (parsedQuery.page !== 2 || parsedQuery.limit !== 25 || parsedQuery.status !== OrderStatus.QUEUED) {
    throw new Error('Order query schema parsing test failed');
  }
  console.log('✓ Order query schema validation tests passed.');

  console.log('--- ALL PRINT ORDER MANAGEMENT UNIT TESTS PASSED SUCCESSFULLY ---');
}

runOrderTests().catch(err => {
  console.error('Order unit test failed:', err);
  process.exit(1);
});
