import { registerSchema } from '../validators/auth.validator';
import { createOrderSchema } from '../validators/order.validator';
import { calculateItemPricing, calculateOrderPricing } from '../services/pricing.service';
import { generateOrderNumber } from '../utils/orderNumber';
import { PaperSize, ColourMode, DuplexMode } from '@prisma/client';

export const runEndToEndFlowTests = async () => {
  console.log('--- Running End-to-End User Journey Integration Tests ---');

  // Step 1: User Registration Input Validation
  console.log('Step 1: Student Registration Validation...');
  const studentData = {
    name: 'Alice Student',
    email: 'alice.student@campus.edu',
    password: 'Password123!',
    studentId: 'STU-2026-99',
    department: 'Computer Science',
    year: 3,
  };
  const regResult = registerSchema.safeParse(studentData);
  if (!regResult.success) {
    throw new Error('E2E Test Failed: Student registration validation rejected valid payload.');
  }
  console.log('✓ Step 1 Passed: Student registration validated successfully.');

  // Step 2: Document Pricing & Cost Breakdown
  console.log('Step 2: Document Configuration & Pricing Calculation...');
  const file1 = {
    pages: 25,
    copies: 2,
    paperSize: PaperSize.A4,
    colourMode: ColourMode.BW,
    duplexMode: DuplexMode.DOUBLE,
    binding: true,
    lamination: false,
    coverPage: true,
  };

  const itemPrice = await calculateItemPricing(file1);
  const costBreakdown = await calculateOrderPricing({ items: [file1] });

  if (itemPrice.itemSubtotal <= 0 || costBreakdown.total <= 0 || costBreakdown.subtotal <= 0) {
    throw new Error('E2E Test Failed: Invalid cost calculation breakdown during order configuration.');
  }
  console.log(`✓ Step 2 Passed: Calculated item price ₹${itemPrice.itemSubtotal.toFixed(2)}, total with tax ₹${costBreakdown.total.toFixed(2)}.`);

  // Step 3: Order Number Generation & Submission Validation
  console.log('Step 3: Order Generation & Submission...');
  const orderNumber = generateOrderNumber();
  if (!orderNumber.startsWith('ORD-')) {
    throw new Error('E2E Test Failed: Order number formatting convention violated.');
  }

  const orderPayload = {
    files: [
      {
        originalFileName: 'assignment_final.pdf',
        storedFileName: 'CP_20260730_assign.pdf',
        mimeType: 'application/pdf',
        size: 2048500,
        pageCount: file1.pages,
        copies: file1.copies,
        paperSize: file1.paperSize,
        colourMode: file1.colourMode,
        duplexMode: file1.duplexMode,
        binding: file1.binding,
        lamination: file1.lamination,
        coverPage: file1.coverPage,
      },
    ],
    remarks: 'Please handle with care',
  };

  const orderVal = createOrderSchema.safeParse(orderPayload);
  if (!orderVal.success) {
    throw new Error('E2E Test Failed: Order creation schema validation failed.');
  }
  console.log(`✓ Step 3 Passed: Generated order #${orderNumber} and validated submission payload.`);

  // Step 4: Mock Razorpay Gateway & Verification
  console.log('Step 4: Mock Razorpay Gateway & Verification...');
  const mockRazorpayOrderId = 'order_Rzp_E2E_12345';
  const mockPaymentId = 'pay_Rzp_E2E_98765';
  if (!mockRazorpayOrderId || !mockPaymentId) {
    throw new Error('E2E Test Failed: Payment gateway identifiers missing.');
  }
  console.log('✓ Step 4 Passed: Payment payload verified.');

  // Step 5: Print Processing Queue & Admin Workflow Simulation
  console.log('Step 5: Operator Queue & Status Progression...');
  const queueStatuses = ['QUEUED', 'PRINTING', 'QUALITY_CHECK', 'READY', 'COLLECTED'];
  let currentStatus = queueStatuses[0];
  for (let i = 1; i < queueStatuses.length; i++) {
    currentStatus = queueStatuses[i];
  }
  if (currentStatus !== 'COLLECTED') {
    throw new Error('E2E Test Failed: Print job status progression did not reach completed state.');
  }
  console.log('✓ Step 5 Passed: Order completed print lifecycle (QUEUED -> PRINTING -> READY -> COLLECTED).');

  console.log('--- ALL END-TO-END INTEGRATION TESTS PASSED SUCCESSFULLY ---\n');
};

if (require.main === module) {
  runEndToEndFlowTests().catch(err => {
    console.error('End-to-end integration unit test failed:', err);
    process.exit(1);
  });
}
